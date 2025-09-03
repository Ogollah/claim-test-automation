import { useEffect, useMemo, useState, useCallback } from "react";
import {
  StopIcon,
  PlayIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Label } from "../ui/label";
import PatientDetailsPanel from "./PatientDetailsPanel";
import ProviderDetailsPanel from "./ProviderDetailsPanel";
import InterventionSelector from "./InterventionSelector";
import PractitionerDetailsPanel from "./PractitionerDetailsPanel";
import {
  getInterventionByPackageId,
  getPackages,
} from "@/lib/api";
import {
  Intervention,
  InterventionItem,
  Package,
  Provider,
  Practitioner,
} from "@/lib/types";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import CustomSelector from "./UseSelector";
import { toast } from "sonner";
import { PER_DIEM_CODES } from "@/lib/utils";

type TestRunnerProps = {
  isRunning?: boolean;
  onRunTests?: (testConfig: any) => void;
};

interface DateFields {
  billableStart: Date | undefined;
  billableEnd: Date | undefined;
  created: Date;
}

const DATE_FIELD_LABELS: Record<keyof DateFields, string> = {
  billableStart: "Billable Start Date",
  billableEnd: "Billable End Date",
  created: "Created Date"
};

const INTERVENTION_FIELDS = [
  { label: "Days", key: "days", disabled: true },
  { label: "Unit price", key: "unitPrice", disabled: false },
  { label: "Net value", key: "netValue", disabled: true }
];

const TABLE_HEADERS = [
  "Package",
  "Intervention",
  "Quantity",
  "Unit Price",
  "Net Value",
  "Service Period",
  "Actions"
];

export default function TestRunner({
  isRunning = false,
  onRunTests,
}: TestRunnerProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [selectedUse, setSelectedUse] = useState<string>("claim");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedPractitioner, setSelectedPractitioner] = useState<Practitioner | null>(null);
  const [selectedIntervention, setSelectedIntervention] = useState<string>("");

  const today = useMemo(() => new Date(), []);
  const twoDays = useMemo(() => {
    const date = new Date(today);
    date.setDate(today.getDate() - 2);
    return date;
  }, [today]);

  const [selectedDates, setSelectedDates] = useState<DateFields>({
    billableStart: twoDays,
    billableEnd: today,
    created: today,
  });

  const [packages, setPackages] = useState<Package[]>([]);
  const [interventions, setInterventions] = useState<InterventionItem[]>([]);
  const [availableInterventions, setAvailableInterventions] = useState<Intervention[]>([]);
  const [selectedClaimSubType, setClaimSubType] = useState<string>("ip");
  const [relatedClaimId, setRelatedClaimId] = useState("");

  const [currentIntervention, setCurrentIntervention] = useState({
    days: "1",
    unitPrice: "10000",
    serviceStart: format(twoDays, "yyyy-MM-dd"),
    serviceEnd: format(today, "yyyy-MM-dd"),
  });

  const currentNetValue = useMemo(() =>
    Number(currentIntervention.days) * Number(currentIntervention.unitPrice) || 0,
    [currentIntervention.days, currentIntervention.unitPrice]
  );

  const [total, setTotal] = useState<number>(currentNetValue);
  const [isTotalManuallyChanged, setIsTotalManuallyChanged] = useState(false);

  const isPerdiem = useMemo(() =>
    PER_DIEM_CODES.has(selectedIntervention),
    [selectedIntervention]
  );

  useEffect(() => {
    if (!isTotalManuallyChanged) {
      setTotal(currentNetValue);
    }
  }, [currentNetValue, isTotalManuallyChanged]);

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

  // Update days for per diem interventions
  useEffect(() => {
    if (isPerdiem && currentIntervention.serviceStart && currentIntervention.serviceEnd) {
      try {
        const start = new Date(currentIntervention.serviceStart);
        const end = new Date(currentIntervention.serviceEnd);

        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          const diffInMs = end.getTime() - start.getTime();
          const diffInDays = Math.max(1, Math.ceil(diffInMs / (1000 * 60 * 60 * 24)));

          setCurrentIntervention(prev => ({
            ...prev,
            days: String(diffInDays),
          }));
        }
      } catch (error) {
        console.error("Error calculating date difference:", error);
      }
    } else {
      setCurrentIntervention(prev => ({
        ...prev,
        days: "1",
      }));
    }
  }, [isPerdiem, currentIntervention.serviceStart, currentIntervention.serviceEnd]);

  const addIntervention = useCallback(() => {
    if (!selectedPackage || !selectedIntervention) {
      toast.error("Please select a package and intervention");
      return;
    }

    const interventionName = availableInterventions.find(
      (i) => i.code === selectedIntervention
    )?.name || "";

    const newIntervention: InterventionItem = {
      id: `${selectedIntervention}-${Date.now()}`,
      packageId: selectedPackage,
      code: selectedIntervention,
      name: interventionName,
      days: currentIntervention.days,
      unitPrice: currentIntervention.unitPrice,
      serviceStart: currentIntervention.serviceStart,
      serviceEnd: currentIntervention.serviceEnd,
      netValue: currentNetValue,
      serviceQuantity: "1",
    };

    setInterventions(prev => [...prev, newIntervention]);
    setCurrentIntervention({
      days: "1",
      unitPrice: "10000",
      serviceStart: format(twoDays, "yyyy-MM-dd"),
      serviceEnd: format(today, "yyyy-MM-dd"),
    });

    // Reset manual total change flag when adding new intervention
    setIsTotalManuallyChanged(false);
  }, [selectedPackage, selectedIntervention, availableInterventions, currentIntervention, currentNetValue, twoDays, today]);

  const removeIntervention = useCallback((id: string) => {
    setInterventions(prev => prev.filter(item => item.id !== id));
  }, []);

  const buildTestPayload = useCallback(() => ({
    formData: {
      title: `Test for ${selectedIntervention}`,
      test: "build",
      patient: selectedPatient,
      provider: selectedProvider,
      use: selectedUse,
      claimSubType: selectedClaimSubType,
      practitioner: selectedPractitioner,
      relatedClaimId: relatedClaimId,
      productOrService: interventions.map((intervention, index) => ({
        code: intervention.code,
        display: intervention.name,
        quantity: { value: "1" },
        unitPrice: {
          value: isPerdiem ? Number(intervention.unitPrice) * Number(intervention.days) : intervention.unitPrice,
          currency: "KES",
        },
        net: {
          value: intervention.netValue,
          currency: "KES",
        },
        servicePeriod: {
          start: intervention.serviceStart,
          end: intervention.serviceEnd,
        },
        sequence: index + 1,
      })),
      billablePeriod: {
        billableStart: selectedDates.billableStart ? format(selectedDates.billableStart, "yyyy-MM-dd") : "",
        billableEnd: selectedDates.billableEnd ? format(selectedDates.billableEnd, "yyyy-MM-dd") : "",
        created: format(selectedDates.created, "yyyy-MM-dd"),
      },
      total: { value: total, currency: "KES" },
    },
  }), [
    selectedIntervention, selectedPatient, selectedProvider, selectedUse,
    selectedClaimSubType, selectedPractitioner, relatedClaimId, interventions,
    isPerdiem, selectedDates, total
  ]);

  const handleRunTests = useCallback(() => {
    if (!selectedPatient || !selectedProvider || interventions.length === 0) {
      toast.error("Please select all required fields and add at least one intervention");
      return;
    }

    const testConfig = buildTestPayload();
    onRunTests?.(testConfig);
  }, [selectedPatient, selectedProvider, interventions.length, buildTestPayload, onRunTests]);

  const handleTotalChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setTotal(newValue);
    setIsTotalManuallyChanged(true);
  }, []);

  const handleResetTotal = useCallback(() => {
    setTotal(currentNetValue);
    setIsTotalManuallyChanged(false);
  }, [currentNetValue]);

  const renderDateField = useCallback((key: keyof DateFields, isCreated = false) => {
    const label = DATE_FIELD_LABELS[key];
    const dateValue = selectedDates[key];

    return (
      <div key={key} className="flex flex-col gap-3">
        <Label htmlFor={key}>{label}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal"
              disabled={isCreated}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateValue ? format(dateValue, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0 z-50">
            <Calendar
              className="text-blue-500"
              mode="single"
              selected={dateValue}
              onSelect={(date) => {
                setSelectedDates(prev => ({
                  ...prev,
                  [key]: date || undefined,
                }));
              }}
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }, [selectedDates]);

  const renderInterventionField = useCallback(({ label, value, key, disabled }: {
    label: string;
    value: string | number;
    key: string;
    disabled?: boolean;
  }) => (
    <div key={key}>
      <Label className="py-3">{label}</Label>
      <Input
        type="number"
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        value={value}
        disabled={disabled}
        onChange={(e) => {
          if (!disabled) {
            setCurrentIntervention(prev => ({
              ...prev,
              [key]: e.target.value,
            }));
          }
        }}
      />
    </div>
  ), []);

  return (
    <div className="mx-auto py-4 text-gray-500">
      <h1 className="text-2xl font-bold text-gray-500 mb-6">
        Custom test claim form
      </h1>

      <div className="bg-white rounded-sm shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-500 mb-4">
          Test Configuration
        </h2>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <CustomSelector
            options={[
              { id: "claim", label: "Claim" },
              { id: "preauthorization", label: "Preauthorization" },
              { id: "related", label: "Related claim" }
            ]}
            value={selectedUse}
            onChange={setSelectedUse}
            label="Select use"
            placeholder="Choose use type"
          />
          <CustomSelector
            options={[
              { id: "ip", label: "Inpatient (IP)" },
              { id: "op", label: "Outpatient (OP)" }
            ]}
            value={selectedClaimSubType}
            onChange={setClaimSubType}
            label="Select access point"
            placeholder="Choose access point"
          />
        </div>

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

        {/* Related claim input field */}
        {selectedUse === "related" && (
          <div className="border-t border-gray-200 pt-4 mb-6 text-gray-500">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
              <div>
                <Label className="py-3">Related claim ID</Label>
                <Input
                  type="text"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={relatedClaimId}
                  onChange={(e) => setRelatedClaimId(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-gray-500">
          {Object.keys(selectedDates).map((key) =>
            renderDateField(key as keyof DateFields, key === "created")
          )}
        </div>

        {/* Add Intervention */}
        <div className="border-t border-gray-200 pt-4 mb-6 text-gray-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {INTERVENTION_FIELDS.map(({ label, key, disabled }) => (
              renderInterventionField({
                label,
                value: key === "netValue" ? currentNetValue : currentIntervention[key as keyof typeof currentIntervention],
                key,
                disabled
              })
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {["serviceStart", "serviceEnd"].map((key) => {
              const label = key === "serviceStart" ? "Service Start Date" : "Service End Date";
              const dateValue = currentIntervention[key as keyof typeof currentIntervention]
                ? new Date(currentIntervention[key as keyof typeof currentIntervention])
                : undefined;

              return (
                <div key={key} className="flex flex-col gap-2">
                  <Label>{label}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateValue ? format(dateValue, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        className="text-blue-500"
                        selected={dateValue}
                        onSelect={(date) =>
                          setCurrentIntervention(prev => ({
                            ...prev,
                            [key]: date ? format(date, "yyyy-MM-dd") : "",
                          }))
                        }
                        captionLayout="dropdown"
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              );
            })}

            <div className="flex items-end">
              <Button
                onClick={addIntervention}
                disabled={!selectedPackage || !selectedIntervention}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Plus className="h-5 w-5" />
                Add Intervention
              </Button>
            </div>
          </div>
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
                      <TableCell className="px-6 py-4 text-sm text-gray-500">{intervention.unitPrice}</TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-500">{intervention.netValue}</TableCell>
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

        {/* Patient, Provider, Practitioner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 text-gray-500">
          <PatientDetailsPanel
            patient={selectedPatient}
            onSelectPatient={setSelectedPatient}
          />
          <ProviderDetailsPanel
            provider={selectedProvider}
            onSelectProvider={setSelectedProvider}
          />
          <PractitionerDetailsPanel
            practitioner={selectedPractitioner}
            onSelectPractitioner={setSelectedPractitioner}
          />
        </div>

        <div className="flex justify-between w-full">
          <div className="text-gray-500">
            <div className="flex items-center gap-2 mb-1">
              <Label className="py-3">Total</Label>
              {isTotalManuallyChanged && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetTotal}
                  className="text-xs text-blue-500 hover:text-blue-700"
                >
                  Reset to calculated
                </Button>
              )}
            </div>
            <Input
              type="number"
              className="block w-full px-3 py-2 bg-green-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={total.toFixed(2)}
              onChange={handleTotalChange}
            />
          </div>
          <Button
            onClick={handleRunTests}
            disabled={isRunning || interventions.length === 0}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isRunning || interventions.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
          >
            {isRunning ? (
              <>
                <StopIcon className="-ml-1 mr-2 h-5 w-5" />
                Running Tests...
              </>
            ) : (
              <>
                <PlayIcon className="-ml-1 mr-2 h-5 w-5" />
                Run Tests
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}