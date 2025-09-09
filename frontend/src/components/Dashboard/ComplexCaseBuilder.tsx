import { useState, useCallback, useMemo } from "react";
import { StopIcon, PlayIcon, TrashIcon } from "@heroicons/react/16/solid";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { format } from "date-fns/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

import { usePackages } from '@/hook/usePackages';
import { useInterventions } from '@/hook/useInterventions';
import { useDateFields } from '@/hook/useDateFields';
import { useCurrentIntervention } from '@/hook/useCurrentIntervention';
import { useManualTotal } from '@/hook/useManualTotal';
import { useFormValidation } from '@/hook/useFormValidation';
import { useTestExecution } from '@/hook/useTestExecution';

import PatientDetailsPanel from "./PatientDetailsPanel";
import ProviderDetailsPanel from "./ProviderDetailsPanel";
import InterventionSelector from "./InterventionSelector";
import PractitionerDetailsPanel from "./PractitionerDetailsPanel";
import { ComplexCase, Patient, Provider, Practitioner, TestCase } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DateFieldRenderer } from "./DateFieldRenderer";
import { StatusBadge } from './StatusBadge';

type ComplexCaseBuilderProps = {
  isRunning?: boolean;
  onRunTests?: (testConfig: TestCase) => void;
}

export default function OptimizedComplexCaseBuilder({
  isRunning = false,
  onRunTests,
}: ComplexCaseBuilderProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedPractitioner, setSelectedPractitioner] = useState<Practitioner | null>(null);
  const [complexCases, setComplexCases] = useState<ComplexCase[]>([]);

  const allowedCodes = ['SHA-03', 'SHA-08', 'SHA-05', 'SHA-13', 'SHA-19', 'SHA-06'];
  const { packages, packageIds } = usePackages(allowedCodes);
  const { interventions, selectedIntervention, setSelectedIntervention } = useInterventions(selectedPackage);
  const { dates, updateDate, today, twoDaysAgo } = useDateFields();
  const { intervention, updateIntervention, resetIntervention, isPerdiem, netValue } = useCurrentIntervention(
    selectedIntervention, twoDaysAgo, today
  );

  const { total: totalAmount, isManuallyChanged: isTotalManuallyChanged, handleTotalChange, resetTotal } = useManualTotal(netValue);
  const { total: approvedAmount, isManuallyChanged: isApprovedAmountManuallyChanged, handleTotalChange: handleApprovedAmountChange, resetTotal: resetApprovedAmount } = useManualTotal(netValue);

  const { canAddIntervention, canRunTests } = useFormValidation({
    selectedPackage,
    selectedIntervention,
    selectedPatient,
    selectedProvider,
    itemsCount: complexCases.length,
    total: totalAmount
  });

  const showApproved = useMemo(() =>
    !!(selectedPackage && packageIds.includes(selectedPackage)),
    [selectedPackage, packageIds]
  );

  // Complex case management
  const updateCaseStatus = useCallback((id: string, status: string) => {
    setComplexCases(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status } : item
      )
    );
  }, []);

  const removeCase = useCallback((id: string) => {
    setComplexCases(prev => prev.filter(item => item.id !== id));
  }, []);

  const buildTestPayload = useCallback((complexCase: ComplexCase) => ({
    formData: {
      ...complexCase.formData
    }
  }), []);

  const { currentTestIndex, runAllTests, runSingleTest } = useTestExecution(
    complexCases,
    updateCaseStatus,
    onRunTests
  );

  const addIntervention = useCallback(() => {
    if (!canAddIntervention || !selectedPatient || !selectedProvider) {
      toast.error("Please select a package, intervention, patient, and provider");
      return;
    }

    const interventionName = interventions.find(
      i => i.code === selectedIntervention
    )?.name || "";

    const formDataId = `complex-case-${uuidv4()}`;

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
          value: isPerdiem
            ? Number(intervention.unitPrice) * Number(intervention.days)
            : Number(intervention.unitPrice),
          currency: "KES",
        },
        net: {
          value: netValue,
          currency: "KES",
        },
        servicePeriod: {
          start: intervention.serviceStart,
          end: intervention.serviceEnd,
        },
        sequence: 1,
      }],
      billablePeriod: {
        billableStart: dates.billableStart ? format(dates.billableStart, "yyyy-MM-dd") : "",
        billableEnd: dates.billableEnd ? format(dates.billableEnd, "yyyy-MM-dd") : "",
        created: format(dates.created, "yyyy-MM-dd"),
      },
      total: { value: totalAmount, currency: "KES" },
    };

    if (showApproved) {
      formData.approvedAmount = approvedAmount;
    }

    const newCase: ComplexCase = {
      id: formDataId,
      formData,
      netValue,
      status: "pending"
    };

    setComplexCases(prev => [...prev, newCase]);
    resetIntervention();
  }, [
    canAddIntervention, interventions, selectedIntervention, selectedPatient,
    selectedProvider, selectedPractitioner, showApproved, approvedAmount,
    isPerdiem, intervention, netValue, dates, totalAmount, resetIntervention
  ]);

  const handleRunTests = useCallback(() => {
    if (!canRunTests) {
      toast.error("Please select all required fields and add at least one intervention");
      return;
    }
    runAllTests(buildTestPayload);
  }, [canRunTests, runAllTests, buildTestPayload]);

  const handleRunSingleTest = useCallback((caseId: string) => {
    runSingleTest(caseId, buildTestPayload);
  }, [runSingleTest, buildTestPayload]);

  const tableHeaders = useMemo(() => {
    const baseHeaders = ["Intervention", "Test", "Pre-auth amount", "Status", "Actions"];
    if (showApproved) {
      baseHeaders.splice(3, 0, "Claimed amount");
    }
    return baseHeaders;
  }, [showApproved]);

  const INTERVENTION_FIELDS = [
    { label: "Days", key: "days", disabled: true },
    { label: "Unit price", key: "unitPrice", disabled: false },
    { label: "Net value", key: "netValue", disabled: true }
  ];

  return (
    <div className="mx-auto px-4 py-8 text-gray-500">
      <h1 className="text-2xl font-bold mb-6">Custom complex claim form</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>

        {/* Package and Intervention Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
            interventions={interventions}
            selectedIntervention={selectedIntervention}
            onSelectIntervention={setSelectedIntervention}
          />
        </div>

        {/* Patient, Provider, Practitioner */}
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

        {/* Date Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <DateFieldRenderer
            label="Billable Start Date"
            date={dates.billableStart}
            onDateChange={(date) => updateDate('billableStart', date)}
          />
          <DateFieldRenderer
            label="Billable End Date"
            date={dates.billableEnd}
            onDateChange={(date) => updateDate('billableEnd', date)}
          />
          <DateFieldRenderer
            label="Created Date"
            date={dates.created}
            onDateChange={(date) => updateDate('created', date)}
            disabled={true}
          />
        </div>

        {/* Intervention Details */}
        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {INTERVENTION_FIELDS.map(({ label, key, disabled }) => (
              <div key={key}>
                <Label className="py-3">{label}</Label>
                <Input
                  type="number"
                  className={cn(
                    "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                    disabled && "bg-gray-100"
                  )}
                  value={key === "netValue" ? netValue : intervention[key as keyof typeof intervention]}
                  disabled={disabled}
                  onChange={(e) => {
                    if (!disabled) {
                      updateIntervention(key as keyof typeof intervention, e.target.value);
                    }
                  }}
                />
              </div>
            ))}
          </div>

          {/* Service Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <DateFieldRenderer
              label="Service Start Date"
              date={intervention.serviceStart ? new Date(intervention.serviceStart) : undefined}
              onDateChange={(date) =>
                updateIntervention('serviceStart', date ? format(date, "yyyy-MM-dd") : "")
              }
            />
            <DateFieldRenderer
              label="Service End Date"
              date={intervention.serviceEnd ? new Date(intervention.serviceEnd) : undefined}
              onDateChange={(date) =>
                updateIntervention('serviceEnd', date ? format(date, "yyyy-MM-dd") : "")
              }
            />
          </div>

          {/* Total and Approved Amount */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label className="py-3">{showApproved ? "Pre-auth amount" : "Total"}</Label>
                  {isTotalManuallyChanged && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetTotal}
                      className="text-xs text-blue-500 hover:text-blue-700"
                    >
                      Reset to calculated
                    </Button>
                  )}
                </div>
                <Input
                  type="number"
                  className="block w-full px-3 py-2 bg-green-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={totalAmount.toFixed(2)}
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
                        onClick={resetApprovedAmount}
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

        {/* Add Intervention Button */}
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

        {/* Complex Cases Table */}
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
                  {complexCases.map((complexCase, index) => (
                    <TableRow key={complexCase.id} className={currentTestIndex === index ? "bg-blue-50" : ""}>
                      <TableCell className="px-6 py-4 text-sm">
                        {complexCase.formData.productOrService[0]?.code}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">{complexCase.formData.title}</TableCell>
                      <TableCell className="px-6 py-4 text-sm">
                        {complexCase.formData.total.value.toFixed(2)}
                      </TableCell>
                      {showApproved && (
                        <TableCell className="px-6 py-4 text-sm">
                          {complexCase.formData.approvedAmount?.toFixed(2)}
                        </TableCell>
                      )}
                      <TableCell className="px-6 py-4 text-sm">
                        <StatusBadge status={complexCase.status} />
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            onClick={() => handleRunSingleTest(complexCase.id)}
                            disabled={complexCase.status === "running"}
                            className="text-blue-500 hover:text-blue-900"
                          >
                            <PlayIcon className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => removeCase(complexCase.id)}
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

        {/* Run Tests Button */}
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
