import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { refreshTestResult } from '@/utils/claimUtils';
import { getTestCaseByCode } from '@/lib/api';
import { runTestSuite } from '@/utils/testUtils';
import { FormatPatient, TestCase, TestCaseItem, TestResult } from '@/lib/types';
import { CurrentTestCases, TestConfig, TestRunnerHook } from '../Dashboard/sanity/types/sanityCheck';

interface UseTestRunnerOptions {
    isRunning?: boolean;
    onRunTests?: (testConfig: TestConfig) => void;
}

export const useTestRunner = ({ isRunning = false, onRunTests }: UseTestRunnerOptions): TestRunnerHook => {
    const [runningSection, setRunningSection] = useState<string | null>(null);
    const [results, setResults] = useState<TestResult[]>([]);
    const [currentTestCases, setCurrentTestCases] = useState<CurrentTestCases>({
        positive: [],
        negative: []
    });
    const [complexInterventions, setComplexInterventions] = useState<number[]>([]);

    const updateTestCasePatient = useCallback((testCaseTitle: string, patient: FormatPatient) => {
        const allTestCases = [...currentTestCases.positive, ...currentTestCases.negative];
        const updatedTestCases = allTestCases.map(testCase => {
            if (testCase.test_config?.formData.title === testCaseTitle) {
                return {
                    ...testCase,
                    test_config: {
                        ...testCase.test_config,
                        formData: {
                            ...testCase.test_config.formData,
                            patient: patient
                        }
                    }
                };
            }
            return testCase;
        });

        const updatedPositive = updatedTestCases.filter(tc =>
            currentTestCases.positive.some(positiveTc =>
                positiveTc.test_config?.formData.title === tc.test_config?.formData.title
            )
        );

        const updatedNegative = updatedTestCases.filter(tc =>
            currentTestCases.negative.some(negativeTc =>
                negativeTc.test_config?.formData.title === tc.test_config?.formData.title
            )
        );

        setCurrentTestCases({
            positive: updatedPositive,
            negative: updatedNegative
        });

        toast.success(`Patient updated for ${testCaseTitle}`);
    }, [currentTestCases]);

    const buildTestPayload = useCallback((tests: string[], type: 'positive' | 'negative'): TestCase[] => {
        const allTestCases = [...currentTestCases.positive, ...currentTestCases.negative];
        return tests.map(testTitle => {
            const testCase = allTestCases.find(tc => tc.test_config?.formData.title === testTitle);
            if (!testCase) {
                throw new Error(`Test case with title "${testTitle}" not found`);
            }
            return { ...testCase, type };
        });
    }, [currentTestCases]);

    const runTests = useCallback(async (selectedItems: string[], type: 'positive' | 'negative') => {
        if (selectedItems.length === 0) {
            toast.error(`Please select at least one ${type} test case to run`);
            return;
        }

        setRunningSection(type);
        const testConfig = { [type]: buildTestPayload(selectedItems, type) };

        try {
            const allTests = testConfig[type];
            for (const [index, testCase] of allTests.entries()) {
                console.log(`Running test ${index + 1}/${allTests.length}: ${testCase?.formData?.title || testCase?.formData?.title}`);

                const productCode = testCase?.formData?.productOrService[0]?.code ||
                    testCase?.formData?.productOrService[0]?.code;

                const response = await getTestCaseByCode(productCode);
                const testCaseData = response?.data || [];
                const testResult = await runTestSuite(testCase, testCaseData);
                setResults(prev => [...prev, ...testResult]);

                if (index < allTests.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
            }
        } catch (error) {
            console.error('Test execution failed:', error);
        } finally {
            setRunningSection(null);
        }
    }, [buildTestPayload]);

    const handleRunPositiveTests = useCallback((selectedItems: string[]) => {
        runTests(selectedItems, 'positive');
    }, [runTests]);

    const handleRunNegativeTests = useCallback((selectedItems: string[]) => {
        runTests(selectedItems, 'negative');
    }, [runTests]);

    const handleRunAllTests = useCallback(async () => {
        const allSelectedTests = [...currentTestCases.positive, ...currentTestCases.negative];
        if (allSelectedTests.length === 0) {
            toast.error('Please select at least one test case to run');
            return;
        }

        const testConfig = {
            positive: buildTestPayload(currentTestCases.positive.map(tc => tc?.test_config?.formData.title), 'positive'),
            negative: buildTestPayload(currentTestCases.negative.map(tc => tc?.test_config?.formData.title), 'negative')
        };

        if (onRunTests) {
            setRunningSection('all');
            await onRunTests(testConfig);
            setRunningSection(null);
            return;
        }

        setRunningSection('all');
        try {
            const allTests = [...testConfig.positive, ...testConfig.negative];
            for (const [index, testCase] of allTests.entries()) {
                const productCode = testCase.formData?.productOrService[0]?.code ||
                    testCase?.formData?.productOrService[0]?.code;

                const response = await getTestCaseByCode(productCode);
                const testCaseData = response?.data || [];
                const testResult = await runTestSuite(testCase, testCaseData);
                setResults(prev => [...prev, ...testResult]);

                if (index < allTests.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
            }
        } catch (error) {
            console.error('Test execution failed:', error);
        } finally {
            setRunningSection(null);
        }
    }, [currentTestCases, buildTestPayload, onRunTests]);

    const handleRefreshResult = useCallback(async (claimId: string, test?: string) => {
        try {
            const { outcome, status, message } = await refreshTestResult(claimId, test);
            setResults(prevResults =>
                prevResults.map(result => {
                    if (result.claimId === claimId) {
                        return {
                            ...result,
                            outcome,
                            status,
                            message,
                            timestamp: new Date().toISOString()
                        };
                    }
                    return result;
                })
            );
            toast.success('Result refreshed successfully');
        } catch (error) {
            console.error('Error refreshing result:', error);
            toast.error('Failed to refresh result');
            throw error;
        }
    }, []);

    return {
        runningSection,
        results,
        currentTestCases,
        complexInterventions,
        handleRunPositiveTests,
        handleRunNegativeTests,
        handleRunAllTests,
        handleRefreshResult,
        updateTestCasePatient,
        setCurrentTestCases: setCurrentTestCases,
        setComplexInterventions: setComplexInterventions
    };
};
