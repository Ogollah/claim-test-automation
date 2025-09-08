export const TEST_EXECUTION_DELAY = 3000;
export const MAX_RANDOM_TEST_CASES_PER_TYPE = 2;

export const SESSION_STORAGE_KEYS = {
    PACKAGE_RUNNING_SECTION: 'package-running-section',
    PACKAGE_RESULTS: 'package-results',
    SELECTED_PACKAGE: 'selected-package',
    COMPLEX_INTERVENTIONS: 'complex-interventions',
    PACKAGES: 'packages',
    INTERVENTION_IDS: 'intervention-ids',
    PACKAGE_TEST_CASES: 'package-test-cases',
    CURRENT_TEST_CASES: 'current-test-cases',
    ALL_RUNNING_SECTION: 'all-running-section',
    ALL_RESULTS: 'all-results',
    ALL_TEST_CASES: 'all-test-cases',
    ALL_CURRENT_TEST_CASES: 'all-current-test-cases',
    ALL_COMPLEX_INTERVENTIONS: 'all-complex-interventions'
} as const;