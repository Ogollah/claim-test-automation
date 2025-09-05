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
import { Button } from '@/components/ui/button';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { PER_DIEM_CODES } from '@/lib/utils';

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
    code: string;
    display?: string;
    quantity?: { value: string };
    unitPrice?: { value: number; currency: string };
    net?: { value: number; currency: string };
    servicePeriod?: { start: string; end: string };
    sequence?: number;
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
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([]);
  const [interventionDisplays, setInterventionDisplays] = useState<string[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const formData: FormData = useMemo(() => jsonData?.formData || {}, [jsonData]);
  const productOrServices = formData.productOrService || [];

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

  // Initialize selected interventions from form data
  useEffect(() => {
    if (productOrServices.length > 0) {
      const codes = productOrServices.map(item => item.code || "");
      setSelectedInterventions(codes);

      const displays = productOrServices.map(item => item.display || "");
      setInterventionDisplays(displays);
    }
  }, [productOrServices.length]);

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
      } catch (error) {
        console.error("Error fetching interventions:", error);
      }
    };
    fetchInterventions();
  }, [selectedPackage]);

  useEffect(() => {
    if (selectedPatient) {
      updateField(['formData', 'patient'], selectedPatient);
    }
  }, [selectedPatient]);

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

  const calculateDays = useCallback((start: string, end: string): number => {
    if (!start || !end) return 1;

    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 1;
  }, []);

  // Calculate net value for an item
  const calculateNetValue = useCallback((item: any, index: number): number => {
    const isPerdiem = PER_DIEM_CODES.has(selectedInterventions[index]);
    const unitPrice = item.unitPrice?.value;

    if (isPerdiem && item.servicePeriod?.start && item.servicePeriod?.end) {
      const days = calculateDays(item.servicePeriod.start, item.servicePeriod.end);
      return days * unitPrice;
    }

    return unitPrice;
  }, [selectedInterventions, calculateDays]);

  // Recalculate total amount
  const recalculateTotal = useCallback((items: any[]) => {
    const total = items.reduce((sum, item) => sum + (item.net?.value || 0), 0);
    updateField(['formData', 'total', 'value'], total);
    return total;
  }, [updateField]);

  // Add a new productOrService item
  const addProductOrService = useCallback(() => {
    const newItem = {
      net: { value: null, currency: "KES" },
      code: "",
      display: "",
      quantity: { value: "1" },
      sequence: productOrServices.length + 1,
      unitPrice: { value: null, currency: "KES" },
      servicePeriod: { start: "", end: "" }
    };

    updateField(['formData', 'productOrService'], [...productOrServices, newItem]);
    setSelectedInterventions(prev => [...prev, ""]);
    setInterventionDisplays(prev => [...prev, ""]);
  }, [productOrServices, updateField]);

  const removeProductOrService = useCallback((index: number) => {
    const newItems = productOrServices.filter((_, i) => i !== index);
    updateField(['formData', 'productOrService'], newItems);

    const newSelected = selectedInterventions.filter((_, i) => i !== index);
    setSelectedInterventions(newSelected);

    const newDisplays = interventionDisplays.filter((_, i) => i !== index);
    setInterventionDisplays(newDisplays);

    recalculateTotal(newItems);
  }, [productOrServices, selectedInterventions, interventionDisplays, updateField, recalculateTotal]);

  const updateProductOrService = useCallback((index: number, field: string, value: any) => {
    const newItems = [...productOrServices];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'servicePeriod' || field === 'unitPrice') {
      const netValue = calculateNetValue(newItems[index], index);
      newItems[index].net = { value: netValue, currency: "KES" };
    }

    updateField(['formData', 'productOrService'], newItems);

    if (field === 'servicePeriod' || field === 'unitPrice') {
      recalculateTotal(newItems);
    }
  }, [productOrServices, calculateNetValue, updateField, recalculateTotal]);

  // Handle intervention selection for a specific item
  const handleInterventionSelect = useCallback((index: number, code: string) => {
    const intervention = availableInterventions.find(i => i.code === code);
    if (!intervention) return;

    const newSelected = [...selectedInterventions];
    newSelected[index] = code;
    setSelectedInterventions(newSelected);

    const newDisplays = [...interventionDisplays];
    newDisplays[index] = intervention.name;
    setInterventionDisplays(newDisplays);

    const updatedItems = productOrServices.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          code: intervention.code,
          display: intervention.name
        };
      }
      return item;
    });

    updateField(['formData', 'productOrService'], updatedItems);
  }, [availableInterventions, selectedInterventions, interventionDisplays, productOrServices, updateField]);

  const handleUnitPriceChange = useCallback((index: number, value: string) => {
    const numericValue = Number(value);
    updateProductOrService(index, 'unitPrice', { value: numericValue, currency: "KES" });
  }, [updateProductOrService]);

  const handleServiceDateChange = useCallback((index: number, field: 'start' | 'end', value: string) => {
    const currentPeriod = productOrServices[index]?.servicePeriod || { start: "", end: "" };
    updateProductOrService(index, 'servicePeriod', {
      ...currentPeriod,
      [field]: value
    });
  }, [productOrServices, updateProductOrService]);

  const getDaysForDisplay = useCallback((index: number) => {
    const item = productOrServices[index];
    if (!item) return 1;

    const isPerdiem = PER_DIEM_CODES.has(selectedInterventions[index]);
    if (isPerdiem && item.servicePeriod?.start && item.servicePeriod?.end) {
      return calculateDays(item.servicePeriod.start, item.servicePeriod.end);
    }

    return 1;
  }, [productOrServices, selectedInterventions, calculateDays]);


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
        {renderPatientProviderPanels}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-gray-500">
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
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <Label className="py-2">Product/Service Items</Label>
          <Button onClick={addProductOrService} size="sm" className="flex items-center gap-1 bg-blue-500 text-white cursor-pointer hover:bg-blue-600">
            <PlusIcon className="h-4 w-4" />
            Add service item
          </Button>
        </div>

        {/* Package selector moved outside the items loop */}
        <div className="text-sm text-gray-500 mb-4">
          {renderPackageSelector}
        </div>

        {productOrServices.map((item, index) => {
          const days = getDaysForDisplay(index);

          return (
            <div key={index} className="border rounded-md p-4 mb-4 bg-white relative">
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 cursor-pointer"
                onClick={() => removeProductOrService(index)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <Label className="py-2">Intervention Code</Label>
                  <Select
                    value={selectedInterventions[index] || ""}
                    onValueChange={(value) => handleInterventionSelect(index, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an intervention" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableInterventions.map((intervention) => (
                        <SelectItem key={intervention.code} value={intervention.code}>
                          {intervention.code} - {intervention.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="py-2">Display Name</Label>
                  <Input
                    value={item.display || interventionDisplays[index] || ''}
                    onChange={(e) => updateProductOrService(index, 'display', e.target.value)}
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <Label className="py-2">Days</Label>
                  <Input
                    type="number"
                    value={days}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <Label className="py-2">Unit Price (KES)</Label>
                  <Input
                    type="number"
                    value={item.unitPrice?.value}
                    onChange={(e) => handleUnitPriceChange(index, e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label className="py-2">Net Amount (KES)</Label>
                  <Input
                    type="number"
                    value={item.net?.value || 0}
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
                    value={item.servicePeriod?.start || ''}
                    onChange={(e) => handleServiceDateChange(index, 'start', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="py-2">Service End Date</Label>
                  <Input
                    type="date"
                    value={item.servicePeriod?.end || ''}
                    onChange={(e) => handleServiceDateChange(index, 'end', e.target.value)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
        <div className="col-span-2">
          <Label className="py-2">Total Amount (KES)</Label>
          <Input
            type="number"
            value={formData.total?.value || 0}
            readOnly
            className="bg-gray-100 font-bold"
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