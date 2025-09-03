import { useEffect, useState, useCallback, useMemo } from "react"
import {
  StopIcon,
  PlayIcon,
  TrashIcon,
} from "@heroicons/react/16/solid"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select"
import { Label } from "../ui/label"
import PatientDetailsPanel from "./PatientDetailsPanel"
import ProviderDetailsPanel from "./ProviderDetailsPanel"
import InterventionSelector from "./InterventionSelector"
import PractitionerDetailsPanel from "./PractitionerDetailsPanel"
import {
  getInterventionByPackageId,
  getPackages,
  getPackagesByIsPreauth,
} from "@/lib/api"
import {
  ComplexCase,
  Intervention,
  Package,
  Patient,
  Provider,
  Practitioner,
  TestCase
} from "@/lib/types"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns/format"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { toast } from "sonner"
import { cn, PER_DIEM_CODES } from "@/lib/utils"
import { v4 as uuidv4 } from 'uuid'

type ComplexCaseBuilderProps = {
  isRunning?: boolean
  onRunTests?: (testConfig: TestCase) => void
}

interface DateFields {
  billableStart: Date | undefined
  billableEnd: Date | undefined
  created: Date
}

interface CurrentIntervention {
  days: string
  unitPrice: string
  serviceStart: string
  serviceEnd: string
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

const getTableHeaders = (showApproved: boolean) => {
  const baseHeaders = [
    "Intervention",
    "Test",
    "Pre-auth amount",
    "Status",
    "Actions"
  ];

  if (showApproved) {
    // Insert "Claimed amount" after "Pre-auth amount"
    baseHeaders.splice(3, 0, "Claimed amount");
  }

  return baseHeaders;
};

export default function ComplexCaseBuilder({
  isRunning = false,
  onRunTests,
}: ComplexCaseBuilderProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedPractitioner, setSelectedPractitioner] = useState<Practitioner | null>(null);
  const [selectedIntervention, setSelectedIntervention] = useState<string>("");
  const [currentTestIndex, setCurrentTestIndex] = useState<number>(0);
  const [packageIds, setPackageIds] = useState<string[]>([]);
  const [showApproved, setShowApproved] = useState(false);

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
  const [complexCases, setComplexCases] = useState<ComplexCase[]>([]);
  const [availableInterventions, setAvailableInterventions] = useState<Intervention[]>([]);

  const [currentIntervention, setCurrentIntervention] = useState<CurrentIntervention>({
    days: "1",
    unitPrice: "10000",
    serviceStart: format(twoDays, "yyyy-MM-dd"),
    serviceEnd: format(today, "yyyy-MM-dd"),
  });

  const currentNetValue = useMemo(() =>
    Number(currentIntervention.days) * Number(currentIntervention.unitPrice) || 0,
    [currentIntervention.days, currentIntervention.unitPrice]
  );

  const [approvedAmount, setApprovedAmount] = useState<number>(currentNetValue);
  const [total, setTotal] = useState<number>(currentNetValue);
  const [isTotalManuallyChanged, setIsTotalManuallyChanged] = useState(false);
  const [isApprovedAmountManuallyChanged, setIsApprovedAmountManuallyChanged] = useState(false);

  useEffect(() => {
    if (!isApprovedAmountManuallyChanged) {
      setApprovedAmount(currentNetValue);
    }
  }, [currentNetValue, isApprovedAmountManuallyChanged]);

  useEffect(() => {
    if (!isTotalManuallyChanged) {
      setTotal(currentNetValue);
    }
  }, [currentNetValue, isTotalManuallyChanged]);

  const handleResetTotal = useCallback(() => {
    setTotal(currentNetValue);
    setIsTotalManuallyChanged(false);
  }, [currentNetValue]);

  const handleResetApprovedAmount = useCallback(() => {
    setApprovedAmount(currentNetValue);
    setIsApprovedAmountManuallyChanged(false);
  }, [currentNetValue]);

  const canAddIntervention = useMemo(() =>
    selectedPackage && selectedIntervention && selectedPatient && selectedProvider && total > 0,
    [selectedPackage, selectedIntervention, selectedPatient, selectedProvider, total]
  );

  const canRunTests = useMemo(() =>
    !isRunning && selectedPatient && selectedProvider && complexCases.length > 0,
    [isRunning, selectedPatient, selectedProvider, complexCases.length]
  );

  useEffect(() => {
    const fetchPackageIds = async () => {
      try {
        const pck = await getPackagesByIsPreauth(1);
        const packageIds = Array.isArray(pck)
          ? pck.map(pkg => pkg.id?.toString() ?? "").filter(Boolean)
          : [];
        setPackageIds(packageIds);
      } catch (error) {
        console.error("Error fetching packages:", error);
        toast.error("Failed to load packages");
      }
    };
    fetchPackageIds();
  }, []);

  useEffect(() => {
    setShowApproved(!!(selectedPackage && packageIds.includes(selectedPackage)));
  }, [packageIds, selectedPackage]);

  const isPerdiem = useMemo(() =>
    PER_DIEM_CODES.has(selectedIntervention),
    [selectedIntervention]
  );

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

  useEffect(() => {
    if (!selectedPackage) {
      setAvailableInterventions([]);
      return;
    }

    const fetchInterventions = async () => {
      try {
        const interventions = await getInterventionByPackageId(Number(selectedPackage));
        const interventionsArray = Array.isArray(interventions)
          ? interventions
          : interventions
            ? [interventions]
            : [];
        setAvailableInterventions(interventionsArray);
        if (interventionsArray.length > 0) {
          setSelectedIntervention(interventionsArray[0].code);
        }
      } catch (error) {
        console.error("Error fetching interventions:", error);
        toast.error("Failed to load interventions");
      }
    };
    fetchInterventions();
  }, [selectedPackage]);

  const addIntervention = useCallback(() => {
    if (!canAddIntervention || !selectedPatient || !selectedProvider) {
      toast.error("Please select a package, intervention, patient, and provider");
      return;
    }

    const interventionName = availableInterventions.find(
      i => i.code === selectedIntervention
    )?.name || "";

    const formDataId = `complex-case-${uuidv4()}`;

    // Only include approvedAmount in the payload if showApproved is true
    const formData: any = {
      title: `Test for ${selectedIntervention}`,
      test: "complex",
      patient: selectedPatient,
      provider: selectedProvider,
      use: showApproved ? "preauth-claim" : "claim",
      claimSubType: "ip",
      practitioner: selectedPractitioner || undefined,
      productOrService: [{
        code: selectedIntervention,
        display: interventionName,
        quantity: { value: '1' },
        unitPrice: {
          value: isPerdiem ? Number(currentIntervention.unitPrice) * Number(currentIntervention.days) : Number(currentIntervention.unitPrice),
          currency: "KES",
        },
        net: {
          value: currentNetValue,
          currency: "KES",
        },
        servicePeriod: {
          start: currentIntervention.serviceStart,
          end: currentIntervention.serviceEnd,
        },
        sequence: 1,
      }],
      billablePeriod: {
        billableStart: selectedDates.billableStart ? format(selectedDates.billableStart, "yyyy-MM-dd") : "",
        billableEnd: selectedDates.billableEnd ? format(selectedDates.billableEnd, "yyyy-MM-dd") : "",
        created: format(selectedDates.created, "yyyy-MM-dd"),
      },
      total: { value: total, currency: "KES" },
    };

    // Conditionally add approvedAmount
    if (showApproved) {
      formData.approvedAmount = approvedAmount;
    }

    const newIntervention: ComplexCase = {
      id: formDataId,
      formData,
      netValue: currentNetValue,
      status: "pending"
    };

    setComplexCases(prev => [...prev, newIntervention]);

    // Reset current intervention but keep service dates for continuity
    setCurrentIntervention(prev => ({
      days: prev.days,
      unitPrice: "10000",
      serviceStart: prev.serviceStart,
      serviceEnd: prev.serviceEnd,
    }));
  }, [
    canAddIntervention, availableInterventions, selectedIntervention,
    selectedPatient, selectedProvider, selectedPractitioner, showApproved,
    approvedAmount, isPerdiem, currentIntervention, currentNetValue,
    selectedDates, total
  ]);

  const removeIntervention = useCallback((id: string) => {
    setComplexCases(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateCaseStatus = useCallback((id: string, status: string) => {
    setComplexCases(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status } : item
      )
    );
  }, []);

  const handleRunTests = useCallback(async () => {
    if (!canRunTests || !onRunTests) {
      toast.error("Please select all required fields and add at least one intervention");
      return;
    }

    setComplexCases(prev =>
      prev.map(item => ({ ...item, status: "pending" }))
    );

    setCurrentTestIndex(0);

    for (let i = 0; i < complexCases.length; i++) {
      setCurrentTestIndex(i);
      updateCaseStatus(complexCases[i].id, "running");

      try {
        const testPayload: TestCase = {
          formData: {
            ...complexCases[i].formData
          }
        };

        console.log(`Running test ${i + 1}/${complexCases.length}`, testPayload);
        await onRunTests(testPayload);
        updateCaseStatus(complexCases[i].id, "completed");

        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error running test ${i + 1}:`, error);
        updateCaseStatus(complexCases[i].id, "failed");
      }
    }

    setCurrentTestIndex(-1);
    toast.success("All tests completed");
  }, [canRunTests, complexCases, onRunTests, updateCaseStatus]);

  const handleRunSingleTest = useCallback(async (caseId: string) => {
    const testCase = complexCases.find(c => c.id === caseId);
    if (!testCase || !onRunTests) return;

    updateCaseStatus(caseId, "running");

    try {
      const testPayload: TestCase = {
        formData: {
          ...testCase.formData
        }
      };

      console.log("Running single test", testPayload);
      await onRunTests(testPayload);
      updateCaseStatus(caseId, "completed");
      toast.success("Test completed successfully");
    } catch (error) {
      console.error("Error running test:", error);
      updateCaseStatus(caseId, "failed");
      toast.error("Test failed");
    }
  }, [complexCases, onRunTests, updateCaseStatus]);

  const handleApprovedAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setApprovedAmount(isNaN(value) ? 0 : value);
    setIsApprovedAmountManuallyChanged(true);
  }, []);

  const handleTotalChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setTotal(newValue);
    setIsTotalManuallyChanged(true);
  }, []);

  const renderDateField = (key: keyof DateFields, isCreated = false) => (
    <div key={key} className="flex flex-col gap-3">
      <Label htmlFor={key}>{DATE_FIELD_LABELS[key]}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-start text-left font-normal"
            disabled={isCreated}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDates[key] ? format(selectedDates[key] as Date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0 z-50">
          <Calendar
            className="text-blue-500"
            mode="single"
            selected={selectedDates[key] as Date}
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

  const renderInterventionField = ({ label, key, disabled }: typeof INTERVENTION_FIELDS[0]) => (
    <div key={key}>
      <Label className="py-3">{label}</Label>
      <Input
        type="number"
        className={cn(
          "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
          disabled && "bg-gray-100"
        )}
        value={key === "netValue" ? currentNetValue : currentIntervention[key as keyof CurrentIntervention]}
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
  );

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "running":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Running</span>;
      case "completed":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>;
      case "failed":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Failed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Pending</span>;
    }
  };

  const tableHeaders = useMemo(() => getTableHeaders(showApproved), [showApproved]);

  return (
    <div className="mx-auto px-4 py-8 text-gray-500">
      <h1 className="text-2xl font-bold mb-6">Custom complex claim form</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Package Selector */}
          <div className="space-y-2">
            <Label htmlFor="package">Package</Label>
            <Select value={selectedPackage} onValueChange={setSelectedPackage}>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.keys(selectedDates).map((key) =>
            renderDateField(key as keyof DateFields, key === "created")
          )}
        </div>

        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {INTERVENTION_FIELDS.map(renderInterventionField)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {["serviceStart", "serviceEnd"].map((key) => {
              const label = key === "serviceStart" ? "Service Start Date" : "Service End Date";
              const dateValue = currentIntervention[key as keyof CurrentIntervention]
                ? new Date(currentIntervention[key as keyof CurrentIntervention])
                : undefined;

              return (
                <div key={key} className="flex flex-col gap-2">
                  <Label>{label}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateValue ? format(dateValue, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        className="text-blue-500"
                        selected={dateValue}
                        onSelect={(date) => setCurrentIntervention(prev => ({
                          ...prev,
                          [key]: date ? format(date, "yyyy-MM-dd") : "",
                        }))}
                        captionLayout="dropdown"
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label className="py-3">{showApproved ? "Pre-auth amount" : "Total"}</Label>
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
              {showApproved && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Label className="py-3">Claimed amount</Label>
                    {isApprovedAmountManuallyChanged && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleResetApprovedAmount}
                        className="text-xs text-blue-500 hover:text-blue-700"
                      >
                        Reset to calculated
                      </Button>
                    )}
                  </div>
                  <Input
                    type="number"
                    className="block w-full bg-green-300 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={approvedAmount.toFixed(2)}
                    onChange={handleApprovedAmountChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-end py-4">
          <Button
            onClick={addIntervention}
            disabled={!canAddIntervention}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add
          </Button>
        </div>

        {complexCases.length > 0 && (
          <div className="mb-6 py-4 border-t pt-4">
            <h3 className="text-lg font-bold mb-2 text-green-500">Added cases ({complexCases.length})</h3>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <Table className="min-w-full">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    {tableHeaders.map((header) => (
                      <TableHead
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {complexCases.map((intervention, index) => (
                    <TableRow key={intervention.id} className={currentTestIndex === index ? "bg-blue-50" : ""}>
                      <TableCell className="px-6 py-4 text-sm">{intervention.formData.productOrService[0]?.code}</TableCell>
                      <TableCell className="px-6 py-4 text-sm">{intervention.formData.title}</TableCell>
                      <TableCell className="px-6 py-4 text-sm">{intervention.formData.total.value.toFixed(2)}</TableCell>
                      {showApproved && (
                        <TableCell className="px-6 py-4 text-sm">
                          {intervention.formData.approvedAmount?.toFixed(2)}
                        </TableCell>
                      )}
                      <TableCell className="px-6 py-4 text-sm">
                        {getStatusBadge(intervention.status)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            onClick={() => handleRunSingleTest(intervention.id)}
                            disabled={intervention.status === "running"}
                            className="text-blue-500 hover:text-blue-900"
                          >
                            <PlayIcon className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => removeIntervention(intervention.id)}
                            className="text-red-500 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <div className="flex justify-between w-full pt-4">
          <Button
            onClick={handleRunTests}
            disabled={!canRunTests}
            className={cn(
              "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white",
              canRunTests
                ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                : "bg-gray-400 cursor-not-allowed"
            )}
          >
            {isRunning ? (
              <>
                <StopIcon className="-ml-1 mr-2 h-5 w-5" />
                Running Tests... ({currentTestIndex + 1}/{complexCases.length})
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
    </div>
  );
}