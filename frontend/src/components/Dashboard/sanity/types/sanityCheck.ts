export interface TestCase {
    formData: any;
    type?: 'positive' | 'negative';
    [key: string]: any;
}

export interface TestCaseItem {
    test_config?: {
        formData: {
            title: string;
            patient?: any;
            productOrService: any[];
            test?: string;
        };
    };
    description?: string;
    intervention_id?: number;
    [key: string]: any;
}

export interface TestResult {
    claimId: string;
    outcome: string;
    status: string;
    message: string;
    timestamp: string;
    [key: string]: any;
}

export interface TestConfig {
    positive: TestCase[];
    negative: TestCase[];
}

export interface CurrentTestCases {
    positive: TestCaseItem[];
    negative: TestCaseItem[];
}

export interface FormatPatient {
    [key: string]: any;
}

export interface Intervention {
    id: number;
    [key: string]: any;
}

export interface Package {
    id: number;
    name: string;
    code: string;
    [key: string]: any;
}

export interface TestConfig {
    positive: TestCase[];
    negative: TestCase[];
}

export interface CurrentTestCases {
    positive: TestCaseItem[];
    negative: TestCaseItem[];
}

export interface TestRunnerHook {
    runningSection: string | null;
    results: TestResult[];
    currentTestCases: CurrentTestCases;
    complexInterventions: number[];
    handleRunPositiveTests: (selectedItems: string[]) => void;
    handleRunNegativeTests: (selectedItems: string[]) => void;
    handleRunAllTests: () => void;
    handleRefreshResult: (claimId: string, test?: string) => void;
    updateTestCasePatient: (testCaseTitle: string, patient: FormatPatient) => void;
}