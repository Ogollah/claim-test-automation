import { useEffect, useMemo, useState, useCallback } from "react";
import {
    StopIcon,
    PlayIcon,
    TrashIcon,
} from "@heroicons/react/16/solid";
import {
    getInterventionByPackageId,
    getPackages,
} from "@/lib/api";
import {
    Intervention,
    InterventionItem,
    Package,
    Patient,
    Provider,
    Practitioner,
} from "@/lib/types";
import { CalendarIcon, Plus, Table } from "lucide-react";
import { format } from "date-fns/format";
import { toast } from "sonner";
import { PER_DIEM_CODES } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import InterventionSelector from "@/components/Dashboard/InterventionSelector";


const TABLE_HEADERS = [
    "Package",
    "Intervention",
    "Test case",
    "Actions"
];

export default function TestCases() {
    const [selectedPackage, setSelectedPackage] = useState<string>("");
    const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
    const [selectedUse, setSelectedUse] = useState<string>("claim");
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
    const [selectedPractitioner, setSelectedPractitioner] = useState<Practitioner | null>(null);
    const [selectedIntervention, setSelectedIntervention] = useState<string>("");

    const [packages, setPackages] = useState<Package[]>([]);
    const [interventions, setInterventions] = useState<InterventionItem[]>([]);
    const [availableInterventions, setAvailableInterventions] = useState<Intervention[]>([]);
    const [selectedClaimSubType, setClaimSubType] = useState<string>("ip");
    const [relatedClaimId, setRelatedClaimId] = useState("");

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
            return;
        }

        const fetchInterventions = async () => {
            try {
                const intevents = await getInterventionByPackageId(Number(selectedPackage));
                setAvailableInterventions(Array.isArray(intevents) ? intevents : []);
                if (Array.isArray(intevents) && intevents.length > 0) {
                    setSelectedIntervention(intevents[0].code);
                }
            } catch (error) {
                console.error("Error fetching interventions:", error);
                toast.error("Failed to load interventions");
            }
        };
        fetchInterventions();
    }, [selectedPackage]);

    const addIntervention = useCallback(() => {
        if (!selectedPackage || !selectedIntervention) {
            toast.error("Please select a package and intervention");
            return;
        }
    }, [selectedPackage, selectedIntervention]);

    return (
        <div className="mx-auto py-4 text-gray-500">
            <h1 className="text-2xl font-bold text-gray-500 mb-6">
                Custom test claim form
            </h1>

            <div className="bg-white rounded-sm shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-500 mb-4">
                    Test cases
                </h2>

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

                {/* Selected Interventions Table */}
                {interventions.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-500 mb-2">
                            Selected Interventions
                        </h3>
                        <div className="overflow-x-auto bg-white rounded-lg shadow-md p-6 mb-8">
                            <Table className="min-w-full divide-y divide-gray-200">
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        {TABLE_HEADERS.map((header) => (
                                            <TableHead
                                                key={header}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                scope="col"
                                            >
                                                {header}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="bg-white divide-y divide-gray-200">
                                    {interventions.map((intervention) => (
                                        <TableRow key={intervention.id}>
                                            <TableCell className="px-6 py-4 text-sm text-gray-500">{intervention.packageId}</TableCell>
                                            <TableCell className="px-6 py-4 text-sm text-gray-500">{intervention.code}</TableCell>
                                            <TableCell className="px-6 py-4 text-sm text-gray-500">{intervention.serviceQuantity}</TableCell>
                                            <TableCell className="px-6 py-4 text-sm text-gray-500">
                                                {intervention.serviceStart} to {intervention.serviceEnd}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-sm text-gray-500">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => removeIntervention(intervention.id)}
                                                    className="text-red-500 hover:text-red-900"
                                                >
                                                    <TrashIcon className="h-6 w-6" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

