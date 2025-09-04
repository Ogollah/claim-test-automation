'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Ajv from 'ajv';
import Editor from '@monaco-editor/react';
import { testCaseSchema } from '@/lib/test/schema';
import { CodeIcon, Loader2Icon, PlusIcon, TableIcon, XIcon } from 'lucide-react';
import { getInterventionByCode, postTestCase, updateTestCase, getPackages, getInterventionByPackageId, getTestCaseByCode, deleteTestCase } from '@/lib/api';
import TestcaseForm from './TestCaseForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TestCases from './TestCases';
import { TestCase, TestCaseItem, Package, Intervention } from '@/lib/types';
import { testCaseSample } from '@/lib/test/test';

const ajv = new Ajv({ allErrors: true });

interface TestCaseEditorProps { }

export default function TestcaseEditor({ }: TestCaseEditorProps) {
    const [jsonData, setJsonData] = useState<TestCase | null>(null);
    const [selectedTestCase, setSelectedTestCase] = useState<TestCaseItem | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<string>("");
    const [selectedIntervention, setSelectedIntervention] = useState<string>("");
    const [packages, setPackages] = useState<Package[]>([]);
    const [availableInterventions, setAvailableInterventions] = useState<Intervention[]>([]);
    const [tests, setTests] = useState<TestCaseItem[]>([]);

    // Fetch packages on mount
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

    // Fetch interventions when package changes
    useEffect(() => {
        if (!selectedPackage) {
            setAvailableInterventions([]);
            setSelectedIntervention("");
            return;
        }

        const fetchInterventions = async () => {
            try {
                const intevents = await getInterventionByPackageId(Number(selectedPackage));
                setAvailableInterventions(Array.isArray(intevents) ? intevents : []);
                if (Array.isArray(intevents) && intevents.length > 0) {
                    setSelectedIntervention(intevents[0].code);
                } else {
                    setSelectedIntervention("");
                    setTests([]);
                }
            } catch (error) {
                console.error("Error fetching interventions:", error);
                toast.error("Failed to load interventions");
            }
        };
        fetchInterventions();
    }, [selectedPackage]);

    useEffect(() => {
        if (!selectedIntervention) {
            setTests([]);
            setSelectedTestCase(null);
            return;
        }

        const fetchTestCases = async () => {
            try {
                const response = await getTestCaseByCode(selectedIntervention);
                const testCases = Array.isArray(response)
                    ? response
                    : (response && Array.isArray(response.data) ? response.data : []);
                setTests(testCases);

                if (selectedTestCase) {
                    const stillExists = testCases.some(test => test.id === selectedTestCase.id);
                    if (!stillExists) {
                        setSelectedTestCase(null);
                        setJsonData(null);
                    }
                }
            } catch (error) {
                console.error("Error fetching test cases:", error);
                toast.error("Failed to load test cases");
                setTests([]);
                setSelectedTestCase(null);
            }
        };
        fetchTestCases();
    }, [selectedIntervention]);

    // Handle test case selection
    const handleTestCaseSelect = (testCase: TestCaseItem | null) => {
        if (testCase && testCase.test_config) {
            setJsonData(testCase.test_config);
            setSelectedTestCase(testCase);
            toast.success(`Loaded test case: ${testCase.name} ${testCase.id}`);
        } else if (testCase === null) {
            setJsonData(null);
            setSelectedTestCase(null);
            toast.info('Test case deselected');
        }
    };

    // Handle test case deletion
    const handleDeleteTestCase = async (testId: number) => {
        try {
            await deleteTestCase(testId);
            setTests(prevTests => prevTests.filter(test => test.id !== testId));

            if (selectedTestCase?.id === testId) {
                setSelectedTestCase(null);
                setJsonData(null);
            }

            toast.success("Test case deleted successfully");
        } catch (error) {
            console.error("Error deleting test case:", error);
            toast.error("Failed to delete test case");
        }
    };

    // Clear JSON data
    const handleClearJson = () => {
        setJsonData(null);
        setSelectedTestCase(null);
        toast.info('JSON editor cleared');
    };

    const validateJson = (data: unknown): boolean => {
        if (!data) {
            toast.error('No JSON data to validate');
            return false;
        }

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

    const handleSave = async (dataToSave: TestCase = jsonData as TestCase): Promise<boolean> => {
        if (!dataToSave) {
            toast.error('No test case data to save');
            return false;
        }

        if (!validateJson(dataToSave)) {
            toast.error('Validation failed. Fix errors before saving.');
            return false;
        }

        const code = dataToSave.formData.productOrService?.[0]?.code;
        const title = dataToSave.formData?.title;
        const description = dataToSave.formData?.test || '';

        if (!code) {
            toast.error('Test case must have a product/service code');
            return false;
        }

        if (title === 'Sample test do not save me as I will be deleted (edit)') {
            toast.warning('This is a sample test case and cannot be saved.');
            return false;
        }

        try {
            setIsSubmitting(true);
            const interventionResp = await getInterventionByCode(code);
            if (interventionResp?.status !== 200 || !interventionResp.data?.length) {
                toast.error(`Intervention not found for code: ${code}`);
                return false;
            }

            const interventionId = interventionResp.data[0].id;

            // Check if updating an existing test case or creating a new one
            if (selectedTestCase?.id) {
                const updateResp = await updateTestCase(selectedTestCase.id, {
                    intervention_id: interventionId,
                    name: title,
                    description,
                    code,
                    test_config: dataToSave,
                });

                if (updateResp?.status === 200) {
                    toast.success(`Test case "${title}" updated successfully.`);

                    // Refresh the test cases list to show updated data
                    if (selectedIntervention) {
                        const response = await getTestCaseByCode(selectedIntervention);
                        const testCases = Array.isArray(response)
                            ? response
                            : (response && Array.isArray(response.data) ? response.data : []);
                        setTests(testCases);
                    }

                    return true;
                } else {
                    console.error('Failed to update test case:', updateResp);
                    toast.error(`Error updating test case "${title}".`);
                    return false;
                }
            } else {
                // Create new test case
                const createResp = await postTestCase({
                    intervention_id: interventionId,
                    name: title,
                    description,
                    code,
                    test_config: dataToSave,
                });

                if (createResp?.status === 201) {
                    toast.success(`Test case "${title}" created successfully.`);
                    if (selectedIntervention) {
                        const response = await getTestCaseByCode(selectedIntervention);
                        const testCases = Array.isArray(response)
                            ? response
                            : (response && Array.isArray(response.data) ? response.data : []);
                        setTests(testCases);
                    }

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
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddSampleTestCase = async () => {
        const sampleTestCase = await testCaseSample;
        setJsonData(sampleTestCase);
        setSelectedTestCase(null);
    };

    return (
        <div className=" mx-auto py-4">
            <h1 className="text-2xl font-bold text-gray-500 mb-6">Test setup</h1>
            <div className="bg-white rounded-sm shadow-md p-6 mb-8">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className="py-2 bg-gray-50 text-gray-500">
                        <Tabs defaultValue='tests' className=' px-2'>
                            <TabsList className="mb-0 text-gray-500">
                                <TabsTrigger className='text-gray-500' value="tests">
                                    <TableIcon className="h-4 w-4" />
                                    <span className="text-gray-500">Tests</span>
                                </TabsTrigger>
                                <TabsTrigger className='text-gray-500' value="json">
                                    <CodeIcon className="h-4 w-4" />
                                    <span className="text-gray-500">Json</span>
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value='json' className='text-gray-500'>
                                <Card>
                                    <CardHeader className='text-gray-500'>
                                        <CardTitle>
                                            <div className='flex justify-between items-center'>
                                                <div className='flex items-center'>
                                                    <CodeIcon className="h-4 w-4 mr-2" />
                                                    <span>Test Case JSON Editor</span>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    {!jsonData && (
                                                        <Button
                                                            variant="outline"
                                                            onClick={handleAddSampleTestCase}
                                                            className='flex items-center gap-1 bg-blue-500 text-white hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                                        >
                                                            <PlusIcon className="h-4 w-4 mr-2" />
                                                            <span>Add sample test case</span>
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="outline"
                                                        onClick={handleClearJson}
                                                        className='flex items-center gap-1'
                                                    >
                                                        <XIcon className="h-4 w-4" />
                                                        <span className='text-gray-500'>Clear</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-4 bg-gray-50">
                                            <div className="rounded-md border bg-white">
                                                <Editor
                                                    height="800px"
                                                    defaultLanguage="json"
                                                    value={jsonData ? JSON.stringify(jsonData, null, 2) : '{}'}
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
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value='tests'>
                                <Card>
                                    <CardHeader className='text-gray-500'>
                                        <CardTitle>Test Cases</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-4 bg-gray-50">
                                            <div className="rounded-md border bg-white">
                                                <TestCases
                                                    packages={packages}
                                                    availableInterventions={availableInterventions}
                                                    tests={tests}
                                                    selectedPackage={selectedPackage}
                                                    selectedIntervention={selectedIntervention}
                                                    selectedTestCase={selectedTestCase}
                                                    onSelectPackage={setSelectedPackage}
                                                    onSelectIntervention={setSelectedIntervention}
                                                    onTestCaseSelect={handleTestCaseSelect}
                                                    onDeleteTestCase={handleDeleteTestCase}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <TestcaseForm jsonData={jsonData} setJsonData={setJsonData} />
                </div>
                <div className="flex gap-4 py-3">
                    <Button
                        variant="secondary"
                        onClick={() => handleSave()}
                        disabled={isSubmitting || !jsonData}
                        className='bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-white'
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <Loader2Icon className="h-4 w-4 animate-spin" />
                                Saving...
                            </span>
                        ) : (
                            selectedTestCase ? 'Update Test Case' : 'Create New Test Case'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}