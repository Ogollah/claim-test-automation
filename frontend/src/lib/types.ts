import NextAuth from "next-auth";

interface Identifier {
  system: string
  value: string
}

export interface Provider {
  id: string
  name: string
  level: string
  identifiers: Identifier[]
  active?: boolean
  type?: string
}

export interface Practitioner {
  id: string,
  status: boolean,
  gender: string,
  nationalID: string,
  regNumber: string,
  sladeCode: string,
  name: string,
  phone: string,
  email: string,
  address: string
}

export interface PractitionerItem {
  pu_id: string,
  name: string,
  gender: string,
  phone: string,
  address: string,
  national_id: string,
  email: string,
  slade_code: string,
  reg_number: string,
  status: number
}

export interface Qualification {
  text: string
}

interface ProviderDetailsPanelProps {
  provider: Provider | null
  onSelectProvider: (provider: Provider) => void
}

export type InterventionItem = {
  id: string;
  packageId: string;
  code: string;
  name: string;
  serviceQuantity?: string;
  unitPrice: string;
  serviceStart: string;
  serviceEnd: string;
  netValue: number;
  patient?: any,
  provider?: any,
  days?: string
};

interface Identifier {
  system: string;
  value: string;
}

export interface FormatPatient {
  id: string;
  name: string;
  gender: string;
  birthDate: string;
  identifiers: Identifier[];
}

export interface Patient {
  id?: number,
  cr_id: string,
  name: string,
  gender: string,
  birthdate: string,
  national_id: string,
  email: string,
  system_value: string
}

export interface PatientBundle {
  resourceType: "Bundle";
  entry: {
    fullUrl: string;
    resource: FhirPatientResource;
    search?: { mode: string };
  }[];
}

export interface FhirPatientResource {
  resourceType: "Patient";
  id: string;
  gender: string;
  birthDate: string;
  name: {
    text: string;
    family?: string;
    given?: string[];
  }[];
  identifier: Identifier[];
}

export interface PractitionerBundle {
  resourceType: "Bundle";
  entry: {
    fullUrl: string;
    resource: FhirPractitionerResource;
    search?: { mode: string };
  }[];
}

export interface FhirPractitionerResource {
  resourceType: "Practitioner";
  id: string;
  gender: string;
  birthDate?: string;
  active: boolean,
  address: {
    text: string
  }[],
  telecom: Identifier[]
  name: {
    text: string;
  }[];
  identifier: Identifier[];
}

interface ProductOrService {
  code: string;
  display: string;
  quantity: {
    value: string;
  };
  unitPrice: {
    value: number;
    currency: string;
  };
  net: {
    value: number;
    currency: string;
  };
  servicePeriod: {
    start: string;
    end: string;
  };
  sequence: number;
}

interface BillablePeriod {
  billableStart: string;
  billableEnd: string;
  created: string;
}

interface Total {
  value: number;
  currency: string;
}

interface FormData {
  test: string;
  title: string;
  is_bundle_only?: boolean;
  patient: FormatPatient;
  provider: Provider;
  practitioner: Practitioner;
  approvedAmount: number;
  use: string;
  productOrService: ProductOrService[];
  billablePeriod: BillablePeriod;
  total: Total;
}

export interface TestCase {
  formData: FormData;
}

export interface ProviderIdentifier {
  system: string;
  value: string;
};

export interface FormatProvider {
  id: string;
  name: string;
  level: string;
  identifiers: ProviderIdentifier[];
  active: boolean;
};

export interface ProviderItem {
  f_id: string;
  name: string;
  level: string;
  slade_code?: string;
  status?: number
}

export interface ProviderBundle {
  resourceType: "Bundle";
  entry: {
    fullUrl: string;
    resource: FhirProviderResource;
    search?: { mode: string };
  }[];
}
export interface Coding {
  system?: string,
  code?: string,
  display: string
}
export interface ValueCodeableConcept {
  coding: Coding[]
}
export interface Extension {
  valueCodeableConcept: ValueCodeableConcept
}

export interface FhirProviderResource {
  resourceType: "Organization";
  id: string;
  active: boolean;
  name: string;
  identifier: Identifier[];
  extension: Extension[]
}

export interface Package {
  id?: number,
  name: string,
  code: string,
  created_date?: string,
  updates_date?: string
}
// Intervention
export interface Intervention {
  id?: number,
  package_id: number,
  name: string,
  code: string,
  is_complex?: number,
  created_date?: string,
  updates_date?: string
}

export interface TestCaseItem {
  id?: number,
  intervention_id: number,
  name: string,
  description: string,
  test_config: TestCase,
  code: string,
  error?: { message: string, code: string },
  created_by?: string,
  updated_by?: string
}

export interface Result {
  id?: number,
  testcase_id: number,
  result_status: number,
  claim_id?: string,
  response_id?: string,
  created_date?: string,
  updates_date?: string,
  message?: string,
  detail?: string,
  status_code?: string,
  created_by?: string,
  updated_by?: string
}

// Interface for the FHIR Bundle in the response
export interface FhirBundle {
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
export interface ApiResponseData {
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
export interface ApiResponse {
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
  error?: string | object;
  status?: number;
}

export interface Error {
  response: ApiResponseData;
  error: string;
  fhirBundle: FhirBundle;
}

export interface TestResult {
  id: string;
  req?: object;
  test: string;
  name: string;
  use?: string;
  status: 'passed' | 'failed' | 'running' | 'pending' | 'bundle' | 'ready';
  ruleStatus?: string;
  duration?: number;
  timestamp: string;
  message?: string;
  claimId?: string;
  outcome?: string;
  details: {
    request: TestCase;
    response?: ApiResponseData;
    fhirBundle?: FhirBundle;
    error?: string;
    errorMessage?: string;
    validationErrors?: {
      path: string;
      message: string;
    }[];
    statusCode?: number;
    statusString?: string;
  };
}
export interface ComplexCase {
  id: string;
  formData: TestCase['formData'];
  netValue: number;
  status: string;
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
  }
}

