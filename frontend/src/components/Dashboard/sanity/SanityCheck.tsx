import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import AllTestCases from "./AllTests";
import PackageTestCases from "./PackageTest";
import { TestConfig } from "./types/sanityCheck";

interface SanityCheckProps {
    isRunning: boolean;
    onRunTests: (payload: TestConfig) => void;
}

export default function SanityCheck({ isRunning, onRunTests }: SanityCheckProps) {
    const handleClearSession = () => {
        const keys = [
            'package-running-section', 'package-results', 'selected-package',
            'complex-interventions', 'packages', 'intervention-ids',
            'package-test-cases', 'current-test-cases',
            'all-running-section', 'all-results', 'all-test-cases',
            'all-current-test-cases', 'all-complex-interventions'
        ];

        keys.forEach(key => sessionStorage.removeItem(key));
        window.location.reload();
    };

    return (
        <div className="max-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-500">Sanity Check</h2>
                    <p className="text-gray-600">Run a suite of predefined sanity checks to ensure system stability.</p>
                </div>
                <button
                    onClick={handleClearSession}
                    className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                >
                    Clear Session
                </button>
            </div>
            <div className="bg-white rounded-sm shadow-md p-6 mb-10">
                <div className="py-2 by-gray-50 text-gray-500">
                    <Tabs defaultValue="all" className="px-2">
                        <TabsList className="mb-4">
                            <TabsTrigger value="all" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                                All tests
                            </TabsTrigger>
                            <TabsTrigger value="package" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                                Test package
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="all">
                            <AllTestCases isRunning={isRunning} onRunTests={onRunTests} />
                        </TabsContent>
                        <TabsContent value="package">
                            <PackageTestCases isRunning={isRunning} onRunTests={onRunTests} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}