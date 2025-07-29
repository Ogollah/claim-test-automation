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
  qualification: Qualification[],
  nationalID: string,
  regNumber: string,
  sladeCode: string,
  regID?: string,
  name: string,
  phone: string,
  email: string,
  address: string
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

// interface Patient {
//   id: string;
//   name: string;
//   gender: number;
//   birthDate: string;
//   identifiers: Identifier[];
// };
// interface Provider {
//   id: string;
//   name: string;
//   level: string;
//   identifiers: Identifier[];
// };
// export type TestCaseFormData = {

//   patient: Patient;
//   provider: Provider;
//   use: {id: string;};
//   productOrService: InterventionItem[];
//   billablePeriod: { billableStart: string; billableEnd: string; created: string; };
//   total: { value: number; currency: string; };
// }

interface Identifier {
  system: string;
  value: string;
}

interface Patient {
  id: string;
  name: string;
  gender: string;
  birthDate: string;
  identifiers: Identifier[];
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
  patient: Patient;
  provider: Provider;
  use: Use;
  productOrService: ProductOrService[];
  billablePeriod: BillablePeriod;
  total: Total;
}

export interface TestCase {
  formData: FormData;
}

// type ProviderIdentifier = {
//   system: string;
//   value: string;
// };

// type Provider = {
//   id: string;
//   name: string;
//   level: string;
//   identifiers: ProviderIdentifier[];
//   active?: boolean;
//   type?: string;
// };
