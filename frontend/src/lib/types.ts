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
  reg_number:string,
  status: number
}
 
export interface Qualification {
  text: string
}

interface ProviderDetailsPanelProps {
  provider: Provider | null
  onSelectProvider: (provider: Provider) => void
}

type TestResult = {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'running';
  duration: number;
  timestamp: string;
  message?: string;
  claimId?: string;
  details: {
    request: any;
    response?: any;
    error?: string;
    errorMessage?: string;
    validationErrors?: {
      path: string;
      message: string;
      
    }[];
  };
};

export type InterventionItem = {
  id: string;
  packageId: string;
  code: string;
  name: string;
  serviceQuantity: string;
  unitPrice: string;
  serviceStart: string;
  serviceEnd: string;
  netValue: number;
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


/* Duplicate Provider interface removed to avoid redeclaration error */

interface Use {
  id: string;
}

interface ProductOrService {
  code: string;
  display: string;
  quantity: {
    value: string;
  };
  unitPrice: {
    value: string;
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
  patient: FormatPatient;
  provider: Provider;
  use: Use;
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
  system?:string,
  code?: string,
  display: string
}
export interface ValueCodeableConcept{
  coding: Coding[]
}
export interface Extension{
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
  code: string
}
// Intervention
export interface Intervention {
  id?: number,
  package_id: number,
  name: string, 
  code: string, 
}

export interface TestCaseItem {
  id?: number,
  intervention_id: number,
  name: string, 
  description: string,
  test_config:  TestCase,
  code: string,
  error?: {message:string}
}
