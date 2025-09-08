import React from 'react';
import { Button } from '@/components/ui/button';
import { StopIcon } from '@heroicons/react/16/solid';
import { PlayIcon } from 'lucide-react';
import TestcaseDetails from '@/components/testCases/TestcaseDetails';
import { TestCaseItem } from '@/lib/types';

interface TestCaseGridProps {
    currentTestCases: {
        positive: TestCaseItem[];
        negative: TestCaseItem[];
    };
    isRunning: boolean;
    runningSection: string | null;
    complexInterventions: number[];
    onRunPositiveTests: (selectedItems: string[]) => void;
    onRunNegativeTests: (selectedItems: string[]) => void;
    onRunAllTests: () => void;
    onUpdatePatient: (testCaseTitle: string, patient: FormatPatient) => void;
}

export const TestCaseGrid: React.FC<TestCaseGridProps> = ({
    currentTestCases,
    isRunning,
    runningSection,
    complexInterventions,
    onRunPositiveTests,
    onRunNegativeTests,
    onRunAllTests,
    onUpdatePatient
}) => (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <TestcaseDetails
                title="Positive"
                testCases={currentTestCases.positive}
                onRunTests={onRunPositiveTests}
                isRunning={isRunning && runningSection === 'positive'}
                onUpdatePatient={onUpdatePatient}
                interventions={complexInterventions}
            />
            <TestcaseDetails
                title="Negative"
                testCases={currentTestCases.negative}
                onRunTests={onRunNegativeTests}
                isRunning={isRunning && runningSection === 'negative'}
                onUpdatePatient={onUpdatePatient}
                interventions={complexInterventions}
            />
        </div>
        <div className="flex justify-between w-full">
            <Button
                type="button"
                onClick={onRunAllTests}
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
    </>
);