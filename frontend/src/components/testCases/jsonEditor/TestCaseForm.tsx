'use client';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InterventionSelector from '@/components/Dashboard/InterventionSelector';
import { Intervention, Package } from '@/lib/types';
import { getInterventionByPackageId, getPackages } from '@/lib/api';
import PatientDetailsPanel from '@/components/Dashboard/PatientDetailsPanel';
import ProviderDetailsPanel from '@/components/Dashboard/ProviderDetailsPanel';

export default function TestcaseForm({ jsonData, setJsonData }) {
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [packages, setPackages] = useState<Package[]>([]);
  const [availableInterventions, setAvailableInterventions] = useState<Intervention[]>([]);
  const [selectedIntervention, setSelectedIntervention] = useState<string>("");
  const [interventionDisplay, setInterventionDisplay] = useState<string>("");
  const formData = jsonData?.formData || {};
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const pck = await getPackages()
        setPackages(pck)
      } catch (error) {
        console.error("--> Error fetching packages:", error)
      }
    }
    fetchPackages()
  }, []);

  useEffect(() => {
    if (selectedPackage) {
      const fetchInterventions = async () => {
        try {
          const intevents = await getInterventionByPackageId(selectedPackage)
          setAvailableInterventions(intevents || [])
          setSelectedIntervention("")
          setInterventionDisplay("")
        } catch (error) {
          console.error("--> Error fetching interventions:", error)
        }
      }
      fetchInterventions()
    } else {
      setAvailableInterventions([])
    }
  }, [selectedPackage]);

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

  useEffect(() => {
    if(selectedPatient) {
        updateField(['formData', 'patient'], selectedPatient);
    }
  },[selectedPatient]);

    useEffect(() => {
    if(selectedProvider) {
        updateField(['formData', 'provider'], selectedProvider);
    }
  },[selectedProvider]);

  const updateField = (path: string[], value: any) => {
    const newJson = { ...jsonData };

    let current = newJson;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      current[key] = current[key] || {};
      current = current[key];
    }

    current[path[path.length - 1]] = value;
    setJsonData(newJson);
  };

  const handleUnitPriceChange = (value: string) => {
    const numericValue = Number(value);
    updateField(['formData', 'productOrService', 0, 'unitPrice', 'value'], numericValue);
    updateField(['formData', 'productOrService', 0, 'net', 'value'], numericValue);
    updateField(['formData', 'total', 'value'], numericValue);
  };

  const handleQuantityChange = (value: string) => {
    const quantity = Number(value);
    const unitPrice = formData.productOrService?.[0]?.unitPrice?.value || 0;
    const netValue = quantity * unitPrice;
    
    updateField(['formData', 'productOrService', 0, 'quantity', 'value'], quantity.toString());
    updateField(['formData', 'productOrService', 0, 'net', 'value'], netValue);
    updateField(['formData', 'total', 'value'], netValue);
  };

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

      <div className="mb-3 ">
        <Label className='py-2'>Test Type</Label>
        <Input
          value={formData.test || ''}
          onChange={(e) => updateField(['formData', 'test'], e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-gray-500">
        <div>
          <Label className='py-2' htmlFor="package">Package</Label>
          <Select
            value={selectedPackage || ""}
            onValueChange={(value) => setSelectedPackage(value)}
          >
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-gray-500">
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
        </div>  

      <div className="mb-3">
        <Label className="py-2">Patient Name</Label>
        <Input
          value={formData.patient?.name || ''}
          onChange={(e) => updateField(['formData', 'patient', 'name'], e.target.value)}
        />
      </div>

      <div className="mb-3">
        <Label className="py-2">Provider Name</Label>
        <Input
          value={formData.provider?.name || ''}
          onChange={(e) => updateField(['formData', 'provider', 'name'], e.target.value)}
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