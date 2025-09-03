// TestcaseDetails.tsx
import React, { useState } from 'react';
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
import { PlayIcon, UserIcon, XIcon } from 'lucide-react';
import { Label } from '../ui/label';
import { FormatPatient, TestCase } from '@/lib/types';
import PatientDetailsPanel from '../Dashboard/PatientDetailsPanel';

interface TestcaseDetailsProps {
  title: string;
  testCases?: TestCase[];
  onRunTests?: (selectedItems: string[]) => void;
  isRunning?: boolean;
  onUpdatePatient?: (testCaseTitle: string, patient: FormatPatient) => void;
  showPatientPanel?: boolean;
}

export default function TestcaseDetails({
  title,
  testCases,
  onRunTests,
  isRunning,
  onUpdatePatient,
  showPatientPanel,
}: TestcaseDetailsProps) {
  const [editingTestCase, setEditingTestCase] = useState<string | null>(null);
  const items = testCases || [];

  const FormSchema = z.object({
    items: z.array(z.string()).refine((value) => value.length > 0, {
      message: "You have to select at least one item.",
    }),
  });

  const defaultSelectedItems = items.map(item => item.formData.title);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: defaultSelectedItems,
    },
  });

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

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="items"
            render={({ field }) => (
              <FormItem>
                <Label>Select Test Cases</Label>
                <div className="grid gap-4">
                  {items.map((item) => (
                    <FormItem
                      key={item.formData.title}
                      className="flex flex-col items-start space-y-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <div className="flex items-start w-full justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <FormControl>
                            <Checkbox
                              className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700 mt-1"
                              checked={field.value?.includes(item.formData.title)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.formData.title])
                                  : field.onChange(
                                    field.value?.filter((id) => id !== item.formData.title)
                                  );
                              }}
                            />
                          </FormControl>
                          <div className="grid gap-1.5 flex-1">
                            <p className="text-sm font-medium leading-none">
                              {item.formData.title}
                            </p>
                            {showPatientPanel && item.formData.patient && (
                              <div className="text-xs text-muted-foreground mt-1">
                                <span className="font-medium">Patient: </span>
                                {getPatientInfo(item.formData.patient)}
                              </div>
                            )}
                            {/* Patient Editing Panel */}
                            {showPatientPanel && editingTestCase && item.formData.title === editingTestCase && (
                              <div className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="text-gray-700 font-medium">
                                    Editing Patient
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
                        {showPatientPanel && onUpdatePatient && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPatient(item.formData.title)}
                            className="ml-2 shrink-0"
                            title="Edit patient for this test case"
                            disabled={!!editingTestCase && editingTestCase !== item.formData.title}
                          >
                            <UserIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </FormItem>
                  ))}
                </div>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isRunning || !!editingTestCase}
            className={`inline-flex items-center px-4 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isRunning || editingTestCase
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
          >
            <PlayIcon className="-ml-1 mr-2 h-5 w-5" />
            {isRunning ? 'Running...' : 'Run selected tests'}
          </Button>
        </form>
      </Form>
    </div>
  );
}