// TestCasesRunner.tsx
import { use, useEffect, useState } from 'react';
import { StopIcon, PlayIcon, TrashIcon } from '@heroicons/react/16/solid';
import UseSelector from '@/components/Dashboard/UseSelector';
import InterventionSelector from '@/components/Dashboard/InterventionSelector';
import { InterventionItem, TestCase } from '@/lib/types';
import { runTestSuite, TestResult } from '@/lib/api';
import TestcaseDetails from '@/components/testCases/TestcaseDetails';
import ResultsTable from '@/components/Dashboard/ResultsTable';
import { DEFAULT_PACKAGE, INTERVENTION_CODES, TEST_PACKAGES } from '@/packages/ShaPackages';
import { testCasesPackages } from '@/lib/utils';

type TestRunnerProps = {
  isRunning?: boolean;
  onRunTests?: (testConfig: any) => void;
};

export default function TestCasesRunner({ isRunning = false, onRunTests }: TestRunnerProps) {
  const [selectedPackage, setSelectedPackage] = useState(DEFAULT_PACKAGE);
  const [selectedUse, setSelectedUse] = useState<any>(null);
  const [selectedIntervention, setSelectedIntervention] = useState('');
  const [runningSection, setRunningSection] = useState<string | null>(null);
  const [availableInterventions, setAvailableInterventions] = useState<any[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [currentTestCases, setCurrentTestCases] = useState<{
    positive: TestCase[];
    negative: TestCase[];
  }>({ positive: [], negative: [] });
  const [currentIntervention, setCurrentIntervention] = useState({
    serviceQuantity: '',
    unitPrice: '',
    serviceStart: '',
    serviceEnd: '',
  });

  useEffect(() => {
    if (selectedPackage) {
      const interventions = INTERVENTION_CODES[selectedPackage as keyof typeof INTERVENTION_CODES] || [];
      setAvailableInterventions(interventions);
      setSelectedIntervention('');

      setCurrentTestCases({
        positive: [],
        negative: []
      });
    }
  }, [selectedPackage]);

  useEffect(() => {
    if (selectedIntervention && selectedPackage) {
      const packageData = testCasesPackages.find(pkg => pkg.id === selectedPackage);
      if (packageData) {
        const interventionData = packageData.SHA01InteventionTestCases.find(
          item => item.code === selectedIntervention
        );
        if (interventionData) {
          setCurrentTestCases({
            positive: interventionData.positive || [],
            negative: interventionData.negative || []
          });
        } else {
          setCurrentTestCases({ positive: [], negative: [] });
        }
      } else if (selectedPackage) {
        const packageData = testCasesPackages.find(pkg => pkg.id === selectedPackage);
        if (packageData) {
          const allPositive = packageData.SHA01InteventionTestCases.flatMap(item => item.positive || []);
          const allNegative = packageData.SHA01InteventionTestCases.flatMap(item => item.negative || []);
          setCurrentTestCases({
            positive: allPositive,
            negative: allNegative
          });
        }
      }
    }
  }, [selectedIntervention, selectedPackage]);


  const buildTestPayload = (tests: string[], type: 'positive' | 'negative') => {
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
      alert('Please select at least one test case to run');
      return;
    }

    const testConfig = {
      positive: buildTestPayload(currentTestCases.positive.map(tc => tc.formData.title), 'positive'),
      negative: buildTestPayload(currentTestCases.negative.map(tc => tc.formData.title), 'negative')
    };
    console.log('Running all tests with config:', testConfig);
    

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
        
        const testResult = await runTestSuite(testCase);
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

  const runTests = async (selectedItems: string[], type: 'positive' | 'negative') => {

    if (selectedItems.length === 0) {
      alert(`Please select at least one ${type} test case to run`);
      return;
    }

    const testConfig = {
      [type]: buildTestPayload(selectedItems, type)
    };
    console.log(`Running ${type} tests with config:`, testConfig);

    if (onRunTests) {
      setRunningSection(type);
      await onRunTests(testConfig);
      setRunningSection(null);
    }

        try {
      const allTests = [
        ...testConfig.positive ? testConfig.positive : [],
        ...testConfig.negative ? testConfig.negative : []
      ];
      for (const [index, testCase] of allTests.entries()) {
        console.log(`Running test ${index + 1}/${allTests.length}: ${testCase.formData.title}`);
        console.log('Test case details:', testCase);
        
        const testResult = await runTestSuite(testCase);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Claims Bundle Automation Test</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Test Configuration</h2>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <UseSelector
            use={selectedUse}
            onSelectUse={setSelectedUse}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Package</label>
            <div className="relative">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
              >
                <option value="">Select a package</option>
                {TEST_PACKAGES.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} ({pkg.id})
                  </option>
                ))}
              </select>
            </div>
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
          />
          <TestcaseDetails 
            title='Negative' 
            testCases={currentTestCases.negative}
            onRunTests={handleRunNegativeTests}
            isRunning={isRunning && runningSection === 'negative'}
          />
        </div>

        <div className="flex justify-between w-full">
          <button
            type="button"
            onClick={handleRunAllTests}
            disabled={isRunning}
            className={`inline-flex items-center px-4 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              isRunning
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
          </button>
        </div>
      </div>
      <ResultsTable results={results} />
    </div>
  );
}