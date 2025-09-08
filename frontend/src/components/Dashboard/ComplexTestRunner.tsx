import { getInterventionByComplexity, getTestCaseByCode } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import ResultsTable from './ResultsTable';
import { TestCaseGrid } from '../shared/TestCaseGrid';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTestRunner } from '../hook/useTestRunner';
import { Intervention, TestCaseItem, TestConfig } from './sanity/types/sanityCheck';

interface ComplexTestRunnerProps {
    isRunning: boolean;
    onRunTests?: (testConfig: TestConfig) => void;
}

export default function ComplexTestRunner({ isRunning = false, onRunTests }: ComplexTestRunnerProps) {
    const [selectedIntervention, setSelectedIntervention] = useState<string>('');
    const [availableInterventions, setAvailableInterventions] = useState<Intervention[]>([]);
    const [testCases, setTestCases] = useState<TestCaseItem[]>([]);

    const {
        runningSection,
        results,
        currentTestCases,
        complexInterventions,
        handleRunPositiveTests,
        handleRunNegativeTests,
        handleRunAllTests,
        handleRefreshResult,
        updateTestCasePatient,
        setCurrentTestCases,
        setComplexInterventions
    } = useTestRunner({ isRunning, onRunTests });

    // Fetch interventions
    useEffect(() => {
        const fetchInterventions = async () => {
            try {
                const response = await getInterventionByComplexity(1);
                const interventions: Intervention[] = response?.data || [];
                setAvailableInterventions(interventions);

                if (interventions.length > 0) {
                    const interventionIds = interventions.map(intervention => intervention.id);
                    setComplexInterventions(interventionIds);
                    setSelectedIntervention(interventions[0].code);
                }
            } catch (error) {
                console.error('Error fetching interventions:', error);
                toast.error('Failed to load interventions');
            }
        };
        fetchInterventions();
    }, [setComplexInterventions]);

    // Fetch test cases
    useEffect(() => {
        const fetchTestCases = async () => {
            try {
                const testCase = await getTestCaseByCode(selectedIntervention);
                setTestCases(testCase?.data || []);
            } catch (error) {
                console.error('Error fetching test cases:', error);
            }
        };

        if (selectedIntervention) {
            fetchTestCases();
        }
    }, [selectedIntervention]);

    // Update current test cases
    useEffect(() => {
        if (testCases?.length) {
            const positiveCases = testCases.filter(item => item.description === 'positive');
            const negativeCases = testCases.filter(item => item.description === 'negative');
            setCurrentTestCases({ positive: positiveCases, negative: negativeCases });
        } else {
            setCurrentTestCases({ positive: [], negative: [] });
        }
    }, [testCases, setCurrentTestCases]);

    return (
        <div className="max-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-500 mb-6">Complex Test Runner</h1>
            <div className="bg-white rounded-sm shadow-md p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Automated complex test cases</h2>
                <div className="mb-3">
                    <Label htmlFor="test" className="block text-sm font-small text-gray-500 mb-1">
                        Intervention Code
                    </Label>
                    <Select onValueChange={setSelectedIntervention} value={selectedIntervention}>
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

                <TestCaseGrid
                    currentTestCases={currentTestCases}
                    isRunning={isRunning}
                    runningSection={runningSection}
                    complexInterventions={complexInterventions}
                    onRunPositiveTests={handleRunPositiveTests}
                    onRunNegativeTests={handleRunNegativeTests}
                    onRunAllTests={handleRunAllTests}
                    onUpdatePatient={updateTestCasePatient}
                />
            </div>
            <ResultsTable results={results} onRefresh={handleRefreshResult} />
        </div>
    );
}
