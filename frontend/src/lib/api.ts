import axios from 'axios';
import { Provider, TestCase, Patient } from './types';
import { patients } from './patient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
})

// Interface for the FHIR Bundle in the response
interface FhirBundle {
  resourceType: string;
  id: string;
  meta: {
    profile: string[];
  };
  type: string;
  timestamp: string;
  entry: any[];
}

// Interface for the server response data
interface ApiResponseData {
  resourceType: string;
  id: string;
  meta?: {
    profile?: string[];
  };
  type?: string;
  timestamp?: string;
  entry?: any[];
  responseTime?: number;
  outcome?: string;
}

// Enhanced server response interface to include error details
interface ApiResponse {
  success: boolean;
  message: string;
  data?: ApiResponseData;
  fhirBundle?: FhirBundle;
  timestamp?: string;
  responseTime?: number;
  validation_errors?: {
    path: string;
    message: string;
  }[];
  error?: string | object; // Added error field to match backend response
  status?: number; // Added status field
}

// Updated TestResult interface with better error handling
export interface TestResult {
  id: string;
  name: string;
  use?: { id: string }; 
  status: 'passed' | 'failed' | 'running';
  duration: number;
  timestamp: string;
  message?: string;
  claimId?: string;
  details: {
    request: any;
    response?: ApiResponseData;
    fhirBundle?: FhirBundle;
    error?: any;
    errorMessage?: string;
    validationErrors?: {
      path: string;
      message: string;
    }[];
    statusCode?: number;
  };
}

export const runTestSuite = async (testData: any): Promise<TestResult[]> => {
  try {
    const startTime = Date.now();
    const response = await axios.post<ApiResponse>(`${API_BASE_URL}/api/claims/submit`, testData);
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
    
    const result: TestResult = {
      id: response.data.data?.id || 'generated-id',
      name: testData?.formData?.title || 'Claim Submission',
      use: testData?.formData?.use,
      status: response.data.success ? 'passed' : 'failed',
      duration: responseTime,
      timestamp: new Date().toISOString(),
      message: response.data.message,
      claimId: claimId,
      details: {
        request: testData,
        response: response.data.data,
        fhirBundle: response.data.fhirBundle,
        validationErrors: response.data.validation_errors || [],
        errorMessage: response.data.error ? String(response.data.error) : response.data.message,
        statusCode: response.status
      }
    };

    console.log('Test execution result:', result);
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
      status: 'failed',
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

    return [errorResult];
  }
};

export const getTestHistory = async (): Promise<TestResult[]> => {
  const response = await axios.get(`${API_BASE_URL}/tests/history`);
  return response.data;
};

// Provider

export const getProvide = async () => {
  try {
    const resp = await api.get<Provider[]>("/providers");
    return resp.data;
  } catch (error) {
    console.error(error);
  }
}

export const searchProvider = async(search: string) => {
  try {
    const resp = await api.get<Provider>(`/providers/${search}`);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const postProvider = async(data: Provider) => {
  try {
    const resp = await api.post<Provider>("/providers", data)
    return resp;
  } catch (error) {
    console.error(error);
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

export const searchPatient = async(search: string) => {
  try {
    const resp = await api.get<Patient>(`/api/patients/${search}`);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const postPatient = async(data: Patient) => {
  try {
    const resp = await api.post<Patient>("/api/patients", data);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

// Practitioner
interface Practitioner {
  pu_id: string,
  name: string, 
  gender: string, 
  phone: string, 
  address: string, 
  national_id: string, 
  email: string,
  status: string
}

export const getPractitioner = async () => {
  try {
    const resp = await api.get<Practitioner[]>("/api/practitioners");
    return resp.data;
  } catch (error) {
    console.error(error);
  }
}

export const searchPractitioner = async(search: string) => {
  try {
    const resp = await api.get<Patient>(`/api/practitioners/${search}`);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const postPractitioner = async(data: Patient) => {
  try {
    const resp = await api.post<Patient>("/api/practitioners", data);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

// Intervention
interface Intervention {
  id?: number,
  name: string, 
  code: string, 
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

// Package
export const getPackages = async () => {
  try {
    const resp = await api.get<Intervention[]>("/api/packages");
    return resp.data;
  } catch (error) {
    console.error(error);
  }
}

export const searchPackage = async(search: string) => {
  try {
    const resp = await api.get<Intervention>(`/api/packages/${search}`);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const postPackage = async(data: Intervention) => {
  try {
    const resp = await api.post<Intervention>("/api/packages", data);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

// Test case
interface TestCaseItem {
  id?: number,
  name: string, 
  description: string,
  test_config:  TestCase;
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