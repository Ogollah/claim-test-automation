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

import { usePackages } from '@/hook/usePackages';
import { useInterventions } from '@/hook/useInterventions';
import { useDateFields } from '@/hook/useDateFields';
import { useCurrentIntervention } from '@/hook/useCurrentIntervention';
import { useManualTotal } from '@/hook/useManualTotal';
import { useFormValidation } from '@/hook/useFormValidation';

import PatientDetailsPanel from "./PatientDetailsPanel";
import ProviderDetailsPanel from "./ProviderDetailsPanel";
import InterventionSelector from "./InterventionSelector";
import PractitionerDetailsPanel from "./PractitionerDetailsPanel";
import CustomSelector from "./UseSelector";
import { InterventionItem, Provider, Practitioner } from "@/lib/types";
import { DateFieldRenderer } from "./DateFieldRenderer";
import { Switch } from "../ui/switch";

type TestRunnerProps = {
  isRunning?: boolean;
  onRunTests?: (testConfig: any) => void;
};

export default function OptimizedTestRunner({
  isRunning = false,
  onRunTests,
}: TestRunnerProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [selectedUse, setSelectedUse] = useState<string>("claim");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedPractitioner, setSelectedPractitioner] = useState<Practitioner | null>(null);
  const [selectedClaimSubType, setClaimSubType] = useState<string>("ip");
  const [isDev, setIsDev] = useState<boolean>();
  const [isBundleOnly, setIsBundleOnly] = useState<boolean>();
  const [relatedClaimId, setRelatedClaimId] = useState("");
  const [interventions, setInterventions] = useState<InterventionItem[]>([]);

  const { packages } = usePackages();
  const { interventions: availableInterventions, selectedIntervention, setSelectedIntervention } = useInterventions(selectedPackage);
  const { dates, updateDate, today, twoDaysAgo } = useDateFields();
  const { intervention, updateIntervention, isPerdiem, netValue } = useCurrentIntervention(
    selectedIntervention, twoDaysAgo, today
  );

  const calculatedTotal = useMemo(() =>
    interventions.reduce((sum, item) => sum + item.netValue, 0),
    [interventions]
  );

  const { total, isManuallyChanged, handleTotalChange, resetTotal } = useManualTotal(calculatedTotal);

  const { canAddIntervention, canRunTests } = useFormValidation({
    selectedPackage,
    selectedIntervention,
    selectedPatient,
    selectedProvider,
    itemsCount: interventions.length,
    total: calculatedTotal
  });

  useState(() => {
    if (packages.length > 0) {
      setSelectedPackage(String(packages[0].id));
    }
  });

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
      days: intervention.days,
      unitPrice: intervention.unitPrice,
      serviceStart: intervention.serviceStart,
      serviceEnd: intervention.serviceEnd,
      netValue: netValue,
      serviceQuantity: "1",
    };

    setInterventions(prev => [...prev, newIntervention]);

    // Reset intervention form but keep service dates
    updateIntervention('days', "1");
    updateIntervention('unitPrice', "10000");
  }, [selectedPackage, selectedIntervention, availableInterventions, intervention, netValue, updateIntervention]);

  const removeIntervention = useCallback((id: string) => {
    setInterventions(prev => prev.filter(item => item.id !== id));
  }, []);

  const buildTestPayload = useCallback(() => ({
    formData: {
      title: `Test for ${selectedIntervention}`,
      test: "build",
      is_bundle_only: isBundleOnly,
      is_dev: isDev,
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
          value: isPerdiem
            ? Number(intervention.unitPrice) * Number(intervention.days)
            : intervention.unitPrice,
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
        billableStart: dates.billableStart ? format(dates.billableStart, "yyyy-MM-dd") : "",
        billableEnd: dates.billableEnd ? format(dates.billableEnd, "yyyy-MM-dd") : "",
        created: format(dates.created, "yyyy-MM-dd"),
      },
      total: { value: total, currency: "KES" },
    },
  }), [
    selectedIntervention, selectedPatient, selectedProvider, selectedUse,
    selectedClaimSubType, selectedPractitioner, relatedClaimId, interventions,
    isPerdiem, dates, total, isBundleOnly, isDev
  ]);

  const handleRunTests = useCallback(() => {
    if (!selectedPatient || !selectedProvider || interventions.length === 0) {
      toast.error("Please select all required fields and add at least one intervention");
      return;
    }

    const testConfig = buildTestPayload();
    onRunTests?.(testConfig);
  }, [selectedPatient, selectedProvider, interventions.length, buildTestPayload, onRunTests]);

  const TABLE_HEADERS = [
    "Package", "Intervention", "Quantity", "Unit Price",
    "Net Value", "Service Period", "Actions"
  ];

  const INTERVENTION_FIELDS = [
    { label: "Days", key: "days", disabled: true },
    { label: "Unit price", key: "unitPrice", disabled: false },
    { label: "Net value", key: "netValue", disabled: true }
  ];

  console.log('selected is_bundle:', isBundleOnly);


  return (
    <div className="mx-auto py-4 text-gray-500">
      <h1 className="text-2xl font-bold text-gray-500 mb-6">
        Custom test claim form
      </h1>

      <div className="bg-white rounded-sm shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Switch
              className="bg-red-700"
              id="isBundleOnly"
              checked={isBundleOnly}
              onCheckedChange={(checked: boolean) => {
                setIsBundleOnly(checked);
                if (!isBundleOnly) {
                  setIsDev(false);
                }
              }}
            />
            <Label htmlFor="isBundleOnly">Build bundle only</Label>
          </div>
          {isBundleOnly && (
            <CustomSelector
              options={[
                { id: "true", label: "Dev" },
                { id: "false", label: "QA" }
              ]}
              value={String(isDev)}
              onChange={(val) => setIsDev(val === "true")}
              label="Select environment"
              placeholder="Choose environment"
            />
          )}
        </div>

        {/* Use and Claim Type Selection */}
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

        {/* Package and Intervention Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-gray-500">
          <div className="space-y-2">
            <Label htmlFor="package">Package</Label>
            <Select value={selectedPackage || ""} onValueChange={setSelectedPackage}>
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

        {/* Date Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-gray-500">
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

        {/* Add Intervention Section */}
        <div className="border-t border-gray-200 pt-4 mb-6 text-gray-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {INTERVENTION_FIELDS.map(({ label, key, disabled }) => (
              <div key={key}>
                <Label className="py-3">{label}</Label>
                <Input
                  type="number"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

          {/* Service Dates and Add Button */}
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
                      <TableCell className="px-6 py-4 text-sm text-gray-500">
                        {intervention.packageId}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-500">
                        {intervention.code}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-500">
                        {intervention.serviceQuantity}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-500">
                        {intervention.unitPrice}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-500">
                        {intervention.netValue}
                      </TableCell>
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

        {/* Total and Run Tests */}
        <div className="flex justify-between w-full">
          <div className="text-gray-500">
            <div className="flex items-center gap-2 mb-1">
              <Label className="py-3">Total</Label>
              {isManuallyChanged && (
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
                {isBundleOnly ? 'Generating bundle ...' : 'Running Tests...'}

              </>
            ) : (
              <>
                <PlayIcon className="-ml-1 mr-2 h-5 w-5" />
                {isBundleOnly ? 'Generate bundle' : 'Run Test'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}