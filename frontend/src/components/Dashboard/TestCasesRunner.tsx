import { useEffect, useState } from 'react';
import { StopIcon } from '@heroicons/react/16/solid';
import InterventionSelector from '@/components/Dashboard/InterventionSelector';
import { FormatPatient, Intervention, Package, TestCase, TestCaseItem, TestResult } from '@/lib/types';
import { getInterventionByComplexity, getInterventionByPackageId, getPackages, getTestCaseByCode } from '@/lib/api';
import TestcaseDetails from '@/components/testCases/TestcaseDetails';
import ResultsTable from '@/components/Dashboard/ResultsTable';
import { DEFAULT_PACKAGE } from '@/packages/ShaPackages';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { PlayIcon } from 'lucide-react';
import { toast } from 'sonner';
import { refreshTestResult } from '@/utils/claimUtils';
import { runTestSuite } from '@/utils/testUtils';

type TestRunnerProps = {
  isRunning?: boolean;
  onRunTests?: (testConfig: any) => void;
};

export default function TestCasesRunner({ isRunning = false, onRunTests }: TestRunnerProps) {
  const [selectedPackage, setSelectedPackage] = useState(DEFAULT_PACKAGE);
  const [selectedIntervention, setSelectedIntervention] = useState('');
  const [runningSection, setRunningSection] = useState<string | null>(null);
  const [availableInterventions, setAvailableInterventions] = useState<any[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [testCases, setTestCases] = useState<TestCaseItem[]>([]);
  const [currentTestCases, setCurrentTestCases] = useState<{
    positive: TestCaseItem[];
    negative: TestCaseItem[];
  }>({ positive: [], negative: [] });
  const [complexInterventions, setComplexInterventions] = useState<number[]>([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const pck = await getPackages()
        setPackages(pck || []);
        if (pck && pck.length > 0) {
          setSelectedPackage(String(pck[0].id));
        }
      } catch (error) {
        console.error("--> Error fetching packages:", error)
      }
    }
    fetchPackages()
  }, []);

  useEffect(() => {
    if (!selectedPackage) {
      setAvailableInterventions([]);
      return;
    }
    if (selectedPackage) {
      const fetchInterventions = async () => {
        try {
          const intevents = await getInterventionByPackageId(
            Number(selectedPackage)
          )
          setAvailableInterventions(Array.isArray(intevents) ? intevents : (intevents ? [intevents] : []))
          if (Array.isArray(intevents) && intevents.length > 0) {
            setSelectedIntervention(intevents[0].code);

            const complex = await getInterventionByComplexity(1);
            const complexInterventions: Intervention[] = complex?.data || [];
            const complexIds = complexInterventions?.map(intervention => intervention.id);
            setComplexInterventions(complexIds);
          }
        } catch (error) {
          console.error("--> Error fetching interventions:", error)
        }
      }
      fetchInterventions()
    } else {
      setAvailableInterventions([])
    }
  }, [selectedPackage]);


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
      const testCase = allTestCases.find(tc => tc?.test_config?.formData.title === testTitle);
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
        console.log(`Running test ${index + 1}/${allTests.length}: ${testCase?.test_config?.formData.title}`);
        console.log('Test case details:', testCase);

        const response = await getTestCaseByCode(testCase?.test_config?.formData.productOrService[0].code);
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
        console.log(`Running test ${index + 1}/${allTests.length}: ${testCase?.test_config?.formData.title}`);
        console.log('Test case details:', testCase);

        const response = await getTestCaseByCode(testCase?.test_config?.formData.productOrService[0].code);
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
    <div className="mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-500 mb-6">Automated test suite</h1>

      <div className="bg-white rounded-sm shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-500 mb-4">Test Configuration</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-gray-500">
          {/* Package Selector (ShadCN Style) */}
          <div className="space-y-2">
            <Label htmlFor="package">Package</Label>
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

          <InterventionSelector
            packageId={selectedPackage}
            interventions={availableInterventions}
            selectedIntervention={selectedIntervention}
            onSelectIntervention={setSelectedIntervention}
          />
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