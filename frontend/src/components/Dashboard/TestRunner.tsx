import { useEffect, useState } from 'react';
import { StopIcon, PlayIcon, TrashIcon } from '@heroicons/react/16/solid';
import PatientDetailsPanel from './PatientDetailsPanel';
import ProviderDetailsPanel from './ProviderDetailsPanel';
import InterventionSelector from './InterventionSelector';
import UseSelector from './UseSelector';

const TEST_PACKAGES = [
  { id: 'SHA-01', name: 'Ambulance and Emergency Services' },
  { id: 'SHA-03', name: 'Critical Care Services' },
  { id: 'SHA-05', name: 'Optical Health Services' },
];

const INTERVENTION_CODES = {
  'SHA-01': [
    { code: 'SHA-01-001', name: 'Ambulance Evacuations' },
    { code: 'SHA-01-002', name: 'Ambulance Evacuations' },
    { code: 'SHA-01-003', name: 'Cardiac/Respiratory Arrest' },
    { code: 'SHA-01-004', name: 'Major Trauma' },
    { code: 'SHA-01-005', name: 'Shock states' },
    { code: 'SHA-01-006', name: 'Altered level of consciousness' },
    { code: 'SHA-01-007', name: 'Severe respiratory distress' },
    { code: 'SHA-01-008', name: 'Seizures/Status epilepticus' },
    { code: 'SHA-01-010', name: 'Acute Cerebrovascular Accidents' },
    { code: 'SHA-01-011', name: 'Anti-Rabies' },
    { code: 'SHA-01-012', name: 'Anti-Snake Venom' },
    { code: 'SHA-01-013', name: 'Chest Pain' }
  ],
  'SHA-03': [
    { code: 'SHA-03-001', name: 'ICU Care' },
    { code: 'SHA-03-002', name: 'HDU Care' },
    { code: 'SHA-03-003', name: 'NICU Care' },
    { code: 'SHA-03-004', name: 'PICU Care' },
    { code: 'SHA-03-005', name: 'Intensive care Burns Unit' }
  ],
  'SHA-05': [
    { code: 'SHA-05-001', name: 'Consultation and prescription and issuing of glasses' },
  ],
};

export default function TestRunner({ isRunning = false, onRunTests }: TestRunnerProps) {
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedUse, setSelectedUse] = useState<any>(null);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [selectedIntervention, setSelectedIntervention] = useState('');
  const [selectedDates, setSelectedDates] = useState({
    billableStart: '',
    billableEnd: '',
    created: new Date().toISOString().split('T')[0],
  });

  const [interventions, setInterventions] = useState<InterventionItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [availableInterventions, setAvailableInterventions] = useState<any[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);

  // Current intervention form state
  const [currentIntervention, setCurrentIntervention] = useState({
    serviceQuantity: '',
    unitPrice: '',
    serviceStart: '',
    serviceEnd: '',
  });

  // Calculate net value for current intervention
  const currentNetValue = currentIntervention.serviceQuantity && currentIntervention.unitPrice
    ? Number(currentIntervention.serviceQuantity) * Number(currentIntervention.unitPrice)
    : 0;

  // Update total whenever interventions change
  useEffect(() => {
    const newTotal = interventions.reduce((sum, item) => sum + item.netValue, 0);
    setTotal(newTotal);
  }, [interventions]);

  // Update available interventions when package changes
  useEffect(() => {
    if (selectedPackage) {
      setAvailableInterventions(INTERVENTION_CODES[selectedPackage as keyof typeof INTERVENTION_CODES] || []);
      setSelectedIntervention('');
    }
  }, [selectedPackage]);

  const addIntervention = () => {
    if (!selectedPackage || !selectedIntervention) {
      alert('Please select a package and intervention');
      return;
    }

    const interventionName = availableInterventions.find(i => i.code === selectedIntervention)?.name || '';
    
    const newIntervention: InterventionItem = {
      id: `${selectedIntervention}-${Date.now()}`,
      packageId: selectedPackage,
      code: selectedIntervention,
      name: interventionName,
      serviceQuantity: currentIntervention.serviceQuantity,
      unitPrice: currentIntervention.unitPrice,
      serviceStart: currentIntervention.serviceStart,
      serviceEnd: currentIntervention.serviceEnd,
      netValue: currentNetValue,
    };

    setInterventions([...interventions, newIntervention]);
    
    // Reset current intervention form
    setCurrentIntervention({
      serviceQuantity: '',
      unitPrice: '',
      serviceStart: '',
      serviceEnd: '',
    });
  };

  const removeIntervention = (id: string) => {
    setInterventions(interventions.filter(item => item.id !== id));
  };

  const buildTestPayload = () => {
    return {
      formData: {
        patient: selectedPatient,
        provider: selectedProvider,
        use: selectedUse,
        productOrService: interventions.map((intervention, index) => ({
          code: intervention.code,
          display: intervention.name,
          quantity: { value: intervention.serviceQuantity },
          unitPrice: { value: intervention.unitPrice, currency: 'KES' },
          net: { value: intervention.netValue, currency: 'KES' },
          servicePeriod: {
            start: intervention.serviceStart,
            end: intervention.serviceEnd,
          },
          sequence: index + 1
        })),
        billablePeriod: selectedDates,
        total: { value: total, currency: 'KES' },
      }
    };
  };

  const handleRunTests = async () => {
    if (!selectedPatient || !selectedProvider || interventions.length === 0) {
      alert('Please select all required fields and add at least one intervention');
      return;
    }

    const testConfig = buildTestPayload();

    if (onRunTests) {
      onRunTests(testConfig);
      return;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Claims Test Automation</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Test Configuration</h2>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <UseSelector
            use={selectedUse}
            onSelectUse={setSelectedUse}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Package</label>
            <div className="relative">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
              >
                <option value="">Select a package</option>
                {TEST_PACKAGES.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} ({pkg.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <InterventionSelector
            packageId={selectedPackage}
            interventions={availableInterventions}
            selectedIntervention={selectedIntervention}
            onSelectIntervention={setSelectedIntervention}
          />
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <PatientDetailsPanel
            patient={selectedPatient}
            onSelectPatient={setSelectedPatient}
          />

          <ProviderDetailsPanel
            provider={selectedProvider}
            onSelectProvider={setSelectedProvider}
          />
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Billable Start Date</label>
            <input
              type="date"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedDates.billableStart}
              onChange={(e) => setSelectedDates({...selectedDates, billableStart: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Billable End Date</label>
            <input
              type="date"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedDates.billableEnd}
              onChange={(e) => setSelectedDates({...selectedDates, billableEnd: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
            <input
              type="date"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedDates.created}
              disabled
              onChange={(e) => setSelectedDates({...selectedDates, created: e.target.value})}
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-6">
          {/* <h3 className="text-lg font-medium text-gray-700 mb-4">Add Intervention</h3> */}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service quantity</label>
              <input
                type="number"
                min={0}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={currentIntervention.serviceQuantity}
                onChange={(e) => setCurrentIntervention({...currentIntervention, serviceQuantity: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit price</label>
              <input
                type="number"
                min={0}
                step={0.10}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={currentIntervention.unitPrice}
                onChange={(e) => setCurrentIntervention({...currentIntervention, unitPrice: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Net value</label>
              <input
                type="number"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={currentNetValue}
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Start Date</label>
              <input
                type="date"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={currentIntervention.serviceStart}
                onChange={(e) => setCurrentIntervention({...currentIntervention, serviceStart: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service End Date</label>
              <input
                type="date"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={currentIntervention.serviceEnd}
                onChange={(e) => setCurrentIntervention({...currentIntervention, serviceEnd: e.target.value})}
              />
            </div>
                        <div className="flex items-end">
              <button
                type="button"
                onClick={addIntervention}
                disabled={!selectedPackage || !selectedIntervention}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add Intervention
              </button>
            </div>
          </div>
        </div>

        {interventions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Selected Interventions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intervention</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Value</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Period</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {interventions.map((intervention) => (
                    <tr key={intervention.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{intervention.packageId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="font-medium">{intervention.code}</div>
                        <div>{intervention.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{intervention.serviceQuantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{intervention.unitPrice}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{intervention.netValue.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {intervention.serviceStart} to {intervention.serviceEnd}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => removeIntervention(intervention.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <PatientDetailsPanel
            patient={selectedPatient}
            onSelectPatient={setSelectedPatient}
          />

          <ProviderDetailsPanel
            provider={selectedProvider}
            onSelectProvider={setSelectedProvider}
          />
        </div>

        <div className="flex justify-between w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
            <input
              type="number"
              className="block w-full px-3 py-2 bg-green-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={total.toFixed(2)}
              disabled
            />
          </div>
          <button
            type="button"
            onClick={handleRunTests}
            disabled={isRunning || interventions.length === 0}
            className={`inline-flex items-center px-4 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              isRunning || interventions.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
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
          </button>
        </div>
      </div>

      {/* <ResultsTable results={results} /> */}
    </div>
  );
}