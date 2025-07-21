interface Identifier {
  system: string
  value: string
}

interface Provider {
  id: string
  name: string
  level: string
  identifiers: Identifier[]
  active?: boolean
  type?: string
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

// type TestResult = {
//   id: string;
//   name: string;
//   status: 'passed' | 'failed' | 'running';
//   duration: number;
//   timestamp: string;
//   details: {
//     request: any;
//     response?: any;
//     error?: string;
//     validationErrors?: {
//       path: string;
//       message: string;
//     }[];
//   };
// };

type TestRunnerProps = {
  isRunning?: boolean;
  onRunTests?: (testConfig: any) => void;
};

type InterventionItem = {
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
