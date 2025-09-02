import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import PatientDetailsPanel from "./PatientDetailsPanel";
import ResultsTable from "./ResultsTable";
import { refreshTestResult } from "@/utils/claimUtils";
import { getInterventionByComplexity, getTestCaseByCode } from "@/lib/api";
import { runTestSuite } from "@/utils/testUtils";
import { FormatPatient, TestCase, TestCaseItem, TestResult, Intervention } from "@/lib/types";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import TestcaseDetails from "../testCases/TestcaseDetails";
import { Button } from "../ui/button";
import { StopIcon } from "@heroicons/react/16/solid";
import { PlayIcon } from "lucide-react";

interface ComplexTestRunnerProps {
    isRunning: boolean;
    onRunTests?: (testConfig: TestConfig) => void;
}

interface TestConfig {
    positive: TestCase[];
    negative: TestCase[];
}

interface CurrentTestCases {
    positive: TestCase[];
    negative: TestCase[];
}

export default function ComplexTestRunner({ isRunning = false, onRunTests }: ComplexTestRunnerProps) {
    const [selectedIntervention, setSelectedIntervention] = useState<string>('');
    const [runningSection, setRunningSection] = useState<string | null>(null);
    const [availableInterventions, setAvailableInterventions] = useState<Intervention[]>([]);
    const [results, setResults] = useState<TestResult[]>([]);
    const [testCases, setTestCases] = useState<TestCaseItem[]>([]);
    const [currentTestCases, setCurrentTestCases] = useState<CurrentTestCases>({
        positive: [],
        negative: []
    });
    const [editingTestCase, setEditingTestCase] = useState<string | null>(null);

    useEffect(() => {
        const fetchInterventions = async () => {
            try {
                const response = await getInterventionByComplexity(1);
                const interventions: Intervention[] = response?.data || [];
                setAvailableInterventions(interventions);
                if (interventions.length > 0) {
                    setSelectedIntervention(interventions[0].code);
                }
            } catch (error) {
                console.error("Error fetching interventions:", error);
                toast.error("Failed to load interventions");
            }
        };
        fetchInterventions();
    }, []);

    useEffect(() => {
        const fetchTestCases = async () => {
            try {
                const testCase = await getTestCaseByCode(selectedIntervention);
                setTestCases(testCase?.data || []);
            } catch (error) {
                console.error("--> Error fetching test cases: ", error);
            }
        };
        if (selectedIntervention) {
            fetchTestCases();
        }
    }, [selectedIntervention]);

    useEffect(() => {
        if (testCases && testCases.length) {
            const positiveCases = testCases
                .filter(item => item.description === 'positive')
                .map(item => item.test_config);

            const negativeCases = testCases
                .filter(item => item.description === 'negative')
                .map(item => item.test_config);

            setCurrentTestCases({
                positive: positiveCases,
                negative: negativeCases
            });
        } else {
            setCurrentTestCases({ positive: [], negative: [] });
        }
    }, [testCases]);

    const updateTestCasePatient = (testCaseTitle: string, patient: FormatPatient) => {
        const allTestCases = [...currentTestCases.positive, ...currentTestCases.negative];
        const updatedTestCases = allTestCases.map(testCase => {
            if (testCase.formData.title === testCaseTitle) {
                return {
                    ...testCase,
                    formData: {
                        ...testCase.formData,
                        patient: patient
                    }
                };
            }
            return testCase;
        });

        const updatedPositive = updatedTestCases.filter(tc =>
            currentTestCases.positive.some(positiveTc => positiveTc.formData.title === tc.formData.title)
        );

        const updatedNegative = updatedTestCases.filter(tc =>
            currentTestCases.negative.some(negativeTc => negativeTc.formData.title === tc.formData.title)
        );

        setCurrentTestCases({
            positive: updatedPositive,
            negative: updatedNegative
        });

        setEditingTestCase(null);
        toast.success(`Patient updated for test case: ${testCaseTitle}`);
    };

    const handleEditPatient = (testCaseTitle: string) => {
        setEditingTestCase(testCaseTitle);
    };

    const handleSelectPatient = (patient: FormatPatient) => {
        if (editingTestCase) {
            updateTestCasePatient(editingTestCase, patient);
        }
    };

    const buildTestPayload = (tests: string[], type: 'positive' | 'negative'): TestCase[] => {
        const allTestCases = [
            ...currentTestCases.positive,
            ...currentTestCases.negative
        ];
        return tests.map(testTitle => {
            const testCase = allTestCases.find(tc => tc.formData.title === testTitle);
            if (!testCase) {
                throw new Error(`Test case with title "${testTitle}" not found`);
            }
            return {
                ...testCase,
                type
            };
        });
    };

    const handleRunPositiveTests = (selectedItems: string[]) => {
        runTests(selectedItems, 'positive');
    };

    const handleRunNegativeTests = (selectedItems: string[]) => {
        runTests(selectedItems, 'negative');
    };

    const handleRunAllTests = async () => {
        const allSelectedTests = [...currentTestCases.positive, ...currentTestCases.negative];
        if (allSelectedTests.length === 0) {
            toast.error('Please select at least one test case to run');
            return;
        }

        const testConfig: TestConfig = {
            positive: buildTestPayload(currentTestCases.positive.map(tc => tc.formData.title), 'positive'),
            negative: buildTestPayload(currentTestCases.negative.map(tc => tc.formData.title), 'negative')
        };

        if (onRunTests) {
            setRunningSection('all');
            await onRunTests(testConfig);
            setRunningSection(null);
        }

        try {
            const allTests = [
                ...testConfig.positive,
                ...testConfig.negative
            ];
            for (const [index, testCase] of allTests.entries()) {
                console.log(`Running test ${index + 1}/${allTests.length}: ${testCase.formData.title}`);
                console.log('Test case details:', testCase);

                const response = await getTestCaseByCode(testCase.formData.productOrService[0].code);
                const testCaseData: TestCaseItem[] = response?.data || [];

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
    };

    const handleRefreshResult = async (claimId: string, test?: string) => {
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
    };

    const runTests = async (selectedItems: string[], type: 'positive' | 'negative') => {
        if (selectedItems.length === 0) {
            toast.error(`Please select at least one ${type} test case to run`);
            return;
        }

        const testConfig = {
            [type]: buildTestPayload(selectedItems, type),
        };

        console.log(`Running ${type} tests with config:`, testConfig);

        try {
            const allTests = testConfig[type];

            for (const [index, testCase] of allTests.entries()) {
                console.log(`Running test ${index + 1}/${allTests.length}: ${testCase.formData.title}`);
                console.log('Test case details:', testCase);

                const response = await getTestCaseByCode(testCase.formData.productOrService[0].code);
                const testCaseData: TestCaseItem[] = response?.data || [];

                const testResult = await runTestSuite(testCase, testCaseData);
                setResults((prev) => [...prev, ...testResult]);

                if (index < allTests.length - 1) {
                    await new Promise((resolve) => setTimeout(resolve, 3000));
                }
            }
        } catch (error) {
            console.error('Test execution failed:', error);
        } finally {
            setRunningSection(null);
        }
    };

    const getCurrentPatient = (): FormatPatient | null => {
        if (!editingTestCase) return null;

        const allTestCases = [...currentTestCases.positive, ...currentTestCases.negative];
        const testCase = allTestCases.find(tc => tc.formData.title === editingTestCase);
        return testCase?.formData.patient || null;
    };

    return (
        <div className="max-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-500 mb-6">Complex Test Runner</h1>
            <div className="bg-white rounded-sm shadow-md p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Automated complex test cases</h2>
                <div className="mb-3">
                    <Label htmlFor="test" className="block text-sm font-small text-gray-500 mb-1">
                        Intervention Code
                    </Label>
                    <Select
                        onValueChange={setSelectedIntervention}
                        value={selectedIntervention}
                    >
                        <SelectTrigger id="test" className="w-full">
                            <SelectValue placeholder="Select a test case" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableInterventions.map((intervention) => (
                                <SelectItem key={intervention.code} value={intervention.code}>
                                    {intervention.name} ({intervention.code})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {testCases.length > 0 && editingTestCase && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className=" p-4 rounded-md">
                            <h5 className=" text-gray-500 mb-2">Editing Patient for: <span className="font-small text-gray-800">{editingTestCase}</span></h5>
                            <PatientDetailsPanel
                                patient={getCurrentPatient()}
                                onSelectPatient={handleSelectPatient}
                                show={false}
                            />
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <TestcaseDetails
                        title={'Positive'}
                        testCases={currentTestCases.positive}
                        onRunTests={handleRunPositiveTests}
                        isRunning={isRunning && runningSection === 'positive'}
                        onEditPatient={handleEditPatient}
                        showPatientPanel={true}
                    />
                    <TestcaseDetails
                        title='Negative'
                        testCases={currentTestCases.negative}
                        onRunTests={handleRunNegativeTests}
                        isRunning={isRunning && runningSection === 'negative'}
                        onEditPatient={handleEditPatient}
                        showPatientPanel={true}
                    />
                </div>
                <div className="flex justify-between w-full">
                    <Button
                        type="button"
                        onClick={handleRunAllTests}
                        disabled={isRunning}
                        className={`inline-flex items-center px-4 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isRunning
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                    >
                        {isRunning && runningSection === 'all' ? (
                            <>
                                <StopIcon className="-ml-1 mr-2 h-5 w-5" />
                                Running All Tests...
                            </>
                        ) : (
                            <>
                                <PlayIcon className="-ml-1 mr-2 h-5 w-5" />
                                Run All Tests
                            </>
                        )}
                    </Button>
                </div>
            </div>
            <ResultsTable results={results} onRefresh={handleRefreshResult} />
        </div>
    );
}