import { toast } from "sonner";
import { refreshTestResult } from "@/utils/claimUtils";
import { getInterventionByComplexity, getTestCaseByCode, getTestcases } from "@/lib/api";
import { runTestSuite } from "@/utils/testUtils";
import type { FormatPatient, TestCase, TestResult, Intervention } from "@/lib/types";
import { useEffect, useState } from "react";
import { StopIcon } from "@heroicons/react/16/solid";
import { PlayIcon } from "lucide-react";
import TestcaseDetails from "@/components/testCases/TestcaseDetails";
import { Button } from "@/components/ui/button";
import ResultsTable from "../ResultsTable";

interface SanityTestCasesProps {
    isRunning?: boolean;
    onRunTests?: (config: any) => Promise<void>;
}

export default function SanityTestCases({ isRunning = false, onRunTests }: SanityTestCasesProps) {
    const [runningSection, setRunningSection] = useState<string | null>(null);
    const [results, setResults] = useState<TestResult[]>([]);
    const [currentTestCases, setCurrentTestCases] = useState<{ positive: TestCase[] }>({ positive: [] });
    const [complexInterventions, setComplexInterventions] = useState<string[]>([]);

    useEffect(() => {
        getInterventionByComplexity(1)
            .then(interventions => {
                if (interventions?.data.length > 0) {
                    const codes = interventions?.data.map(intervention => intervention.code);
                    setComplexInterventions(codes || []);
                }
            })
            .catch(err => {
                console.error(err);
                toast.error("Failed to load complex interventions");
            });
    }, []);

    useEffect(() => {
        getTestcases()
            .then(testCases => {
                const byInterv: Record<number, TestCase[]> = {};

                testCases?.forEach(tc => {
                    if (tc.intervention_id) {
                        if (complexInterventions.includes(tc.code.toString())) {
                            return;
                        }

                        if (!byInterv[tc.intervention_id]) byInterv[tc.intervention_id] = [];
                        const isPositive = tc.test_config?.formData.test === 'positive' ||
                            tc.description?.toLowerCase().includes('positive');
                        if (isPositive) byInterv[tc.intervention_id].push(tc.test_config);
                    }
                });

                const selectOne = Object.values(byInterv)
                    .flatMap(group => group.length ? [group[Math.floor(Math.random() * group.length)]] : []);

                setCurrentTestCases({ positive: selectOne });
            })
            .catch(err => {
                console.error(err);
                toast.error("Failed loading test cases");
            });
    }, [complexInterventions]);

    const updateTestCasePatient = (title: string, patient: FormatPatient) => {
        setCurrentTestCases(prev => ({
            positive: prev.positive.map(tc =>
                tc.formData.title === title
                    ? {
                        ...tc,
                        formData: { ...tc.formData, patient }
                    }
                    : tc
            )
        }));
        toast.success(`Patient updated for "${title}"`);
    };

    const buildTestPayload = (titles: string[]) =>
        currentTestCases.positive
            .filter(tc => titles.includes(tc.formData?.title))
            .map(tc => ({ ...tc }));

    const runTests = async (titles: string[]) => {
        if (!titles.length) return toast.error('Select at least one test');
        setRunningSection('positive');
        const payload = buildTestPayload(titles);

        for (const [i, tc] of payload.entries()) {
            try {
                const res = await getTestCaseByCode(tc.formData.productOrService[0].code);
                const testData = res?.data || [];
                const testResults = await runTestSuite(tc, testData);
                setResults(prev => [...prev, ...testResults]);
            } catch (err) {
                console.error(err);
                toast.error(`Test "${tc.formData?.title}" failed`);
            }

            if (i < payload.length - 1) await new Promise(r => setTimeout(r, 3000));
        }

        setRunningSection(null);
    };

    const handleRunAll = () => runTests(currentTestCases.positive.map(tc => tc.formData?.title));

    const handleRefresh = async (claimId: string, test?: string) => {
        try {
            const { outcome, status, message } = await refreshTestResult(claimId, test);
            setResults(prev =>
                prev.map(r => (r.claimId === claimId ? { ...r, outcome, status, message, timestamp: new Date().toISOString() } : r))
            );
            toast.success('Result refreshed');
        } catch (err) {
            console.error(err);
            toast.error('Refresh failed');
        }
    };

    return (
        <div className="max-auto py-3">
            <div className="bg-white rounded-sm shadow-md p-6 mb-8 max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
                <TestcaseDetails
                    title="Positive Test Cases"
                    testCases={currentTestCases.positive}
                    onRunTests={runTests}
                    isRunning={isRunning && runningSection === 'positive'}
                    onUpdatePatient={updateTestCasePatient}
                    columns={4}
                    displayMode="code"
                    complexInterventions={complexInterventions}
                />
                <Button
                    type="button"
                    onClick={handleRunAll}
                    disabled={isRunning}
                    className={`mt-4 inline-flex items-center px-4 py-1 text-white ${isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {isRunning && runningSection === 'positive' ? (
                        <>
                            <StopIcon className="mr-2 h-5 w-5" /> Running...
                        </>
                    ) : (
                        <>
                            <PlayIcon className="mr-2 h-5 w-5" /> Run all
                        </>
                    )}
                </Button>
            </div>
            {results.length > 0 && (
                <ResultsTable results={results} onRefresh={handleRefresh} />
            )}
        </div>
    );
}