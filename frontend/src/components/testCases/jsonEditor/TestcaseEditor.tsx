'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Ajv from 'ajv';
import Editor from '@monaco-editor/react';
import { testCaseSchema } from '@/lib/test/schema';
import { testCaseSamples } from '@/lib/test/test';
import { Loader2Icon } from 'lucide-react';
import { getInterventionByCode, getTestCaseByCode, postTestCase, updateTestCase } from '@/lib/api';
import TestcaseForm from './TestCaseForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const ajv = new Ajv({ allErrors: true });

export default function TestcaseEditor() {
    const [jsonData, setJsonData] = useState(testCaseSamples[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

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

    const handleSave = async (dataToSave = jsonData) => {
        if (!validateJson(dataToSave)) {
            toast.error('Validation failed. Fix errors before saving.');
            return false;
        }

        const code = dataToSave.formData.productOrService?.[0]?.code;
        const title = dataToSave.formData?.title || 'Unnamed Testcase';
        const description = dataToSave.formData?.test || '';

        try {
            const interventionResp = await getInterventionByCode(code);
            if (interventionResp?.status !== 200 || !interventionResp.data?.length) {
                toast.error(`Intervention not found for code: ${code}`);
                return false;
            }

            const interventionId = interventionResp.data[0].id;

            const existingTestsResp = await getTestCaseByCode(code);
            const existingTest = existingTestsResp?.data?.find(test => test.name === title);

            if (existingTest?.id) {
                const updateResp = await updateTestCase(existingTest.id, {
                    test_config: dataToSave,
                });

                if (updateResp?.status === 200) {
                    toast.success(`Test case "${title}" updated successfully.`);
                    return true;
                } else {
                    console.error('Failed to update test case:', updateResp);
                    toast.error(`Error updating test case "${title}".`);
                    return false;
                }
            } else {
                const createResp = await postTestCase({
                    intervention_id: interventionId,
                    name: title,
                    description,
                    code,
                    test_config: dataToSave,
                });

                if (createResp?.status === 201) {
                    toast.success(`Test case "${title}" created successfully.`);
                    return true;
                } else {
                    console.error('Failed to create test case:', createResp);
                    toast.error(`Error creating test case "${title}".`);
                    return false;
                }
            }
        } catch (error) {
            console.error('Error saving test case:', error);
            toast.error(`An unexpected error occurred while saving "${title}".`);
            return false;
        }
    };

    const handleSaveAll = async () => {
        setIsBulkSubmitting(true);
        let successCount = 0;
        let errorCount = 0;

        for (const testCase of testCaseSamples) {
            const result = await handleSave(testCase);
            if (result) {
                successCount++;
            } else {
                errorCount++;
            }
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        toast.info(
            `Bulk save completed. ${successCount} succeeded, ${errorCount} failed.`,
            { duration: 5000 }
        );
        setIsBulkSubmitting(false);
    };

    return (
        <div className=" mx-auto py-4">
            <h1 className="text-2xl font-bold text-gray-500 mb-6">Test setup</h1>
            <div className="bg-white rounded-sm shadow-md p-6 mb-8">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className="py-2 bg-red-100">
                        <Tabs defaultValue='tests' className='mb-2 px-2'>
                            <TabsList className="mb-4 ">
                                <TabsTrigger value="tests">Tests</TabsTrigger>
                                <TabsTrigger value="json">Json</TabsTrigger>
                            </TabsList>
                            <TabsContent value='json'>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Test Case JSON Editor</CardTitle>
                                    </CardHeader>
                                </Card>
                            </TabsContent>
                        </Tabs>
                        <div className="mb-4 bg-gray-50">
                            <div className="rounded-md border bg-white">
                                <Editor
                                    height="800px"
                                    defaultLanguage="json"
                                    value={JSON.stringify(jsonData, null, 2)}
                                    onChange={(value) => {
                                        try {
                                            if (value) {
                                                const parsed = JSON.parse(value);
                                                setJsonData(parsed);
                                            }
                                        } catch (err) {
                                            toast.error(`${err}`)
                                        }
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
                    </div>

                    <TestcaseForm jsonData={jsonData} setJsonData={setJsonData} />
                </div>
                <div className="flex gap-4">
                    <Button
                        variant="secondary"
                        onClick={() => handleSave()}
                        disabled={isSubmitting || isBulkSubmitting}
                        className='bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-white'
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <Loader2Icon className="h-4 w-4 animate-spin" />
                                Saving...
                            </span>
                        ) : (
                            'Save Current Testcase'
                        )}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleSaveAll}
                        disabled={isBulkSubmitting || isSubmitting}
                        className='bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-white'
                    >
                        {isBulkSubmitting ? (
                            <span className="flex items-center gap-2">
                                <Loader2Icon className="h-4 w-4 animate-spin" />
                                Saving All...
                            </span>
                        ) : (
                            'Save All Sample Testcases'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}