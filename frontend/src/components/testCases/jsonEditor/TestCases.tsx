'use client';

import { useCallback } from "react";
import {
    TrashIcon,
} from "@heroicons/react/16/solid";
import {
    CheckIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import InterventionSelector from "@/components/Dashboard/InterventionSelector";
import {
    Intervention,
    Package,
    TestCaseItem,
} from "@/lib/types";

const TABLE_HEADERS = [
    "Select",
    "Intervention",
    "Test Case Name",
    "Description",
    "Actions"
];

interface TestCasesProps {
    packages: Package[];
    availableInterventions: Intervention[];
    tests: TestCaseItem[];
    selectedPackage: string;
    selectedIntervention: string;
    selectedTestCase: TestCaseItem | null;
    onSelectPackage: (packageId: string) => void;
    onSelectIntervention: (interventionCode: string) => void;
    onTestCaseSelect: (testCase: TestCaseItem | null) => void;
    onDeleteTestCase: (testId: number) => void;
}

export default function TestCases({
    packages,
    availableInterventions,
    tests,
    selectedPackage,
    selectedIntervention,
    selectedTestCase,
    onSelectPackage,
    onSelectIntervention,
    onTestCaseSelect,
    onDeleteTestCase
}: TestCasesProps) {

    const handleSelectTestCase = useCallback((testCase: TestCaseItem) => {
        if (testCase.id) {
            const newSelected = selectedTestCase?.id === testCase.id ? null : testCase;
            onTestCaseSelect(newSelected);
        }
    }, [selectedTestCase, onTestCaseSelect]);

    const handleDelete = useCallback(async (testId: number) => {
        toast.info("Are you sure you want to delete this test case? This action cannot be undone.", {
            action: {
                label: "Delete",
                onClick: async() => {
                    try {
                        onDeleteTestCase(testId);
                    } catch (error) {
                        console.error("Error deleting test case:", error);
                        toast.error("Failed to delete test case");
                    }
                }
            },
            cancel: {
                label: "Cancel",
                onClick: ()=> {
                    toast.dismiss();
                }
            },
            duration: 10000,
        })
    }, [onDeleteTestCase]);

    return (
        <div className="mx-auto py-4 text-gray-500">
            <div className="bg-white rounded-sm shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-gray-500">
                    {/* Package Selector */}
                    <div className="space-y-2">
                        <Label htmlFor="package">Package</Label>
                        <Select
                            value={selectedPackage || ""}
                            onValueChange={onSelectPackage}
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
                        onSelectIntervention={onSelectIntervention}
                    />
                </div>

                {/* Selected test case info */}
                {selectedTestCase && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center">
                            <CheckIcon className="h-5 w-5 text-blue-600 mr-2" />
                            <span className="text-blue-700 font-medium">
                                Selected: {selectedTestCase.name}
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
                                        const isSelected = selectedTestCase?.id === test.id;
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
                                                            test.id !== undefined && handleDelete(test.id);
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