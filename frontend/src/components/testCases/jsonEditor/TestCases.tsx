import { useEffect, useMemo, useState, useCallback } from "react";
import {
    StopIcon,
    PlayIcon,
    TrashIcon,
} from "@heroicons/react/16/solid";
import {
    getInterventionByPackageId,
    getPackages,
    getTestCaseByCode,
    deleteTestCase as deleteTestCaseApi,
    deleteTestCase
} from "@/lib/api";
import {
    Intervention,
    Package,
    TestCaseItem,
} from "@/lib/types";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import InterventionSelector from "@/components/Dashboard/InterventionSelector";

const TABLE_HEADERS = [
    "Select",
    "Intervention",
    "Test Case Name",
    "Description",
    "Actions"
];

export default function TestCases({ onTestCaseSelect }: { onTestCaseSelect?: (testCase: any) => void }) {
    const [selectedPackage, setSelectedPackage] = useState<string>("");
    const [selectedIntervention, setSelectedIntervention] = useState<string>("");
    const [packages, setPackages] = useState<Package[]>([]);
    const [availableInterventions, setAvailableInterventions] = useState<Intervention[]>([]);
    const [tests, setTests] = useState<TestCaseItem[]>([]);
    const [selectedTestCase, setSelectedTestCase] = useState<number | null>(null);

    // Fetch packages on mount
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const pck = await getPackages();
                setPackages(pck || []);
                if (pck && pck.length > 0) {
                    setSelectedPackage(String(pck[0].id));
                }
            } catch (error) {
                console.error("Error fetching packages:", error);
                toast.error("Failed to load packages");
            }
        };
        fetchPackages();
    }, []);

    // Fetch interventions when package changes
    useEffect(() => {
        if (!selectedPackage) {
            setAvailableInterventions([]);
            setSelectedIntervention("");
            return;
        }

        const fetchInterventions = async () => {
            try {
                const intevents = await getInterventionByPackageId(Number(selectedPackage));
                setAvailableInterventions(Array.isArray(intevents) ? intevents : []);
                if (Array.isArray(intevents) && intevents.length > 0) {
                    setSelectedIntervention(intevents[0].code);
                } else {
                    setSelectedIntervention("");
                    setTests([]);
                }
            } catch (error) {
                console.error("Error fetching interventions:", error);
                toast.error("Failed to load interventions");
            }
        };
        fetchInterventions();
    }, [selectedPackage]);

    useEffect(() => {
        if (!selectedIntervention) {
            setTests([]);
            setSelectedTestCase(null);
            return;
        }

        const fetchTestCases = async () => {
            try {
                const response = await getTestCaseByCode(selectedIntervention);
                const testCases = Array.isArray(response)
                    ? response
                    : (response && Array.isArray(response.data) ? response.data : []);
                setTests(testCases);
                setSelectedTestCase(null);
            } catch (error) {
                console.error("Error fetching test cases:", error);
                toast.error("Failed to load test cases");
                setTests([]);
                setSelectedTestCase(null);
            }
        };
        fetchTestCases();
    }, [selectedIntervention]);

    const handleDeleteTestCase = useCallback(async (testId: number) => {
        try {
            await deleteTestCase(testId);
            setTests(prevTests => prevTests.filter(test => test.id !== testId));

            if (selectedTestCase === testId) {
                setSelectedTestCase(null);
            }

            toast.success("Test case deleted successfully");
        } catch (error) {
            console.error("Error deleting test case:", error);
            toast.error("Failed to delete test case");
        }
    }, [selectedTestCase]);

    const handleSelectTestCase = useCallback((testCase: TestCaseItem) => {

        if (testCase.id) {
            setSelectedTestCase(prevSelected => prevSelected === testCase.id ? null : testCase.id);

            if (onTestCaseSelect) {
                if (selectedTestCase === testCase.id) {
                    onTestCaseSelect(null);
                } else {
                    onTestCaseSelect(testCase);
                }
            }
        }
    }, [selectedTestCase, onTestCaseSelect]);

    return (
        <div className="mx-auto py-4 text-gray-500">
            <div className="bg-white rounded-sm shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-gray-500">
                    {/* Package Selector */}
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

                {/* Selected test case info */}
                {selectedTestCase && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center">
                            <CheckIcon className="h-5 w-5 text-blue-600 mr-2" />
                            <span className="text-blue-700 font-medium">
                                Selected: {tests.find(t => t.id === selectedTestCase)?.name}
                            </span>
                        </div>
                    </div>
                )}

                {/* Test cases Table */}
                {tests.length > 0 ? (
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-500 mb-2">
                            Test cases
                        </h3>
                        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {TABLE_HEADERS.map((header) => (
                                            <th
                                                key={header}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                scope="col"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tests.map((test) => {
                                        const isSelected = selectedTestCase === test.id;
                                        return (
                                            <tr
                                                key={test.id}
                                                className={isSelected ? "bg-blue-50" : "hover:bg-gray-50 cursor-pointer"}
                                                onClick={() => handleSelectTestCase(test)}
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    <div className={`flex items-center justify-center h-5 w-5 rounded-full border-2 ${isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
                                                        {isSelected && <CheckIcon className="h-3 w-3 text-white" />}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{selectedIntervention}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{test.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{test.description}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 flex space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            test.id !== undefined && handleDeleteTestCase(test.id);
                                                        }}
                                                        className="text-red-500 hover:text-red-700"
                                                        title="Delete test case"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        {selectedIntervention ? `No test cases found for this intervention: ${selectedIntervention}` : "Select an intervention to view test cases"}
                    </div>
                )}
            </div>
        </div>
    );
}