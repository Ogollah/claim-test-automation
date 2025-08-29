'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InterventionSelector from '@/components/Dashboard/InterventionSelector';
import { Intervention, Package, Patient, Provider } from '@/lib/types';
import { getInterventionByPackageId, getPackages } from '@/lib/api';
import PatientDetailsPanel from '@/components/Dashboard/PatientDetailsPanel';
import ProviderDetailsPanel from '@/components/Dashboard/ProviderDetailsPanel';
import CustomSelector from '@/components/Dashboard/UseSelector';

interface TestcaseFormProps {
  jsonData: any;
  setJsonData: (data: any) => void;
}

interface FormData {
  title?: string;
  test?: string;
  patient?: Patient;
  provider?: Provider;
  productOrService?: Array<{
    code?: string;
    display?: string;
    quantity?: { value: string };
    unitPrice?: { value: number; currency: string };
    net?: { value: number; currency: string };
    servicePeriod?: { start: string; end: string };
  }>;
  billablePeriod?: {
    billableStart?: string;
    billableEnd?: string;
  };
  total?: { value: number; currency: string };
}

export default function TestcaseForm({ jsonData, setJsonData }: TestcaseFormProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [packages, setPackages] = useState<Package[]>([]);
  const [availableInterventions, setAvailableInterventions] = useState<Intervention[]>([]);
  const [selectedIntervention, setSelectedIntervention] = useState<string>("");
  const [interventionDisplay, setInterventionDisplay] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const formData: FormData = useMemo(() => jsonData?.formData || {}, [jsonData]);

  // Fetch packages on mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const pck = await getPackages();
        setPackages(pck || []);
      } catch (error) {
        console.error("Error fetching packages:", error);
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
        setAvailableInterventions(Array.isArray(intevents) ? intevents : intevents ? [intevents] : []);
        setSelectedIntervention("");
        setInterventionDisplay("");
      } catch (error) {
        console.error("Error fetching interventions:", error);
      }
    };
    fetchInterventions();
  }, [selectedPackage]);

  // Update intervention display when selected intervention changes
  useEffect(() => {
    if (selectedIntervention) {
      const intervention = availableInterventions.find(i => i.code === selectedIntervention);
      if (intervention) {
        setInterventionDisplay(intervention.name);
        updateField(['formData', 'productOrService', 0, 'code'], intervention.code);
        updateField(['formData', 'productOrService', 0, 'display'], intervention.name);
      }
    }
  }, [selectedIntervention, availableInterventions]);

  // Update patient in form data
  useEffect(() => {
    if (selectedPatient) {
      updateField(['formData', 'patient'], selectedPatient);
    }
  }, [selectedPatient]);

  // Update provider in form data
  useEffect(() => {
    if (selectedProvider) {
      updateField(['formData', 'provider'], selectedProvider);
    }
  }, [selectedProvider]);

  // Memoized updateField function
  const updateField = useCallback((path: string[], value: any) => {
    setJsonData((prevData: any) => {
      const newJson = { ...prevData };
      let current = newJson;

      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        current[key] = current[key] || {};
        current = current[key];
      }

      current[path[path.length - 1]] = value;
      return newJson;
    });
  }, [setJsonData]);

  // Memoized handlers for price and quantity changes
  const handleUnitPriceChange = useCallback((value: string) => {
    const numericValue = Number(value);
    updateField(['formData', 'productOrService', 0, 'unitPrice', 'value'], numericValue);
    updateField(['formData', 'productOrService', 0, 'net', 'value'], numericValue);
    updateField(['formData', 'total', 'value'], numericValue);
  }, [updateField]);

  const handleQuantityChange = useCallback((value: string) => {
    const quantity = Number(value);
    const unitPrice = formData.productOrService?.[0]?.unitPrice?.value || 0;
    const netValue = quantity * unitPrice;

    updateField(['formData', 'productOrService', 0, 'quantity', 'value'], quantity.toString());
    updateField(['formData', 'productOrService', 0, 'net', 'value'], netValue);
    updateField(['formData', 'total', 'value'], netValue);
  }, [formData.productOrService, updateField]);

  // Memoized form sections
  const renderPackageSelector = useMemo(() => (
    <div>
      <Label className='py-2' htmlFor="package">Package</Label>
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
  ), [selectedPackage, packages]);

  const renderInterventionSelector = useMemo(() => (
    <InterventionSelector
      packageId={selectedPackage}
      interventions={availableInterventions}
      selectedIntervention={selectedIntervention}
      onSelectIntervention={setSelectedIntervention}
    />
  ), [selectedPackage, availableInterventions, selectedIntervention]);

  const renderPatientProviderPanels = useMemo(() => (
    <>
      <PatientDetailsPanel
        patient={selectedPatient}
        onSelectPatient={setSelectedPatient}
        show={false}
      />
      <ProviderDetailsPanel
        provider={selectedProvider}
        onSelectProvider={setSelectedProvider}
        show={false}
      />
    </>
  ), [selectedPatient, selectedProvider]);

  return (
    <div className="p-3 border rounded-lg bg-gray-50 w-full md:w-full text-gray-500">
      <h2 className="text-lg font-semibold mb-4">Testcase Form</h2>

      <div className="mb-3">
        <Label className='py-2'>Title</Label>
        <Input
          value={formData.title || ''}
          onChange={(e) => updateField(['formData', 'title'], e.target.value)}
        />
      </div>

      <div className="mb-3">
        <CustomSelector
          label="Test Type"
          value={formData.test || ''}
          onChange={(value) => updateField(['formData', 'test'], value)}
          options={[
            { id: "positive", label: "Positive" },
            { id: "negative", label: "Negative" }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-gray-500">
        {renderPackageSelector}
        {renderInterventionSelector}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-gray-500">
        {renderPatientProviderPanels}
      </div>

      <div className="mb-3">
        <Label className="py-2">Patient Name</Label>
        <Input
          value={formData.patient?.name || ''}
          onChange={(e) => updateField(['formData', 'patient', 'name'], e.target.value)}
          disabled={true}
        />
      </div>

      <div className="mb-3">
        <Label className="py-2">Provider Name</Label>
        <Input
          value={formData.provider?.name || ''}
          onChange={(e) => updateField(['formData', 'provider', 'name'], e.target.value)}
          disabled={true}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        <div>
          <Label className="py-2">Product/Service Code</Label>
          <Input
            value={formData.productOrService?.[0]?.code || selectedIntervention || ''}
            readOnly
            className="bg-gray-100"
          />
        </div>
        <div>
          <Label className="py-2">Display Name</Label>
          <Input
            value={formData.productOrService?.[0]?.display || interventionDisplay || ''}
            readOnly
            className="bg-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
        <div>
          <Label className="py-2">Quantity</Label>
          <Input
            type="number"
            min="1"
            value={formData.productOrService?.[0]?.quantity?.value || '1'}
            onChange={(e) => handleQuantityChange(e.target.value)}
            disabled={true}
          />
        </div>
        <div>
          <Label className="py-2">Unit Price (KES)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.productOrService?.[0]?.unitPrice?.value || ''}
            onChange={(e) => handleUnitPriceChange(e.target.value)}
          />
        </div>
        <div>
          <Label className="py-2">Total (KES)</Label>
          <Input
            type="number"
            value={formData.total?.value || ''}
            readOnly
            className="bg-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        <div>
          <Label className="py-2">Service Start Date</Label>
          <Input
            type="date"
            value={formData.productOrService?.[0]?.servicePeriod?.start || ''}
            onChange={(e) => updateField(['formData', 'productOrService', 0, 'servicePeriod', 'start'], e.target.value)}
          />
        </div>
        <div>
          <Label className="py-2">Service End Date</Label>
          <Input
            className='bg-gray-100'
            type="date"
            value={formData.productOrService?.[0]?.servicePeriod?.end || ''}
            onChange={(e) => updateField(['formData', 'productOrService', 0, 'servicePeriod', 'end'], e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        <div>
          <Label className="py-2">Billable Start Date</Label>
          <Input
            type="date"
            value={formData.billablePeriod?.billableStart || ''}
            onChange={(e) => updateField(['formData', 'billablePeriod', 'billableStart'], e.target.value)}
          />
        </div>
        <div>
          <Label className="py-2">Billable End Date</Label>
          <Input
            type="date"
            value={formData.billablePeriod?.billableEnd || ''}
            onChange={(e) => updateField(['formData', 'billablePeriod', 'billableEnd'], e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}