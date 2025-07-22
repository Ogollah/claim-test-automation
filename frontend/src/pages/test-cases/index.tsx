// TestCasesRunner.tsx
import { useEffect, useState } from 'react';
import { StopIcon, PlayIcon, TrashIcon } from '@heroicons/react/16/solid';
import UseSelector from '@/components/Dashboard/UseSelector';
import InterventionSelector from '@/components/Dashboard/InterventionSelector';
import { InterventionItem, TestCase } from '@/lib/types';
import { runTestSuite, TestResult } from '@/lib/api';
import TestcaseDetails from '@/components/testCases/TestcaseDetails';
import { negativeSha01003, postiveSha01003 } from '@/components/testCases/sha_01';
import ResultsTable from '@/components/Dashboard/ResultsTable';

const TEST_PACKAGES = [
  { id: 'SHA-01', name: 'Ambulance and Emergency Services' },
  { id: 'SHA-03', name: 'Critical Care Services' },
  { id: 'SHA-05', name: 'Optical Health Services' },
];

const INTERVENTION_CODES = {
  'SHA-01': [
    { code: 'SHA-01-001', name: 'Ambulance Evacuations' },
    { code: 'SHA-01-002', name: 'Ambulance Evacuations' },
    { code: 'SHA-01-003', name: 'Cardiac/Respiratory Arrest' },
    { code: 'SHA-01-004', name: 'Major Trauma' },
    { code: 'SHA-01-005', name: 'Shock states' },
    { code: 'SHA-01-006', name: 'Altered level of consciousness' },
    { code: 'SHA-01-007', name: 'Severe respiratory distress' },
    { code: 'SHA-01-008', name: 'Seizures/Status epilepticus' },
    { code: 'SHA-01-010', name: 'Acute Cerebrovascular Accidents' },
    { code: 'SHA-01-011', name: 'Anti-Rabies' },
    { code: 'SHA-01-012', name: 'Anti-Snake Venom' },
    { code: 'SHA-01-013', name: 'Chest Pain' }
  ],
  'SHA-03': [
    { code: 'SHA-03-001', name: 'ICU Care' },
    { code: 'SHA-03-002', name: 'HDU Care' },
    { code: 'SHA-03-003', name: 'NICU Care' },
    { code: 'SHA-03-004', name: 'PICU Care' },
    { code: 'SHA-03-005', name: 'Intensive care Burns Unit' }
  ],
  'SHA-05': [
    { code: 'SHA-05-001', name: 'Consultation and prescription and issuing of glasses' },
  ],
};

type TestRunnerProps = {
  isRunning?: boolean;
  onRunTests?: (testConfig: any) => void;
};

export default function TestCasesRunner({ isRunning = false, onRunTests }: TestRunnerProps) {
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedUse, setSelectedUse] = useState<any>(null);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [selectedIntervention, setSelectedIntervention] = useState('');
  const [runningSection, setRunningSection] = useState<string | null>(null);

  const [interventions, setInterventions] = useState<InterventionItem[]>([]);
  const [availableInterventions, setAvailableInterventions] = useState<any[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [selectedPositiveTests, setSelectedPositiveTests] = useState<string[]>([]);
  const [selectedNegativeTests, setSelectedNegativeTests] = useState<string[]>([]);

  // Current intervention form state
  const [currentIntervention, setCurrentIntervention] = useState({
    serviceQuantity: '',
    unitPrice: '',
    serviceStart: '',
    serviceEnd: '',
  });

  // Update available interventions when package changes
  useEffect(() => {
    if (selectedPackage) {
      setAvailableInterventions(INTERVENTION_CODES[selectedPackage as keyof typeof INTERVENTION_CODES] || []);
      setSelectedIntervention('');
    }
  }, [selectedPackage]);

  const buildTestPayload = (tests: string[], type: 'positive' | 'negative') => {
  const allTestCases: TestCase[] = [
    ...((postiveSha01003 as TestCase[]) ?? []),
    ...((negativeSha01003 as TestCase[]) ?? [])
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
    setSelectedPositiveTests(selectedItems);
    runTests(selectedItems, 'positive');
  };

  const handleRunNegativeTests = (selectedItems: string[]) => {
    setSelectedNegativeTests(selectedItems);
    runTests(selectedItems, 'negative');
  };

  const handleRunAllTests = async () => {

    const allSelectedTests = [...postiveSha01003, ...negativeSha01003];
    if (allSelectedTests.length === 0) {
      alert('Please select at least one test case to run');
      return;
    }

    const testConfig = {
      positive: buildTestPayload(postiveSha01003.map(tc => tc.formData.title), 'positive'),
      negative: buildTestPayload(negativeSha01003.map(tc => tc.formData.title), 'negative')
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
          await new Promise(resolve => setTimeout(resolve, 1000));
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
          await new Promise(resolve => setTimeout(resolve, 1000));
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
            testCases={postiveSha01003}
            onRunTests={handleRunPositiveTests}
            isRunning={isRunning && runningSection === 'positive'}
          />
          <TestcaseDetails 
            title='Negative' 
            testCases={negativeSha01003}
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