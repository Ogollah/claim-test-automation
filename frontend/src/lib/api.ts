import axios from 'axios';
import { Provider, Patient, PatientBundle, FormatPatient, FormatProvider, ProviderItem, Practitioner, PractitionerBundle, ProviderBundle, PractitionerItem, Intervention, Package, TestCaseItem, Result, TestResult } from './types';
import { hiePatients, patients } from './patient';
import { api, API_BASE_URL, HIE_URL } from './utils';
import { hieProviders } from './providers';
import { hiePractitioners } from './practitioner';


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

export const searchProvider = async (param: string, search: string) => {
  try {
    const resp = await api.get<Provider>(`/api/providers?${param}=${search}`);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const postProvider = async (data: ProviderItem) => {
  try {
    const resp = await api.post<ProviderItem>("/api/providers", data)
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const getProviderByFID = async (fID: string) => {
  try {
    const resp = await api.get<ProviderItem>(`/api/providers/${fID}`);
    return resp;
  } catch (error) {
    console.error('--> Error getting provider', error);

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

export const searchPatient = async (param: string, search: string) => {
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

export const postPatient = async (data: Patient) => {
  try {
    const resp = await api.post<Patient>("/api/patients", data);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const updatePatient = async (id: number, data: Patient) => {
  try {
    const resp = await api.put<Patient>(`/api/patients/update/${id}`, data);
    return resp;
  } catch (error) {
    console.error("Error updating patient: ", error);
  }
};

export const getPatientByCrID = async (crID: string) => {
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
      regNumber: item.reg_number,
      status: item.status === 1
    }));
  } catch (error) {
    console.error("Error fetching HIE practitioner: ", error);
    return [];
  }
}

export const searchPractitionerHie = async (param: string, search: string): Promise<Practitioner[]> => {
  try {
    const resp = await api.get<PractitionerBundle>(
      `${HIE_URL.BASE_URL}/${HIE_URL.PATHS.PRACTITIONER}?${param}=${search}`
    );

    const resources = resp.data.entry?.map((e) => e.resource) ?? [];
    return hiePractitioners(resources);
  } catch (error) {
    console.error("Error fetching HIE provider: ", error);
    return [];
  }
};

export const searchPractitioner = async (param: string, search: string) => {
  try {
    const resp = await api.get<PractitionerItem>(`/api/practitioners?${param}=${search}`);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const postPractitioner = async (data: PractitionerItem) => {
  try {
    const resp = await api.post<PractitionerItem>("/api/practitioners", data);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const getPractitionerByPuID = async (puID: string) => {
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

export const searchIntervention = async (search: string) => {
  try {
    const resp = await api.get<Intervention>(`/api/interventions/${search}`);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const postIntervention = async (data: Intervention) => {
  try {
    const resp = await api.post<Intervention>("/api/interventions", data);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const getInterventionByPackageId = async (package_id: number) => {
  try {
    const resp = await api.get<Intervention>(`/api/interventions/${package_id}`);
    return resp.data;
  } catch (error) {
    console.error('--> Error fetching interventions by package id: ', error);

  }
}

export const getInterventionByCode = async (code: string) => {
  try {
    const resp = await api.get(`/api/interventions/code/${code}`);
    return resp;
  } catch (error) {
    console.error('--> Error getting intervention', error);
  }
}

export const getInterventionByComplexity = async (complexity: number) => {
  try {
    const resp = await api.get(`/api/interventions/complex/${complexity}`);
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

export const searchPackage = async (search: string) => {
  try {
    const resp = await api.get<Package>(`/api/packages/${search}`);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const postPackage = async (data: Package) => {
  try {
    const resp = await api.post<Package>("/api/packages", data);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

// Test case

export interface Error {
  error: { message: string }
}
export const getTestcases = async () => {
  try {
    const resp = await api.get<TestCaseItem[]>("/api/test-cases");
    return resp.data;
  } catch (error) {
    console.error(error);
  }
}

export const searchTestCase = async (search: string) => {
  try {
    const resp = await api.get<TestCaseItem>(`/api/test-cases/${search}`);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const postTestCase = async (data: TestCaseItem) => {

  try {
    const resp = await api.post<TestCaseItem>("/api/test-cases", data);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const getTestCaseByCode = async (code: string) => {
  try {
    const resp = await api.get<TestCaseItem[]>(`/api/test-cases/${code}`);
    return resp;
  } catch (error) {
    console.error(error);

  }
}

export const updateTestCase = async (id: any, data: any) => {
  try {
    const resp = await api.put<TestCaseItem>(`/api/test-cases/update/${id}`, { result_status: data });
    return resp;
  } catch (error) {
    console.error(error);
  }
}

// Results

export const getResults = async () => {
  try {
    const resp = await api.get<Result[]>("/api/results");
    return resp;
  } catch (error) {
    console.error(error);

  }
}

export const getResultById = async (id: number) => {
  try {
    const resp = await api.get<Result>(`/api/results/${id}`);
    return resp;
  } catch (error) {
    console.error(error);

  }
}

export const createResult = async (data: Result) => {
  try {
    const resp = await api.post<Result>("/api/results", data);
    return resp;
  } catch (error) {
    console.error(error);

  }
}

export const updateResult = async (id: number, status: number) => {
  try {
    const resp = await api.put<Result>(`/api/results/${id}`, { result_status: status });
    return resp;
  } catch (error) {
    console.error(error);

  }
}

export const deleteResult = async (id: number) => {
  try {
    const resp = await api.delete<Result>(`/api/results/${id}`);
    return resp;
  } catch (error) {
    console.error(error);

  }
}