import axios from 'axios';
import { Provider, Patient, PatientBundle, FormatPatient, FormatProvider, ProviderItem, Practitioner, PractitionerBundle, ProviderBundle, PractitionerItem, Intervention, Package, TestCaseItem, Result, ApiResponse, TestResult } from './types';
import { hiePatients, patientPayload, patients } from './patient';
import { HIE_URL } from './utils';
import { hieProviders, providerPayload } from './providers';
import { hiePractitioners, practitionerPayload } from './practitioner';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export const runTestSuite = async (testData: any, testCase?: TestCaseItem[]): Promise<TestResult[]> => {
  try {
    const startTime = Date.now();
    const response = await api.post<ApiResponse>(`${API_BASE_URL}/api/claims/submit`, testData);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    console.log('API response:', testData);

    if (response.status !== 200) {
      throw new Error(`API call failed with status ${response.status}`);
    }

    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid response format');
    }

    // Create a test result from the API response
    

    const claimEntry = response.data.fhirBundle?.entry?.find((entry: any) => entry.resource?.resourceType === 'Claim');
    const claimId = claimEntry?.resource?.id || 'unknown-claim-id';

    const id = testCase?.find(i => i.name === testData?.formData?.title)?.id || 1;
    const res = testData?.formData?.test === 'positive' ? 1 : 0;
    const entry = response.data.data?.entry?.find((e: any) => e.resource?.resourceType === 'ClaimResponse');
    const ext = entry?.resource.extension.find((i: any) => i.url.endsWith('claim-state-extension'));
    const valueCode = ext?.valueCodeableConcept.coding.find((s: any) => s.system.endsWith('claim-state'));
    const outcome = valueCode?.display  || '';

    function delay(time: number) {
      return new Promise(resolve => setTimeout(resolve, time));
    }

      const respOutcome = async (out: string) => {
        await delay(1000);
        const response = await api.get<any>(`${API_BASE_URL}/api/claims/${out}`);
        
        
        const ext = response.data?.data?.extension?.find(
          (i: any) => i.url.endsWith('claim-state-extension')
        );

        const valueCode = ext?.valueCodeableConcept?.coding?.find(
          (s: any) => s.system.endsWith('claim-state')
        );

        const outcome = valueCode?.display || '';
        return outcome;
      };

    
      
  const finalOutcome = outcome !== 'Pending' ? outcome : await respOutcome(claimId);


    console.log('success:', response?.data?.success);
console.log('finalOutcome:', finalOutcome?.value);
console.log('test:', testData?.formData?.test);


    const result: TestResult = {
      id: response.data.data?.id || 'generated-id',
      name: testData?.formData?.title || 'Claim Submission',
      use: testData?.formData?.use,
      status: (
        response?.data?.success &&
        (finalOutcome === "Approved" || finalOutcome === "Sent for payment processing") &&
       ( testData?.formData?.test === 'positive' || testData?.formData?.test === "build")
      ) ? 'passed' : 'failed',

      duration: responseTime,
      timestamp: new Date().toISOString(),
      message: response.data.message,
      claimId: claimId,
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


    const respResult: Result = {
      testcase_id: id,
      result_status: res,
      message: finalOutcome,
      detail: response.data.message,
      status_code: response.status.toString(),
      claim_id: claimId
    };

    if (id != null || id != undefined) {
      try {
        const resp = await createResult(respResult);
        console.log('result response', resp);
        
      } catch (error) {
        console.error(error);
        
      }
    }


  console.log('Test execution result:', result);
  try {
  const crID = testData.formData?.patient?.id;
  const fID = testData.formData?.provider?.id;
  const puID = testData.formData?.practitioner?.id;
  const existingPractitioner = await getPractitionerByPuID(puID);
  const existingProvider = await getProviderByFID(fID);
  const existingPatient = await getPatientByCrID(crID);

  if (!existingPractitioner) {
    const payload = practitionerPayload(testData.formData.practitioner);
    await postPractitioner(payload);
  }
  if (!existingPatient) {
    const payload = patientPayload(testData.formData.patient);
    await postPatient(payload);
  }
  if (!existingProvider) {
    const providerpayload = providerPayload(testData.formData.provider);
    await postProvider(providerpayload);
  }
} catch (error) {
  console.error("Error psting patient:", error);
}

    return [result];
  } catch (error: any) {
    console.error('Error running tests:', error?.response?.data || error.message);

    // Extract error details from axios error response
    const errorResponse = error?.response?.data;
    const statusCode = error?.response?.status;
    let errorMessage = 'Unknown error occurred';
    let errorDetails = error.message;

    if (errorResponse) {
      if (typeof errorResponse === 'string') {
        errorMessage = errorResponse;
      } else if (errorResponse.error) {
        errorMessage = errorResponse.message || 'Request failed';
        errorDetails = typeof errorResponse.error === 'object' 
          ? JSON.stringify(errorResponse.error) 
          : errorResponse.error;
      } else if (errorResponse.message) {
        errorMessage = errorResponse.message;
      }
    }

    const errorResult: TestResult = {
      id: 'error-' + Date.now().toString(),
      name: testData?.formData?.title || 'Claim Submission',
      status: testData.formData.test === "negative" ? 'passed' : 'failed',
      use: testData?.formData?.use,
      duration: 0,
      timestamp: new Date().toISOString(),
      message: errorMessage,
      details: {
        request: testData,
        error: errorDetails,
        errorMessage: errorMessage,
        statusCode: statusCode,
        response: error?.response?.data,
        validationErrors: errorResponse?.validation_errors || []
      }
    };

    const id = testCase?.find(i => i.name === testData?.formData?.title)?.id || 0;
    const result = testData?.formData?.test === 'negative' ? 1 : 0;
    const respData: Result = {
      testcase_id: id,
      result_status: result,
      message: errorMessage,
      detail: errorDetails,
      status_code: statusCode
    };
    if (id != null || id != undefined) {
      try {
        const resp = await createResult(respData);
        console.log('result response', resp);
        
      } catch (error) {
        console.error(error);
        
      }
    }
    return [errorResult];
  }
};

export const getTestHistory = async (): Promise<TestResult[]> => {
  const response = await axios.get(`${API_BASE_URL}/tests/history`);
  return response.data;
};

export const getProvide = async (): Promise<FormatProvider[]> => {
  try {
    const resp = await api.get<ProviderItem[]>('/api/providers');
    return resp.data.map((item): FormatProvider => ({
      id: item.f_id,
      name: item.name,
      level: item.level,
      identifiers: [
        {
          system: 'slade_code',
          value: item?.slade_code || "",
        },
      ],
      active: item.status === 1,
    }));
  } catch (error) {
    console.error('Error fetching providers:', error);
    return [];
  }
};

export const searchProviderHie = async (param: string, search: string): Promise<FormatProvider[]> => {
  try {
    const resp = await api.get<ProviderBundle>(
      `${HIE_URL.BASE_URL}/${HIE_URL.PATHS.ORGANIZATION}?${param}=${search}`
    );

    const resources = resp.data.entry?.map((e) => e.resource) ?? [];
    return hieProviders(resources);
  } catch (error) {
    console.error("Error fetching HIE provider: ", error);
    return [];
  }
};

export const searchProvider = async(param: string, search: string) => {
  try {
    const resp = await api.get<Provider>(`/api/providers?${param}=${search}`);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const postProvider = async(data: ProviderItem) => {
  try {
    const resp = await api.post<ProviderItem>("/api/providers", data)
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const getProviderByFID = async(fID: string) => {
  try {
    const resp = await api.get<ProviderItem>(`/api/providers/${fID}`);
    return resp;
  } catch (error) {
    console.error('--> Error getting provider',error);
    
  }
}

// Patient
export const getPatients = async () => {
  try {
    const resp = await api.get<Patient[]>("/api/patients");
    return patients(resp.data);
  } catch (error) {
    console.error(error);
  }
}

export const searchPatient = async(param: string, search: string) => {
  try {
    const resp = await api.get<Patient>(`/api/patients?${param}=${search}`);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const searchPatientHie = async (param: string, search: string): Promise<FormatPatient[]> => {
  try {
    const resp = await api.get<PatientBundle>(
      `${HIE_URL.BASE_URL}/${HIE_URL.PATHS.PATIENT}?${param}=${search}`
    );

    const resources = resp.data.entry?.map((e) => e.resource) ?? [];
    return hiePatients(resources);
  } catch (error) {
    console.error("Error fetching HIE patient: ", error);
    return [];
  }
};

export const postPatient = async(data: Patient) => {
  try {
    const resp = await api.post<Patient>("/api/patients", data);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const getPatientByCrID = async(crID: string) => {
  try {
    const resp = await api.get<Patient>(`/api/patients/${crID}`);
    return resp;
  } catch (error) {
    console.error('Error fetching patient with CRID: ', error);
  }
}

// Practitioner
export const getPractitioner = async (): Promise<Practitioner[]> => {
  try {
    const resp = await api.get<PractitionerItem[]>("/api/practitioners");
    return resp.data.map((item): Practitioner => ({
      id: item.pu_id,
      name: item.name,
      gender: item.gender,
      phone: item.phone,
      address: item.address,
      nationalID: item.national_id,
      email: item.email,
      sladeCode: item.slade_code,
      regNumber:item.reg_number,
      status: item.status === 1
    }));
  } catch (error) {
    console.error("Error fetching HIE practitioner: ",error);
    return [];
  }
}

export const searchPractitionerHie = async (param: string, search: string): Promise<Practitioner[]> => {
  try {
    const resp = await api.get<PractitionerBundle>(
      `${HIE_URL.BASE_URL}/${HIE_URL.PATHS.PARCTITIONER}?${param}=${search}`
    );

    const resources = resp.data.entry?.map((e) => e.resource) ?? [];
    return hiePractitioners(resources);
  } catch (error) {
    console.error("Error fetching HIE provider: ", error);
    return [];
  }
};

export const searchPractitioner = async(param: string, search: string) => {
  try {
    const resp = await api.get<PractitionerItem>(`/api/practitioners?${param}=${search}`);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const postPractitioner = async(data: PractitionerItem) => {
  try {
    const resp = await api.post<PractitionerItem>("/api/practitioners", data);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const getPractitionerByPuID = async(puID: string) => {
  try {
    const resp = await api.get<PractitionerItem>(`/api/practitioners/${puID}`);
    return resp;
  } catch (error) {
    console.error('--> Error fetching practitioner: ', error);
  }
}



export const getIntervention = async () => {
  try {
    const resp = await api.get<Intervention[]>("/api/interventions");
    return resp.data;
  } catch (error) {
    console.error(error);
  }
}

export const searchIntervention = async(search: string) => {
  try {
    const resp = await api.get<Intervention>(`/api/interventions/${search}`);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const postIntervention = async(data: Intervention) => {
  try {
    const resp = await api.post<Intervention>("/api/interventions", data);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const getInterventionByPackageId = async(package_id: number) => {
  try {
    const resp = await api.get<Intervention>(`/api/interventions/${package_id}`);
    return resp.data;
  } catch (error) {
    console.error('--> Error fetching interventions by package id: ', error);
    
  }
}

export const getInterventionByCode = async(code: string) => {
  try {
    const resp = await api.get(`/api/interventions/code/${code}`);
    return resp;
  } catch (error) {
    console.error('--> Error getting intervention', error);
  }
}


// Package
export const getPackages = async () => {
  try {
    const resp = await api.get<Package[]>("/api/packages");
    return resp.data;
  } catch (error) {
    console.error(error);
  }
}

export const searchPackage = async(search: string) => {
  try {
    const resp = await api.get<Package>(`/api/packages/${search}`);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const postPackage = async(data: Package) => {
  try {
    const resp = await api.post<Package>("/api/packages", data);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

// Test case

export interface Error{
  error: {message: string}
}
export const getTestcases = async () => {
  try {
    const resp = await api.get<TestCaseItem[]>("/api/test-cases");
    return resp.data;
  } catch (error) {
    console.error(error);
  }
}

export const searchTestCase = async(search: string) => {
  try {
    const resp = await api.get<TestCaseItem>(`/api/test-cases/${search}`);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const postTestCase = async(data: TestCaseItem) => {
  
  try {
    const resp = await api.post<TestCaseItem>("/api/test-cases", data);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const getTestCaseByCode = async(code: string) => {
  try {
    const resp = await api.get<TestCaseItem[]>(`/api/test-cases/${code}`);
    return resp;
  } catch (error) {
    console.error(error);
    
  }
}

export const updateTestCase = async(id: any, data: any) => {
  try {
    const resp = await api.put<TestCaseItem>(`/api/test-cases/update/${id}`, {result_status: data});
    return resp;
  } catch (error) {
    console.error(error);
  }
}

// Results

export const getResults = async ()=> {
  try{
    const resp = await api.get<Result[]>("/api/results");
    return resp;
  } catch (error) {
    console.error(error);
    
  }
} 

export const getResultById = async(id: number) => {
  try {
    const resp = await api.get<Result>(`/api/results/${id}`);
    return resp;
  } catch (error) {
    console.error(error);
    
  }
}

export const createResult = async(data: Result) => {
  try {
    const resp = await api.post<Result>("/api/results", data);
    return resp;
  } catch (error) {
    console.error(error);
    
  }
}

export const updateResult = async(id: number, status: number) => {
  try {
    const resp = await api.put<Result>(`/api/results/${id}`, {result_status: status});
    return resp;
  } catch (error) {
    console.error(error);
    
  }
}

export const deleteResult = async(id: number) => {
  try {
    const resp = await api.delete<Result>(`/api/results/${id}`);
    return resp;
  } catch (error) {
    console.error(error);
    
  }
}