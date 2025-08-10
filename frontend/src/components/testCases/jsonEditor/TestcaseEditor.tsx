'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Ajv from 'ajv';
    import JSONInput from 'react-json-editor-ajrm';
    import locale    from 'react-json-editor-ajrm/locale/en';
import { testCaseSchema } from '@/lib/test/schema';
import { testCaseSample } from '@/lib/test/test';
import { Loader2Icon } from 'lucide-react';
import InterventionSelector from '@/components/Dashboard/InterventionSelector';
import { INTERVENTION_CODES, TEST_PACKAGES } from '@/packages/ShaPackages';
import { InterventionItem } from '@/lib/types';
import { postTestCase } from '@/lib/api';

const ajv = new Ajv({ allErrors: true });

export default function TestcaseEditor() {
    const [jsonData, setJsonData] = useState(testCaseSample);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [selectedPackage, setSelectedPackage] = useState('');
    const [selectedIntervention, setSelectedIntervention] = useState('');
    const [interventions, setInterventions] = useState<InterventionItem[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [availableInterventions, setAvailableInterventions] = useState<any[]>([]);

  const validateJson = (data: any) => {
    const validate = ajv.compile(testCaseSchema);
    const valid = validate(data);

    if (!valid) {
      const errors = validate.errors?.map(err => {
        return `${err.instancePath || err.schemaPath}: ${err.message}`;
      }) || [];
      setValidationErrors(errors);
      return false;
    }

    setValidationErrors([]);
    return true;
  };

useEffect(() => {
    if (selectedPackage) {
    setAvailableInterventions(INTERVENTION_CODES[selectedPackage as keyof typeof INTERVENTION_CODES] || []);
    setSelectedIntervention('');
    }
}, [selectedPackage]);
  

  const handleSave = async () => {
    if (!validateJson(jsonData)) {
      toast.error('Validation failed. Fix errors before saving.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await postTestCase
      (
        {
          name: jsonData.formData?.title || 'Unnamed Testcase',
          description: jsonData.formData?.test || '',
          test_config: jsonData,
          code: jsonData.formData.productOrService[0].code
        }
      );

      toast.success('Testcase saved successfully');
    } catch (error) {
      toast.error('Error saving testcase');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-500 mb-6">JSON Testcase Editor</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-4 bg-gray-50">
            {/* <Label className="mb-1 block">Testcase JSON</Label> */}
            <div className="rounded-md border bg-white">
            <JSONInput
                id="json-editor"
                theme="light_mitsuketa_tribute"
                placeholder={jsonData}
                locale={locale}
                width="100%"
                height="600px"
                onChange={({ jsObject, error }) => {
                if (!error) setJsonData(jsObject);
                }}
            />
            </div>
      </div>
            {validationErrors.length > 0 && (
        <div className="mb-4 p-3 border border-red-400 rounded-md bg-red-50 text-sm text-red-700">
          <strong>Validation Errors:</strong>
          <ul className="mt-1 list-disc list-inside">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
        <Button variant="secondary" onClick={handleSave} disabled={isSubmitting} className='bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-white'>
            {isSubmitting ? (
                <span className="flex items-center gap-2">
                <Loader2Icon className="h-4 w-4 animate-spin" />
                Saving...
                </span>
            ) : (
                'Save Testcase'
            )}
        </Button>

      </div>
    </div>
  );
}
