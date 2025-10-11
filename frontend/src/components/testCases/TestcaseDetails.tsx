// TestcaseDetails.tsx
import React, { useEffect, useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlayIcon, UserIcon, XIcon, CodeIcon, FileTextIcon, RefreshCwIcon } from 'lucide-react';
import { Label } from '../ui/label';
import { FormatPatient, TestCase } from '@/lib/types';
import PatientDetailsPanel from '../Dashboard/PatientDetailsPanel';
import { getPatients, searchPatientHie } from '@/lib/api';

interface TestcaseDetailsProps {
  title: string;
  testCases?: TestCase[];
  onRunTests?: (selectedItems: string[]) => void;
  isRunning?: boolean;
  onUpdatePatient?: (testCaseTitle: string, patient: FormatPatient) => void;
  showPatientPanel?: boolean;
  columns?: number;
  displayMode?: 'title' | 'code' | 'both';
  showDisplayToggle?: boolean;
  complexInterventions?: string[];
}

// Helper function to calculate birthdate from age
const calculateBirthDate = (age: number): string => {
  const today = new Date();
  const birthYear = today.getFullYear() - age;
  return `${birthYear}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

// Helper function to extract search parameters from test case
const getSearchParameters = (testCase: TestCase): Array<{ param: string, value: string }> => {
  const params: Array<{ param: string, value: string }> = [];
  const { patient } = testCase.formData;

  // Extract first name and last name from the full name
  if (patient.name) {
    const nameParts = patient.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    if (firstName) {
      params.push({ param: 'given', value: firstName });
    }
    if (lastName) {
      params.push({ param: 'family', value: lastName });
    }
    // Also try full name search
    params.push({ param: 'name', value: patient.name });
  }

  // Add gender search
  if (patient.gender) {
    params.push({ param: 'gender', value: patient.gender });
  }

  // Add birthdate search
  if (patient.birthDate) {
    params.push({ param: 'birthdate', value: patient.birthDate });
  }

  return params;
};

// Function to search HIE with multiple parameters
const searchHieWithParams = async (searchParams: Array<{ param: string, value: string }>, localPatientIds: Set<string>): Promise<FormatPatient | null> => {
  for (const { param, value } of searchParams) {
    if (!value) continue;

    try {
      console.log(`Searching HIE with ${param}=${value}`);
      const hiePatients = await searchPatientHie(param, value);

      if (hiePatients && hiePatients.length > 0) {
        // Filter out patients that exist in local DB
        const newPatients = hiePatients.filter(patient =>
          !localPatientIds.has(patient.id) &&
          !patient.identifiers?.some(id => localPatientIds.has(id.value))
        );

        if (newPatients.length > 0) {
          console.log(`Found ${newPatients.length} new patients with ${param}=${value}`);
          return newPatients[0]; // Return the first new patient found
        } else {
          console.log(`No new patients found with ${param}=${value}`);
        }
      }
    } catch (error) {
      console.error(`HIE search failed for ${param}=${value}:`, error);
    }
  }

  return null;
};

export default function TestcaseDetails({
  title,
  testCases,
  onRunTests,
  isRunning,
  onUpdatePatient,
  showPatientPanel,
  columns = 1,
  displayMode = 'title',
  showDisplayToggle = false,
  complexInterventions
}: TestcaseDetailsProps) {
  const [editingTestCase, setEditingTestCase] = useState<string | null>(null);
  const [currentDisplayMode, setCurrentDisplayMode] = useState<'title' | 'code' | 'both'>(displayMode);
  const [updatingPatients, setUpdatingPatients] = useState<Record<string, boolean>>({});
  const [localPatientIds, setLocalPatientIds] = useState<Set<string>>(new Set());
  const [hasAutoUpdated, setHasAutoUpdated] = useState<boolean>(false);

  const items = testCases || [];
  const interventionsList = complexInterventions || [];
  const [showPanels, setShowPanels] = useState<Record<string, boolean>>({});

  const FormSchema = z.object({
    items: z.array(z.string()).refine((value) => value.length > 0, {
      message: "You have to select at least one item.",
    }),
  });

  const defaultSelectedItems = items.map(item => item.formData?.title);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: defaultSelectedItems,
    },
  });

  // Load local patient IDs on component mount
  useEffect(() => {
    loadLocalPatientIds();
  }, []);

  // Auto-update patients when component mounts or test cases change
  useEffect(() => {
    if (items.length > 0 && onUpdatePatient && !hasAutoUpdated && localPatientIds.size > 0) {
      autoUpdateAllPatients();
    }
  }, [items, onUpdatePatient, hasAutoUpdated, localPatientIds.size]);

  const loadLocalPatientIds = async () => {
    try {
      const patients = await getPatients();
      if (patients) {
        const ids = new Set<string>();
        patients.forEach(patient => {
          ids.add(patient.id);
          // Also add all identifier values to the set
          patient.identifiers?.forEach(identifier => {
            if (identifier.value) {
              ids.add(identifier.value);
            }
          });
        });
        setLocalPatientIds(ids);
        console.log('Loaded local patient IDs:', Array.from(ids));
      }
    } catch (error) {
      console.error('Error loading local patients:', error);
    }
  };

  // Auto-update patient for a specific test case
  const autoUpdatePatient = async (testCaseTitle: string): Promise<boolean> => {
    const testCase = items.find(tc => tc.formData.title === testCaseTitle);
    if (!testCase || !onUpdatePatient) {
      console.log('No test case found or onUpdatePatient not provided');
      return false;
    }

    setUpdatingPatients(prev => ({ ...prev, [testCaseTitle]: true }));

    try {
      console.log(`Auto-updating patient for: ${testCaseTitle}`);
      const searchParams = getSearchParameters(testCase);
      console.log('Search parameters:', searchParams);

      // Prioritize gender and birthdate searches for better matching
      const prioritizedParams = [
        ...searchParams.filter(p => p.param === 'gender' || p.param === 'birthdate'),
        ...searchParams.filter(p => p.param !== 'gender' && p.param !== 'birthdate')
      ];

      const foundPatient = await searchHieWithParams(prioritizedParams, localPatientIds);

      if (foundPatient) {
        console.log('Found patient for update:', foundPatient);
        onUpdatePatient(testCaseTitle, foundPatient);

        // Add the new patient to local IDs to avoid duplicates in subsequent searches
        setLocalPatientIds(prev => {
          const newSet = new Set(prev);
          newSet.add(foundPatient.id);
          foundPatient.identifiers?.forEach(id => {
            if (id.value) newSet.add(id.value);
          });
          return newSet;
        });

        return true;
      } else {
        console.log('No suitable patient found in HIE');
        return false;
      }
    } catch (error) {
      console.error(`Error auto-updating patient for ${testCaseTitle}:`, error);
      return false;
    } finally {
      setUpdatingPatients(prev => ({ ...prev, [testCaseTitle]: false }));
    }
  };

  // Auto-update all test cases
  const autoUpdateAllPatients = async () => {
    if (!onUpdatePatient) {
      console.error('Update patient function not available');
      return;
    }

    setHasAutoUpdated(true);
    let updatedCount = 0;
    let errorCount = 0;

    console.log('Starting automatic patient update for all test cases...');

    // Process test cases sequentially to avoid overwhelming the API
    for (const testCase of items) {
      try {
        const success = await autoUpdatePatient(testCase.formData.title);
        if (success) {
          updatedCount++;
        } else {
          errorCount++;
        }

        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        errorCount++;
        console.error(`Failed to update patient for ${testCase.formData.title}:`, error);
      }
    }

    console.log(`Auto-update completed: ${updatedCount} updated, ${errorCount} failed`);

    if (updatedCount > 0) {
      toast.success(`Auto-updated patients for ${updatedCount} test cases`);
    }
    if (errorCount > 0) {
      toast.warning(`${errorCount} test cases couldn't find matching patients`);
    }
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.items.length === 0) {
      toast.error('Select at least one test case to run');
      return;
    }
    if (onRunTests) {
      onRunTests(data.items);
    } else {
      toast.info("You selected the following items", {
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(data, null, 2)}
            </code>
          </pre>
        ),
      });
    }
  }

  useEffect(() => {
    const panelsState: Record<string, boolean> = {};

    items.forEach(tc => {
      const shouldShowPanel = tc.formData.productOrService[0].code && interventionsList.includes(tc.formData.productOrService[0].code);
      panelsState[tc.formData.title] = !!shouldShowPanel;
    });

    setShowPanels(panelsState);
  }, [items, interventionsList]);

  // Get current patient for the editing test case
  const getCurrentPatient = () => {
    if (!editingTestCase) return null;
    const testCase = items.find(tc => tc.formData.title === editingTestCase);
    return testCase?.formData.patient || null;
  };

  const handleSelectPatient = (patient: FormatPatient) => {
    if (editingTestCase && onUpdatePatient) {
      onUpdatePatient(editingTestCase, patient);
      setEditingTestCase(null);
      toast.success(`Patient updated for test case: ${editingTestCase}`);

      // Add the new patient to local IDs to avoid duplicates
      setLocalPatientIds(prev => {
        const newSet = new Set(prev);
        newSet.add(patient.id);
        patient.identifiers?.forEach(id => {
          if (id.value) newSet.add(id.value);
        });
        return newSet;
      });
    }
  };

  const handleEditPatient = (testCaseTitle: string) => {
    setEditingTestCase(testCaseTitle);
  };

  const handleCancelEdit = () => {
    setEditingTestCase(null);
  };

  // Helper function to get patient info display
  const getPatientInfo = (patient: FormatPatient) => {
    if (!patient) return 'No patient selected';
    return `${patient.name} (${patient.gender}, ${patient.birthDate})`;
  };

  // Helper function to get test case display content based on mode
  const getTestCaseDisplay = (testCase: TestCase) => {
    switch (currentDisplayMode) {
      case 'title':
        return testCase.formData?.title || 'Untitled';
      case 'code':
        return testCase.formData?.productOrService[0].code || 'No code available';
      case 'both':
        return (
          <div>
            <div className="font-medium">{testCase.formData?.title || 'Untitled'}</div>
            {testCase.formData?.productOrService[0].code && (
              <div className="text-xs text-muted-foreground mt-1">
                <code>{testCase.formData.productOrService[0].code}</code>
              </div>
            )}
          </div>
        );
      default:
        return testCase.formData?.title || 'Untitled';
    }
  };

  // Calculate grid class based on columns
  const getGridClass = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-green-900">{title}</h2>

        <div className="flex items-center space-x-2">
          {/* Auto-update status indicator */}
          {Object.values(updatingPatients).some(Boolean) && (
            <div className="flex items-center text-sm text-blue-600">
              <RefreshCwIcon className="h-4 w-4 mr-1 animate-spin" />
              Auto-updating patients...
            </div>
          )}

          {/* Manual update button as fallback */}
          {onUpdatePatient && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={autoUpdateAllPatients}
              disabled={Object.values(updatingPatients).some(Boolean)}
              title="Re-run auto-update for all patients from HIE"
            >
              <RefreshCwIcon className={`h-4 w-4 mr-1 ${Object.values(updatingPatients).some(Boolean) ? 'animate-spin' : ''}`} />
              Update All
            </Button>
          )}

          {showDisplayToggle && (
            <>
              <Button
                type="button"
                variant={currentDisplayMode === 'title' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentDisplayMode('title')}
                title="Show titles only"
              >
                <FileTextIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={currentDisplayMode === 'code' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentDisplayMode('code')}
                title="Show codes only"
              >
                <CodeIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={currentDisplayMode === 'both' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentDisplayMode('both')}
                title="Show both title and code"
              >
                <FileTextIcon className="h-4 w-4 mr-1" />
                <CodeIcon className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="items"
            render={({ field }) => (
              <FormItem>
                <div className={`grid ${getGridClass()} gap-4`}>
                  {items.map((item) => {
                    const testCaseTitle = item.formData.title;
                    const shouldShowPanel = showPanels[testCaseTitle] || false;
                    const isEditing = editingTestCase === testCaseTitle;
                    const isUpdating = updatingPatients[testCaseTitle];

                    return (
                      <FormItem
                        key={testCaseTitle}
                        className="flex flex-col items-start space-y-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                      >
                        <div className="flex items-start w-full justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <FormControl>
                              <Checkbox
                                className="data-[state=checked]:border-green-900 data-[state=checked]:bg-green-900 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700 mt-1"
                                checked={field.value?.includes(testCaseTitle)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, testCaseTitle])
                                    : field.onChange(
                                      field.value?.filter((id) => id !== testCaseTitle)
                                    );
                                }}
                              />
                            </FormControl>
                            <div className="grid gap-1.5 flex-1">
                              {getTestCaseDisplay(item)}
                              {(showPatientPanel || shouldShowPanel) && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  <span className="font-medium">Patient: </span>
                                  {item.formData.patient ? getPatientInfo(item.formData.patient) : 'No patient selected'}
                                  {isUpdating && (
                                    <span className="ml-2 text-blue-500">
                                      <RefreshCwIcon className="h-3 w-3 animate-spin inline" /> Updating...
                                    </span>
                                  )}
                                </div>
                              )}
                              {(showPatientPanel || shouldShowPanel) && isEditing && (
                                <div className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                                  <div className="flex items-center justify-between mb-3">
                                    <h5 className="text-gray-700 font-medium">
                                      Editing Patient for {testCaseTitle}
                                    </h5>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={handleCancelEdit}
                                      className="h-8 w-8 p-0"
                                      title="Cancel editing"
                                    >
                                      <XIcon className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <PatientDetailsPanel
                                    patient={getCurrentPatient()}
                                    onSelectPatient={handleSelectPatient}
                                    show={false}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          {(showPatientPanel || shouldShowPanel) && onUpdatePatient && (
                            <div className="flex flex-col space-y-2 ml-2 shrink-0">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditPatient(testCaseTitle)}
                                className="flex items-center"
                                title="Edit patient for this test case"
                                disabled={!!editingTestCase && editingTestCase !== testCaseTitle}
                              >
                                <UserIcon className="h-3 w-3 mr-1" />
                                Manual
                              </Button>
                            </div>
                          )}
                        </div>
                      </FormItem>
                    )
                  })}
                </div>
              </FormItem>
            )}
          />
          <div className="flex items-center space-x-4">
            <Button
              type="submit"
              disabled={isRunning || !!editingTestCase || Object.values(updatingPatients).some(Boolean)}
              className={`inline-flex items-center px-4 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isRunning || editingTestCase || Object.values(updatingPatients).some(Boolean)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-900 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                }`}
            >
              <PlayIcon className="-ml-1 mr-2 h-5 w-5" />
              {isRunning ? 'Running...' : 'Run selected tests'}
            </Button>

            {Object.values(updatingPatients).some(Boolean) && (
              <span className="text-sm text-muted-foreground">
                Auto-updating patients from HIE...
              </span>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}