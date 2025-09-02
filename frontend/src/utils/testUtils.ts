import { getClaimOutcome, shouldTestPass } from '@/utils/claimUtils';
import { TestResult, TestCaseItem, Result, TestCase } from '@/lib/types';
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
  testData: TestCase,
  testCase?: TestCaseItem[]
): Promise<TestResult[]> => {
  try {
    // Track execution time
    const startTime = Date.now();
    const response = await api.post(`${API_BASE_URL}/api/claims/submit`, testData);
    const duration = Date.now() - startTime;

    console.log("API Response:", response.data);

    // Check if the overall request was successful
    if (!response.data.success) {
      // Handle API-level failure (like 400 errors)
      return [handleTestError(response.data, testData, testCase, duration)];
    }

    // Check if the data layer was successful
    if (!response.data.data?.success) {
      // Handle data-level failure
      return [handleTestError(response.data, testData, testCase, duration)];
    }

    // Validate response - check for either 200 or 201 status in the data layer
    if (response.data.data?.status !== 200 && response.data.data?.status !== 201) {
      throw new Error(`API call failed with status ${response.data.data?.status}`);
    }

    if (typeof response.data.data !== 'object') {
      throw new Error('Invalid response format');
    }

    // Extract claim ID from response
    const claimEntry = response.data.data.data?.entry?.find(
      (entry: any) => entry.resource?.resourceType === 'Claim'
    );
    const claimId = claimEntry?.resource?.id || 'unknown-claim-id';

    // Get test case ID if available
    const testCaseId = testCase?.find(i => i.name === testData?.formData?.title)?.id;

    // Outcome
    let finalOutcome = '';
    try {
      const initialOutcome = response.data.data.data?.entry
        ?.find((e: any) => e.resource?.resourceType === 'ClaimResponse')
        ?.resource?.extension?.find((i: any) => i.url.endsWith('claim-state-extension'))
        ?.valueCodeableConcept?.coding?.find((s: any) => s.system.endsWith('claim-state'))
        ?.display || '';

      finalOutcome = initialOutcome !== 'Pending'
        ? initialOutcome
        : await getClaimOutcome(claimId);
    } catch (outcomeError) {
      console.error('Error getting claim outcome:', outcomeError);
      finalOutcome = 'Error determining outcome';
    }

    console.log('finalOutcome:', finalOutcome);
    console.log('claim id:', claimId);

    // Determine test status
    const testPassed = shouldTestPass(
      response.data.data.success,
      testData?.formData?.test,
      finalOutcome
    );

    // Create test result
    const result: TestResult = {
      id: response.data.data.data?.id || `generated-${Date.now()}`,
      req: response.data.data.data,
      test: testData?.formData?.test,
      name: testData?.formData?.title || 'Claim Submission',
      use: testData?.formData?.use,
      status: testPassed ? 'passed' : 'failed',
      duration,
      timestamp: new Date().toISOString(),
      message: response.data.data.message || 'Claim submitted successfully',
      claimId,
      outcome: finalOutcome,
      details: {
        request: testData,
        response: response.data.data,
        fhirBundle: response.data.data.fhirBundle || response.data.fhirBundle,
        validationErrors: response.data.data.validation_errors || [],
        errorMessage: response.data.data.error?.message ? String(response.data.data.error) : response.data.message,
        statusCode: response.status
      }
    };

    // Save result to database if test case ID exists
    if (testCaseId != null) {
      try {
        const respResult: Result = {
          testcase_id: testCaseId,
          result_status: testPassed ? 1 : 0,
          message: finalOutcome,
          detail: response.data.message || 'Claim processed',
          status_code: response.status.toString(),
          claim_id: claimId
        };
        await createResult(respResult);
      } catch (error) {
        console.error('Error saving result:', error);
      }
    }

    // // Ensure resources exist (run in background, don't await)
    // ensureResourcesExist(testData.formData).catch(error => {
    //   console.error("Error ensuring resources exist:", error);
    // });

    return [result];
  } catch (error: any) {
    return [handleTestError(error, testData, testCase)];
  }
};

/**
 * Ensures required practitioner, provider, and patient resources exist
 */
const ensureResourcesExist = async (formData: TestCase['formData']) => {
  try {
    if (!formData) return;

    const [practitioner, provider, patient] = await Promise.allSettled([
      formData?.practitioner?.id ? getPractitionerByPuID(formData.practitioner.id) : Promise.resolve(null),
      formData?.provider?.id ? getProviderByFID(formData.provider.id) : Promise.resolve(null),
      formData?.patient?.id ? getPatientByCrID(formData.patient.id) : Promise.resolve(null)
    ]);

    const creationPromises = [];

    if (formData?.practitioner) {
      creationPromises.push(postPractitioner(practitionerPayload(formData.practitioner)));
    }

    if (formData?.provider) {
      creationPromises.push(postProvider(providerPayload(formData.provider)));
    }

    if (formData?.patient) {
      creationPromises.push(postPatient(patientPayload(formData.patient)));
    }

    if (creationPromises.length > 0) {
      await Promise.allSettled(creationPromises);
    }
  } catch (error) {
    console.error("Error ensuring resources exist:", error);
    throw error;
  }
};

/**
 * Handles test execution errors and returns error result
 */
const handleTestError = (error: any, testData: TestCase, testCase?: TestCaseItem[], duration?: number): TestResult => {
  const errorResponse = error?.response?.data || error;
  const statusCode = error?.response?.status || error?.status || 500;

  let errorMessage = 'Unknown error occurred';
  if (errorResponse) {
    if (typeof errorResponse === 'string') {
      errorMessage = errorResponse;
    } else if (errorResponse.error?.message) {
      errorMessage = errorResponse.error.message;
    } else if (errorResponse.message) {
      errorMessage = errorResponse.message;
    } else if (errorResponse.error) {
      errorMessage = errorResponse.error;
    } else {
      errorMessage = JSON.stringify(errorResponse);
    }
  } else if (error.message) {
    errorMessage = error.message;
  }


  const isNegativeTest = testData?.formData?.test === "negative";
  const testCaseId = testCase?.find(i => i.name === testData?.formData?.title)?.id;

  const errorResult: TestResult = {
    id: `error-${Date.now()}`,
    req: error,
    test: testData?.formData?.test,
    name: testData?.formData?.title || 'Claim Submission',
    status: isNegativeTest ? 'passed' : 'failed',
    use: testData?.formData?.use,
    duration: duration || 0,
    timestamp: new Date().toISOString(),
    message: errorMessage,
    details: {
      request: testData,
      error: typeof errorResponse?.error?.error === 'object'
        ? errorResponse?.error?.error?.message
        : errorResponse?.error?.error,
      fhirBundle: errorResponse.error.fhirBundle,
      errorMessage: errorMessage,
      statusCode: statusCode,
      response: errorResponse,
      validationErrors: errorResponse.validation_errors || []
    }
  };

  if (testCaseId != null) {
    const respData: Result = {
      testcase_id: testCaseId,
      result_status: isNegativeTest ? 1 : 0,
      message: errorMessage,
      detail: error.message || errorMessage,
      status_code: statusCode.toString(),
      claim_id: 'error-no-claim-id'
    };
    createResult(respData).catch(err => console.error('Error saving error result:', err));
  }

  return errorResult;
};