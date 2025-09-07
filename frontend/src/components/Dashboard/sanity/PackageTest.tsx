import { toast } from "sonner";
import { refreshTestResult } from "@/utils/claimUtils";
import { getInterventionByComplexity, getInterventionByPackageId, getPackages, getTestCaseByCode, getTestcases } from "@/lib/api";
import { runTestSuite } from "@/utils/testUtils";
import { FormatPatient, TestCase, TestCaseItem, TestResult, Intervention, Package } from "@/lib/types";
import { useEffect, useState } from "react";
import { StopIcon } from "@heroicons/react/16/solid";
import { PlayIcon } from "lucide-react";
import TestcaseDetails from "@/components/testCases/TestcaseDetails";
import { Button } from "@/components/ui/button";
import ResultsTable from "../ResultsTable";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PackageTestCasesProps {
    isRunning: boolean;
    onRunTests?: (testConfig: TestConfig) => void;
}

interface TestConfig {
    positive: TestCase[];
    negative: TestCase[];
}

interface CurrentTestCases {
    positive: TestCaseItem[];
    negative: TestCaseItem[];
}

export default function PackageTestCases({ isRunning = false, onRunTests }: PackageTestCasesProps) {
    const [runningSection, setRunningSection] = useState<string | null>(null);
    const [results, setResults] = useState<TestResult[]>([]);
    const [testCases, setTestCases] = useState<TestCaseItem[]>([]);
    const [currentTestCases, setCurrentTestCases] = useState<CurrentTestCases>({
        positive: [],
        negative: []
    });
    const [complexInterventions, setComplexInterventions] = useState<number[]>([]);
    const [packages, setPackages] = useState<Package[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
    const [interventionIds, setInterventionIds] = useState<number[]>([]);


    useEffect(() => {
        const fetchInterventions = async () => {
            try {
                const response = await getInterventionByPackageId(selectedPackage || 1);
                const interventions: Intervention[] = response || [];
                if (interventions.length > 0) {
                    const interventionIds = interventions.map(intervention => intervention.id);
                    setInterventionIds(interventionIds);

                    const complex = await getInterventionByComplexity(1);
                    const complexInterventions: Intervention[] = complex?.data || [];
                    const complexIds = complexInterventions?.map(intervention => intervention.id);
                    setComplexInterventions(complexIds);
                }

            } catch (error) {
                console.error("Error fetching interventions:", error);
                toast.error("Failed to load interventions");
            }
        };
        fetchInterventions();
    }, [selectedPackage]);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await getPackages();
                const packages = response || [];
                setPackages(packages);
            } catch (error) {
                console.error("Error fetching packages:", error);
                toast.error("Failed to load packages");
            }
        };
        fetchPackages();
    }, []);

    useEffect(() => {
        const fetchTestCases = async () => {
            try {
                const resp = await getTestcases();

                const testCases = resp?.filter(tc =>
                    tc.intervention_id && interventionIds.includes(tc.intervention_id)
                ) || [];

                const groupedByIntervention = {};

                testCases?.forEach(tc => {
                    if (!tc.intervention_id) return;

                    const interventionId = tc.intervention_id;
                    const testType = tc.test_config?.formData.test ||
                        (tc.description?.toLowerCase().includes('positive') ? 'positive' :
                            tc.description?.toLowerCase().includes('negative') ? 'negative' : 'other');

                    if (!groupedByIntervention[interventionId]) {
                        groupedByIntervention[interventionId] = {
                            positive: [],
                            negative: []
                        };
                    }

                    if (testType === 'positive') {
                        groupedByIntervention[interventionId].positive.push(tc);
                    } else if (testType === 'negative') {
                        groupedByIntervention[interventionId].negative.push(tc);
                    }
                });

                const selectedTestCases = [];

                Object.values(groupedByIntervention).forEach(intervention => {
                    if (intervention.positive.length > 0) {
                        const randomPositive = intervention.positive
                            .sort(() => 0.5 - Math.random())
                            .slice(0, Math.min(2, intervention.positive.length));
                        selectedTestCases.push(...randomPositive);
                    }
                    if (intervention.negative.length > 0) {
                        const randomNegative = intervention.negative
                            .sort(() => 0.5 - Math.random())
                            .slice(0, Math.min(2, intervention.negative.length));
                        selectedTestCases.push(...randomNegative);
                    }
                });

                setTestCases(selectedTestCases);
            } catch (error) {
                console.error("--> Error fetching test cases: ", error);
            }
        };

        if (complexInterventions.length > 0) {
            fetchTestCases();
        }
    }, [complexInterventions]);

    useEffect(() => {
        if (testCases && testCases.length) {
            const positiveCases = testCases
                .filter(item => item.description === 'positive')
                .map(item => item);

            const negativeCases = testCases
                .filter(item => item.description === 'negative')
                .map(item => item);

            setCurrentTestCases({
                positive: positiveCases,
                negative: negativeCases
            });
        } else {
            setCurrentTestCases({ positive: [], negative: [] });
        }
    }, [testCases]);

    const updateTestCasePatient = (testCaseTitle: string, patient: FormatPatient) => {
        console.log("Updating patient for:", testCaseTitle, "with:", patient);

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

        console.log("Updated test cases:", updatedTestCases);

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
    };

    const buildTestPayload = (tests: string[], type: 'positive' | 'negative'): TestCase[] => {
        const allTestCases = [
            ...currentTestCases.positive,
            ...currentTestCases.negative
        ];
        return tests.map(testTitle => {
            const testCase = allTestCases.find(tc => tc.test_config?.formData.title === testTitle);
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

        const testConfig = {
            positive: buildTestPayload(currentTestCases.positive.map(tc => tc?.test_config?.formData.title), 'positive'),
            negative: buildTestPayload(currentTestCases.negative.map(tc => tc?.test_config?.formData.title), 'negative')
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
                console.log(`Running test ${index + 1}/${allTests.length}: ${testCase?.formData?.title}`);
                console.log('Test case details:', testCase);

                const response = await getTestCaseByCode(testCase?.formData?.productOrService[0].code);
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
                console.log(`Running test ${index + 1}/${allTests.length}: ${testCase?.formData?.title}`);
                console.log('Test case details:', testCase);

                const response = await getTestCaseByCode(testCase?.formData?.productOrService[0].code);
                const testCaseData = response?.data || [];

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

    return (
        <div className="max-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-500 mb-6">All Test Cases</h1>
            <div className="bg-white rounded-sm shadow-md p-6 mb-8">
                <div className=" mb-3">
                    <Label htmlFor="package" className="mb-2">Package</Label>
                    <Select
                        value={selectedPackage || ""}
                        onValueChange={(value) => setSelectedPackage(value)}
                    >
                        <SelectTrigger id="package" className="w-full">
                            <SelectValue placeholder="Select a package" />
                        </SelectTrigger>
                        <SelectContent className=''>
                            {packages.map((pkg) => (
                                <SelectItem key={pkg.id} value={String(pkg.id)}>
                                    {pkg.name} ({pkg.code})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <TestcaseDetails
                        title={'Positive'}
                        testCases={currentTestCases.positive}
                        onRunTests={handleRunPositiveTests}
                        isRunning={isRunning && runningSection === 'positive'}
                        onUpdatePatient={updateTestCasePatient}
                        interventions={complexInterventions}
                    />
                    <TestcaseDetails
                        title='Negative'
                        testCases={currentTestCases.negative}
                        onRunTests={handleRunNegativeTests}
                        isRunning={isRunning && runningSection === 'negative'}
                        onUpdatePatient={updateTestCasePatient}
                        interventions={complexInterventions}
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