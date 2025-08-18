import { getClaimOutcome, shouldTestPass } from '@/utils/claimUtils';
import { TestResult, TestCaseItem, Result } from '@/lib/types';
import { api, API_BASE_URL } from '@/lib/utils';
import { createResult, getPatientByCrID, getPractitionerByPuID, getProviderByFID, postPatient, postPractitioner, postProvider } from '@/lib/api';
import { practitionerPayload } from '@/lib/practitioner';
import { providerPayload } from '@/lib/providers';
import { patientPayload } from '@/lib/patient';

/**
 * Submits a claim and returns test results
 * @param testData The test case data
 * @param testCase Optional test case metadata
 * @returns Promise<TestResult[]> Array of test results
 */
export const runTestSuite = async (
  testData: any,
  testCase?: TestCaseItem[]
): Promise<TestResult[]> => {
  try {
    // Track execution time
    const startTime = Date.now();
    const response = await api.post(`${API_BASE_URL}/api/claims/submit`, testData);
    const duration = Date.now() - startTime;

    // Validate response
    if (response.status !== 200 || !response.data || typeof response.data !== 'object') {
      throw new Error(response.status !== 200 
        ? `API call failed with status ${response.status}` 
        : 'Invalid response format');
    }

    // Extract claim ID from response
    const claimEntry = response.data.fhirBundle?.entry?.find(
      (entry: any) => entry.resource?.resourceType === 'Claim'
    );
    const claimId = claimEntry?.resource?.id || 'unknown-claim-id';

    // Get test case ID if available
    const testCaseId = testCase?.find(i => i.name === testData?.formData?.title)?.id;

    // Outcome
    const initialOutcome = response.data.data?.entry
      ?.find((e: any) => e.resource?.resourceType === 'ClaimResponse')
      ?.resource?.extension?.find((i: any) => i.url.endsWith('claim-state-extension'))
      ?.valueCodeableConcept?.coding?.find((s: any) => s.system.endsWith('claim-state'))
      ?.display || '';

    const finalOutcome = initialOutcome !== 'Pending' 
      ? initialOutcome 
      : await getClaimOutcome(claimId);

    // Create test result
    const result: TestResult = {
      id: response.data.data?.id || `generated-${Date.now()}`,
      name: testData?.formData?.title || 'Claim Submission',
      use: testData?.formData?.use,
      status: shouldTestPass(response.data.success,testData?.formData?.test, finalOutcome) ? 'passed' : 'failed',
      duration,
      timestamp: new Date().toISOString(),
      message: response.data.message,
      claimId,
      outcome: finalOutcome,
      details: {
        request: testData,
        response: response.data.data,
        fhirBundle: response.data.fhirBundle,
        validationErrors: response.data.validation_errors || [],
        errorMessage: response.data.error ? String(response.data.error) : response.data.message,
        statusCode: response.status
      }
    };

    // Save result to database if test case ID exists
    if (testCaseId != null) {
      try {
        const respResult: Result = {
          testcase_id: testCaseId,
          result_status: response.data.success && testData?.formData?.test === 'positive' ? 1 : 0,
          message: finalOutcome,
          detail: response.data.message,
          status_code: response.status.toString(),
          claim_id: claimId
        };
        await createResult(respResult);
      } catch (error) {
        console.error('Error saving result:', error);
      }
    }

    await ensureResourcesExist(testData.formData);

    return [result];
  } catch (error: any) {
    return [handleTestError(error, testData, testCase)];
  }
};

/**
 * Ensures required practitioner, provider, and patient resources exist
 */
const ensureResourcesExist = async (formData: any) => {
  try {
    const [practitioner, provider, patient] = await Promise.all([
      getPractitionerByPuID(formData?.practitioner?.id),
      getProviderByFID(formData?.provider?.id),
      getPatientByCrID(formData?.patient?.id)
    ]);

    await Promise.all([
      !practitioner && postPractitioner(practitionerPayload(formData.practitioner)),
      !provider && postProvider(providerPayload(formData.provider)),
      !patient && postPatient(patientPayload(formData.patient))
    ]);
  } catch (error) {
    console.error("Error ensuring resources exist:", error);
  }
};

/**
 * Handles test execution errors and returns error result
 */
const handleTestError = (error: any, testData: any, testCase?: TestCaseItem[]) => {
  const errorResponse = error?.response?.data;
  const statusCode = error?.response?.status;
  
  let errorMessage = 'Unknown error occurred';
  if (errorResponse) {
    errorMessage = typeof errorResponse === 'string' 
      ? errorResponse
      : errorResponse.message || errorResponse.error || 'Request failed';
  }

  const errorResult: TestResult = {
    id: `error-${Date.now()}`,
    name: testData?.formData?.title || 'Claim Submission',
    status: testData?.formData?.test === "negative" ? 'passed' : 'failed',
    use: testData?.formData?.use,
    duration: 0,
    timestamp: new Date().toISOString(),
    message: errorMessage,
    details: {
      request: testData,
      error: error.message,
      errorMessage: errorResponse.error,
      statusCode,
      response: errorResponse,
      validationErrors: errorResponse?.validation_errors || []
    }
  };

  const testCaseId = testCase?.find(i => i.name === testData?.formData?.title)?.id;
  if (testCaseId != null) {
    const respData: Result = {
      testcase_id: testCaseId,
      result_status: testData?.formData?.test === 'negative' ? 1 : 0,
      message: errorMessage,
      detail: error.message,
      status_code: statusCode?.toString() || '500'
    };
    createResult(respData).catch(err => console.error('Error saving error result:', err));
  }

  return errorResult;
};