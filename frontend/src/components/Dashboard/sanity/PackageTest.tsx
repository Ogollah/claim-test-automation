import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getInterventionByComplexity, getInterventionByPackageId, getPackages, getTestcases } from '@/lib/api';
import { TestCaseItem, Intervention, Package } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ResultsTable from '../ResultsTable';
import { TestConfig } from './types/sanityCheck';
import { useTestRunner } from '@/components/hook/useTestRunner';
import { TestCaseGrid } from '@/components/shared/TestCaseGrid';

interface PackageTestCasesProps {
    isRunning: boolean;
    onRunTests?: (testConfig: TestConfig) => void;
}

export default function PackageTestCases({ isRunning = false, onRunTests }: PackageTestCasesProps) {
    const [packages, setPackages] = useState<Package[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
    const [interventionIds, setInterventionIds] = useState<number[]>([]);
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

    // Fetch packages
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await getPackages();
                setPackages(response || []);
            } catch (error) {
                console.error('Error fetching packages:', error);
                toast.error('Failed to load packages');
            }
        };
        fetchPackages();
    }, []);

    // Fetch interventions when package changes
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
                console.error('Error fetching interventions:', error);
                toast.error('Failed to load interventions');
            }
        };
        fetchInterventions();
    }, [selectedPackage, setComplexInterventions]);

    // Fetch and process test cases
    useEffect(() => {
        const fetchTestCases = async () => {
            try {
                const resp = await getTestcases();
                const filteredTestCases = resp?.filter(tc =>
                    tc.intervention_id && interventionIds.includes(tc.intervention_id)
                ) || [];

                // Group and select test cases logic
                const groupedByIntervention = {};
                filteredTestCases.forEach(tc => {
                    if (!tc.intervention_id) return;

                    const interventionId = tc.intervention_id;
                    const testType = tc.test_config?.formData.test ||
                        (tc.description?.toLowerCase().includes('positive') ? 'positive' :
                            tc.description?.toLowerCase().includes('negative') ? 'negative' : 'other');

                    if (!groupedByIntervention[interventionId]) {
                        groupedByIntervention[interventionId] = { positive: [], negative: [] };
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
                console.error('Error fetching test cases:', error);
            }
        };

        if (complexInterventions.length > 0) {
            fetchTestCases();
        }
    }, [complexInterventions]);

    // Update current test cases when testCases change
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
            <h1 className="text-2xl font-bold text-gray-500 mb-6">All Test Cases</h1>
            <div className="bg-white rounded-sm shadow-md p-6 mb-8">
                <div className="mb-3">
                    <Label htmlFor="package" className="mb-2">Package</Label>
                    <Select
                        value={selectedPackage?.toString() || ""}
                        onValueChange={(value) => setSelectedPackage(Number(value))}
                    >
                        <SelectTrigger id="package" className="w-full">
                            <SelectValue placeholder="Select a package" />
                        </SelectTrigger>
                        <SelectContent>
                            {packages.map((pkg) => (
                                <SelectItem key={pkg.id} value={pkg.id?.toString() || ''}>
                                    {pkg.name} ({pkg.code})
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
