import { useEffect, useState } from 'react';
import { getInterventionByComplexity, getInterventionByPackageId, getPackages, getTestCaseByCode } from '@/lib/api';
import { Intervention, Package, TestCaseItem } from '@/lib/types';
import InterventionSelector from '@/components/Dashboard/InterventionSelector';
import { DEFAULT_PACKAGE } from '@/packages/ShaPackages';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import ResultsTable from '@/components/Dashboard/ResultsTable';
import { TestCaseGrid } from '../shared/TestCaseGrid';
import { TestConfig } from './sanity/types/sanityCheck';
import { useTestRunner } from '../hook/useTestRunner';
interface TestRunnerProps {
  isRunning?: boolean;
  onRunTests?: (testConfig: TestConfig) => void;
}

export default function TestCasesRunner({ isRunning = false, onRunTests }: TestRunnerProps) {
  const [selectedPackage, setSelectedPackage] = useState(DEFAULT_PACKAGE);
  const [selectedIntervention, setSelectedIntervention] = useState('');
  const [availableInterventions, setAvailableInterventions] = useState<Intervention[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
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
        const pck = await getPackages();
        setPackages(pck || []);
        if (pck?.length > 0) {
          setSelectedPackage(String(pck[0].id));
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };
    fetchPackages();
  }, []);

  // Fetch interventions when package changes
  useEffect(() => {
    if (!selectedPackage) {
      setAvailableInterventions([]);
      return;
    }

    const fetchInterventions = async () => {
      try {
        const intevents = await getInterventionByPackageId(Number(selectedPackage));
        const interventionsArray = Array.isArray(intevents) ? intevents : (intevents ? [intevents] : []);
        setAvailableInterventions(interventionsArray);

        if (interventionsArray.length > 0) {
          setSelectedIntervention(interventionsArray[0].code);

          const complex = await getInterventionByComplexity(1);
          const complexInterventions: Intervention[] = complex?.data || [];
          const complexIds = complexInterventions?.map(intervention => intervention.id);
          setComplexInterventions(complexIds);
        }
      } catch (error) {
        console.error('Error fetching interventions:', error);
      }
    };
    fetchInterventions();
  }, [selectedPackage, setComplexInterventions]);

  // Fetch test cases when intervention changes
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
    <div className="mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-500 mb-6">Automated test suite</h1>

      <div className="bg-white rounded-sm shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-500 mb-4">Test Configuration</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-gray-500">
          <div className="space-y-2">
            <Label htmlFor="package">Package</Label>
            <Select
              value={selectedPackage || ""}
              onValueChange={setSelectedPackage}
            >
              <SelectTrigger id="package" className="w-full">
                <SelectValue placeholder="Select a package" />
              </SelectTrigger>
              <SelectContent>
                {packages.map((pkg) => (
                  <SelectItem key={pkg.id} value={String(pkg.id)}>
                    {pkg.name} ({pkg.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <InterventionSelector
            packageId={selectedPackage}
            interventions={availableInterventions}
            selectedIntervention={selectedIntervention}
            onSelectIntervention={setSelectedIntervention}
          />
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