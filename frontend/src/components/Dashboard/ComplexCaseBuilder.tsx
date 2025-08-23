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
} from "@/lib/api"
import {
  ComplexCase,
  Intervention,
  Package,
} from "@/lib/types"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns/format"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { v4 as uuidv4 } from 'uuid'

type ComplexCaseBuilderProps = {
  isRunning?: boolean
  onRunTests?: (testConfig: any) => void
}

interface DateFields {
  billableStart: Date | undefined
  billableEnd: Date | undefined
  created: Date
}

interface CurrentIntervention {
  serviceQuantity: string
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
  { label: "Service quantity", key: "serviceQuantity", disabled: false },
  { label: "Unit price", key: "unitPrice", disabled: false },
  { label: "Net value", key: "netValue", disabled: true }
];

const TABLE_HEADERS = [
  "Intervention",
  "Test",
  "Pre-auth amount",
  "Claimed amount",
  "Status",
  "Actions"
];

export default function ComplexCaseBuilder({
  isRunning = false,
  onRunTests,
}: ComplexCaseBuilderProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [selectedPractitioner, setSelectedPractitioner] = useState<any>(null);
  const [selectedIntervention, setSelectedIntervention] = useState<string>("");
  const [approvedAmount, setApprovedAmount] = useState<number>(500);
  const [currentTestIndex, setCurrentTestIndex] = useState<number>(0);
  
  const today = new Date();
  const twoDays = new Date(today);
  twoDays.setDate(today.getDate() - 2);

  const [selectedDates, setSelectedDates] = useState<DateFields>({
    billableStart: twoDays,
    billableEnd: today,
    created: today,
  });

  const [packages, setPackages] = useState<Package[]>([]);
  const [complexCases, setComplexCases] = useState<ComplexCase[]>([]);
  const [availableInterventions, setAvailableInterventions] = useState<Intervention[]>([]);

  const [currentIntervention, setCurrentIntervention] = useState<CurrentIntervention>({
    serviceQuantity: "1",
    unitPrice: "10000",
    serviceStart: format(twoDays, "yyyy-MM-dd"),
    serviceEnd: format(today, "yyyy-MM-dd"),
  });

  const currentNetValue = useMemo(() => 
    Number(currentIntervention.serviceQuantity) * Number(currentIntervention.unitPrice) || 0,
    [currentIntervention.serviceQuantity, currentIntervention.unitPrice]
  );

  const [total, setTotal] = useState<number>(currentNetValue);

  const canAddIntervention = useMemo(() => 
    selectedPackage && selectedIntervention && selectedPatient && selectedProvider && total && approvedAmount,
    [selectedPackage, selectedIntervention, selectedPatient, selectedProvider, total, approvedAmount]
  );

  const canRunTests = useMemo(() => 
    !isRunning && selectedPatient && selectedProvider && complexCases.length > 0,
    [isRunning, selectedPatient, selectedProvider, complexCases.length]
  );

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const pck = await getPackages();
        setPackages(pck);
        if (pck.length > 0) {
          setSelectedPackage(pck[0].id);
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
        const interventions = await getInterventionByPackageId(selectedPackage);
        setAvailableInterventions(interventions || []);
        if (interventions?.length > 0) {
          setSelectedIntervention(interventions[0].code);
        }
      } catch (error) {
        console.error("Error fetching interventions:", error);
        toast.error("Failed to load interventions");
      }
    };
    fetchInterventions();
  }, [selectedPackage]);

  const addIntervention = useCallback(() => {
    if (!canAddIntervention) {
      toast.error("Please select a package and intervention");
      return;
    }

    const interventionName = availableInterventions.find(
      i => i.code === selectedIntervention
    )?.name || "";

    const formDataId = `complex-case-${uuidv4()}`;

    const newIntervention: ComplexCase = {
      id: formDataId,
      formData: {
        title: `Test for ${selectedIntervention}`,
        test: "complex",
        patient: selectedPatient,
        provider: selectedProvider,
        use: "preauth-claim",
        claimSubType: "ip",
        practitioner: selectedPractitioner,
        approvedAmount: approvedAmount,
        productOrService: [{
          code: selectedIntervention,
          display: interventionName,
          quantity: { value: currentIntervention.serviceQuantity },
          unitPrice: {
            value: currentIntervention.unitPrice,
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
      },
      netValue: currentNetValue,
      status: "pending"
    };

    setComplexCases(prev => [...prev, newIntervention]);
    setCurrentIntervention({
      serviceQuantity: "1",
      unitPrice: "10000",
      serviceStart: format(twoDays, "yyyy-MM-dd"),
      serviceEnd: format(today, "yyyy-MM-dd"),
    });
  }, [canAddIntervention, availableInterventions, selectedIntervention, selectedPatient, selectedProvider, selectedPractitioner, currentIntervention, currentNetValue, selectedDates, total]);

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
    if (!canRunTests) {
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
        const testPayload = {
          formData: {
            ...complexCases[i].formData,
            submissionDate: new Date().toISOString(),
          }
        };
        
        console.log(`Running test ${i+1}/${complexCases.length}`, testPayload);
        
        if (onRunTests) {
          await onRunTests(testPayload);
        }
        
        updateCaseStatus(complexCases[i].id, "completed");
        
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error running test ${i+1}:`, error);
        updateCaseStatus(complexCases[i].id, "failed");
      }
    }
    
    setCurrentTestIndex(-1);
    toast.success("All tests completed");
  }, [canRunTests, complexCases, onRunTests, updateCaseStatus]);

  const handleRunSingleTest = useCallback(async (caseId: string) => {
    const testCase = complexCases.find(c => c.id === caseId);
    if (!testCase) return;
    
    updateCaseStatus(caseId, "running");
    
    try {
      const testPayload = {
        formData: {
          ...testCase.formData,
          submissionDate: new Date().toISOString(),
        }
      };
      
      console.log("Running single test", testPayload);
      
      if (onRunTests) {
        await onRunTests(testPayload);
      }
      
      updateCaseStatus(caseId, "completed");
      toast.success("Test completed successfully");
    } catch (error) {
      console.error("Error running test:", error);
      updateCaseStatus(caseId, "failed");
      toast.error("Test failed");
    }
  }, [complexCases, onRunTests, updateCaseStatus]);

  const handleTotalChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTotal(parseFloat(e.target.value) || 0);
  }, []);

  const handleApprovedAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setApprovedAmount(parseFloat(e.target.value) || 0);
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
        onChange={(e) => !disabled && setCurrentIntervention(prev => ({
          ...prev,
          [key]: e.target.value,
        }))}
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
                  <SelectItem key={pkg.id} value={pkg.id}>
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
                <Label className="py-3">Total</Label>
                <Input
                  type="number"
                  className="block w-full px-3 py-2 bg-green-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={total.toFixed(2)}
                  onChange={handleTotalChange}
                  step={0.01}
                />
              </div>
              <div>
                <Label className="py-3">Approved amount</Label>
                <Input
                  type="number"
                  className="block w-full bg-green-300 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={approvedAmount.toFixed(2)}
                  onChange={handleApprovedAmountChange}
                  step={0.01}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-end py-4">
          <Button
            onClick={addIntervention}
            disabled={!canAddIntervention}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5 mr-2"/>
            Add
          </Button>
        </div>

        {complexCases.length > 0 && (
          <div className="mb-6 py-4 border-t pt-4 ">
            <h3 className="text-lg font-bold mb-2 text-green-500">Added cases</h3>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md p-6">
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    {TABLE_HEADERS.map((header) => (
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
                      <TableCell className="px-6 py-4 text-sm">{intervention.formData.productOrService[0].code}</TableCell>
                      <TableCell className="px-6 py-4 text-sm">{intervention.formData.title}</TableCell>
                      <TableCell className="px-6 py-4 text-sm">{intervention.formData.total.value}</TableCell>
                      <TableCell className="px-6 py-4 text-sm">{intervention.formData.approvedAmount}</TableCell>
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

        <div className="flex justify-between w-full">
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