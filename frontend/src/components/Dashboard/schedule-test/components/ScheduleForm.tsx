'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Intervention, Package, ScheduleFormData } from '@/lib/types'
import { useAuthSession } from '@/hook/useAuth'
import { createSchedule, getInterventionByPackageId, getPackages } from '@/lib/api'

interface ScheduleFormProps {
  onScheduleCreated?: () => void;
}

export interface AutomationTestSuite {
  TC_ID?: string;
  TC_Name: string;
  intervention_category: string;
  pre_auth: boolean;
  type: string;
  intervention_code: string;
}

interface TestCaseCategory {
  name: string;
  testCases: AutomationTestSuite[];
  isExpanded: boolean;
}

interface Environment {
  id: string;
  name: string;
  selected: boolean;
}

// Dummy test cases data matching the provided payload
const dummyTestCases: AutomationTestSuite[] = [
  {
    TC_ID: "SHA-08-005-TC01",
    TC_Name: "Valid Facility & Tariff",
    intervention_category: "Maternity",
    pre_auth: false,
    type: "Positive",
    intervention_code: "SHA-08-005"
  },
  {
    TC_ID: "SHA-08-005-TC02",
    TC_Name: "Tariff Below Allowed",
    intervention_category: "Maternity",
    pre_auth: false,
    type: "Positive",
    intervention_code: "SHA-08-005"
  },
  {
    TC_ID: "SHA-08-005-TC04",
    TC_Name: "Valid Facility & Tariff",
    intervention_category: "Maternity",
    pre_auth: false,
    type: "Positive",
    intervention_code: "SHA-08-005"
  },
  {
    TC_ID: "SHA-08-005-TC05",
    TC_Name: "Tariff Below Allowed",
    intervention_category: "Maternity",
    pre_auth: false,
    type: "Positive",
    intervention_code: "SHA-08-005"
  },
  {
    TC_ID: "SHA-08-005-TC07",
    TC_Name: "Valid Facility & Tariff",
    intervention_category: "Maternity",
    pre_auth: false,
    type: "Positive",
    intervention_code: "SHA-08-005"
  },
  {
    TC_ID: "SHA-08-005-TC08",
    TC_Name: "Tariff Below Allowed",
    intervention_category: "Maternity",
    pre_auth: false,
    type: "Positive",
    intervention_code: "SHA-08-005"
  },
  {
    TC_ID: "SHA-08-005-TC10",
    TC_Name: "Valid Facility & Tariff",
    intervention_category: "Maternity",
    pre_auth: false,
    type: "Positive",
    intervention_code: "SHA-08-005"
  },
  {
    TC_ID: "SHA-08-005-TC11",
    TC_Name: "Tariff Below Allowed",
    intervention_category: "Maternity",
    pre_auth: false,
    type: "Positive",
    intervention_code: "SHA-08-005"
  },
  {
    TC_ID: "SHA-08-005-TC13",
    TC_Name: "Valid Facility & Tariff",
    intervention_category: "Maternity",
    pre_auth: false,
    type: "Positive",
    intervention_code: "SHA-08-005"
  },
  {
    TC_ID: "SHA-08-005-TC14",
    TC_Name: "Tariff Below Allowed",
    intervention_category: "Maternity",
    pre_auth: false,
    type: "Positive",
    intervention_code: "SHA-08-005"
  },
  {
    TC_ID: "SHA-08-005-TC03",
    TC_Name: "Tariff Above Allowed",
    intervention_category: "Maternity",
    pre_auth: false,
    type: "Negative",
    intervention_code: "SHA-08-005"
  },
  {
    TC_ID: "SHA-08-005-TC06",
    TC_Name: "Tariff Above Allowed",
    intervention_category: "Maternity",
    pre_auth: false,
    type: "Negative",
    intervention_code: "SHA-08-005"
  },
  {
    TC_ID: "SHA-08-005-TC09",
    TC_Name: "Tariff Above Allowed",
    intervention_category: "Maternity",
    pre_auth: false,
    type: "Negative",
    intervention_code: "SHA-08-005"
  },
  {
    TC_ID: "SHA-08-005-TC12",
    TC_Name: "Tariff Above Allowed",
    intervention_category: "Maternity",
    pre_auth: false,
    type: "Negative",
    intervention_code: "SHA-08-005"
  },
  {
    TC_ID: "SHA-08-005-TC15",
    TC_Name: "Tariff Above Allowed",
    intervention_category: "Maternity",
    pre_auth: false,
    type: "Negative",
    intervention_code: "SHA-08-005"
  },
  {
    TC_ID: "SHA-08-005-TC16",
    TC_Name: "Invalid Gender (male)",
    intervention_category: "Maternity",
    pre_auth: false,
    type: "Negative",
    intervention_code: "SHA-08-005"
  }
];

// Additional test cases from different categories for demonstration
const additionalTestCases: AutomationTestSuite[] = [
  {
    TC_ID: "SHA-09-001-TC01",
    TC_Name: "Valid Patient Data",
    intervention_category: "Surgery",
    pre_auth: true,
    type: "Positive",
    intervention_code: "SHA-09-001"
  },
  {
    TC_ID: "SHA-09-001-TC02",
    TC_Name: "Invalid Patient Age",
    intervention_category: "Surgery",
    pre_auth: true,
    type: "Negative",
    intervention_code: "SHA-09-001"
  },
  {
    TC_ID: "SHA-10-002-TC01",
    TC_Name: "Standard Consultation",
    intervention_category: "Consultation",
    pre_auth: false,
    type: "Positive",
    intervention_code: "SHA-10-002"
  },
  {
    TC_ID: "SHA-10-002-TC02",
    TC_Name: "Invalid Provider",
    intervention_category: "Consultation",
    pre_auth: false,
    type: "Negative",
    intervention_code: "SHA-10-002"
  }
];

const allTestCases = [...dummyTestCases, ...additionalTestCases];

const defaultFormData: ScheduleFormData = {
  schedule_type: 'daily',
  schedule_time: '',
  email_recipients: '',
  test_config: '',
  is_active: true
}

const defaultEnvironments: Environment[] = [
  { id: 'dev', name: 'Development', selected: false },
  { id: 'staging', name: 'Staging', selected: false },
  { id: 'production', name: 'Production', selected: false },
  { id: 'uat', name: 'UAT', selected: false },
]

export default function ScheduleForm({ 
  onScheduleCreated,
}: ScheduleFormProps) {
  const [formData, setFormData] = useState<ScheduleFormData>({
    ...defaultFormData,
    test_config: JSON.stringify({ test_parameters: {} }, null, 2)
  })

  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [selectedIntervention, setSelectedIntervention] = useState<string>('');
  const [testCases, setTestCases] = useState<AutomationTestSuite[]>([]);
  const [categorizedTestCases, setCategorizedTestCases] = useState<TestCaseCategory[]>([]);
  const [selectedTestCases, setSelectedTestCases] = useState<AutomationTestSuite[]>([]);
  const [availableInterventions, setAvailableInterventions] = useState<Intervention[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>(defaultEnvironments);
  const [isInitializing, setIsInitializing] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Categorize test cases by intervention category and type
  const categorizeTestCases = useCallback((testCases: AutomationTestSuite[]): TestCaseCategory[] => {
    const categories: { [key: string]: AutomationTestSuite[] } = {};
    
    testCases.forEach(testCase => {
      const interventionCategory = testCase.intervention_category || 'Uncategorized';
      const type = testCase.type || 'Unknown';
      
      // Create main category by intervention category
      const mainCategory = interventionCategory;
      
      if (!categories[mainCategory]) {
        categories[mainCategory] = [];
      }
      categories[mainCategory].push(testCase);
    });
    
    return Object.entries(categories).map(([name, testCases]) => ({
      name,
      testCases: testCases.sort((a, b) => (a.TC_ID || '').localeCompare(b.TC_ID || '')),
      isExpanded: expandedCategories.has(name)
    }));
  }, [expandedCategories]);

  // Further categorize test cases within each intervention category by type
  const getSubCategories = (testCases: AutomationTestSuite[]) => {
    const subCategories: { [key: string]: AutomationTestSuite[] } = {};
    
    testCases.forEach(testCase => {
      const type = testCase.type === 'Positive' ? 'Positive Test Cases' : 'Negative Test Cases';
      
      if (!subCategories[type]) {
        subCategories[type] = [];
      }
      subCategories[type].push(testCase);
    });
    
    return Object.entries(subCategories).map(([name, testCases]) => ({
      name,
      testCases: testCases.sort((a, b) => (a.TC_ID || '').localeCompare(b.TC_ID || '')),
      isExpanded: expandedCategories.has(name)
    }));
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const packages = await getPackages();
        setPackages(packages || []);
        if (packages && packages.length > 0) {
          setSelectedPackage(String(packages[0].id));
        } else {
          setIsInitializing(false);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
        toast.error("Failed to load packages");
        setIsInitializing(false);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    if (!selectedPackage) {
      setAvailableInterventions([]);
      setSelectedIntervention("");
      return;
    }

    const fetchInterventions = async () => {
      try {
        const interventions = await getInterventionByPackageId(Number(selectedPackage));
        const interventionsArray = Array.isArray(interventions) ? interventions : [];
        setAvailableInterventions(interventionsArray);
        
        if (interventionsArray.length > 0) {
          setSelectedIntervention(interventionsArray[0].code);
        } else {
          setSelectedIntervention("");
          setTestCases([]);
          setCategorizedTestCases([]);
          setIsInitializing(false);
        }
      } catch (error) {
        console.error("Error fetching interventions:", error);
        toast.error("Failed to load interventions");
        setIsInitializing(false);
      }
    };
    fetchInterventions();
  }, [selectedPackage]);

  useEffect(() => {
    // Use all test cases data instead of API call for design purposes
    // This allows selection from multiple categories in the same session
    if (selectedIntervention) {
      setTestCases(allTestCases);
      const categorized = categorizeTestCases(allTestCases);
      setCategorizedTestCases(categorized);
      setIsInitializing(false);
    } else {
      setTestCases([]);
      setCategorizedTestCases([]);
      setSelectedTestCases([]);
      if (!isInitializing) {
        setIsInitializing(false);
      }
    }
  }, [selectedIntervention, categorizeTestCases]);

  const handleTestCaseToggle = (testCase: AutomationTestSuite) => {
    setSelectedTestCases(prev => {
      const isSelected = prev.some(tc => tc.TC_ID === testCase.TC_ID);
      
      if (isSelected) {
        return prev.filter(tc => tc.TC_ID !== testCase.TC_ID);
      } else {
        return [...prev, testCase];
      }
    });
  };

  const handleCategoryToggle = (category: TestCaseCategory) => {
    const allCategoryTestCaseIds = category.testCases.map(tc => tc.TC_ID);
    const currentSelectedIds = selectedTestCases.map(tc => tc.TC_ID);
    
    const allSelected = category.testCases.every(tc => 
      currentSelectedIds.includes(tc.TC_ID!)
    );
    
    if (allSelected) {
      // Deselect all test cases in category
      setSelectedTestCases(prev => 
        prev.filter(tc => !allCategoryTestCaseIds.includes(tc.TC_ID!))
      );
    } else {
      // Select all test cases in category
      const newSelected = category.testCases.filter(tc => 
        !currentSelectedIds.includes(tc.TC_ID!)
      );
      setSelectedTestCases(prev => [...prev, ...newSelected]);
    }
  };

  const handleSubCategoryToggle = (subCategoryTestCases: AutomationTestSuite[]) => {
    const allSubCategoryTestCaseIds = subCategoryTestCases.map(tc => tc.TC_ID);
    const currentSelectedIds = selectedTestCases.map(tc => tc.TC_ID);
    
    const allSelected = subCategoryTestCases.every(tc => 
      currentSelectedIds.includes(tc.TC_ID!)
    );
    
    if (allSelected) {
      // Deselect all test cases in sub-category
      setSelectedTestCases(prev => 
        prev.filter(tc => !allSubCategoryTestCaseIds.includes(tc.TC_ID!))
      );
    } else {
      // Select all test cases in sub-category
      const newSelected = subCategoryTestCases.filter(tc => 
        !currentSelectedIds.includes(tc.TC_ID!)
      );
      setSelectedTestCases(prev => [...prev, ...newSelected]);
    }
  };

  const handleEnvironmentToggle = (environmentId: string) => {
    setEnvironments(prev => 
      prev.map(env => 
        env.id === environmentId ? { ...env, selected: !env.selected } : env
      )
    );
  };

  const clearAllSelections = () => {
    setSelectedTestCases([]);
    setEnvironments(prev => prev.map(env => ({ ...env, selected: false })));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useAuthSession();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.schedule_time) {
        toast.error("Please select a schedule time.")
        return
      }

      if (!formData.email_recipients.trim()) {
        toast.error("Please enter at least one email recipient.")
        return
      }

      // Validate that at least one test case is selected
      if (selectedTestCases.length === 0) {
        toast.error("Please select at least one test case.")
        return
      }

      // Validate that at least one environment is selected
      const selectedEnvironments = environments.filter(env => env.selected);
      if (selectedEnvironments.length === 0) {
        toast.error("Please select at least one environment.")
        return
      }

      const recipients = formData.email_recipients
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0)

      if (recipients.length === 0) {
        toast.error("Please enter valid email addresses.")
        return
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const invalidEmails = recipients.filter(email => !emailRegex.test(email))
      if (invalidEmails.length > 0) {
        toast.error(`Invalid email format: ${invalidEmails.join(', ')}`)
        return
      }

      let testConfig
      try {
        testConfig = JSON.parse(formData.test_config)
      } catch (error) {
        toast.error("Invalid JSON format in test configuration. Please check your syntax.")
        return
      }

      // Get test case IDs
      const testCaseIds = selectedTestCases
        .map(tc => tc.TC_ID)
        .filter((id): id is string => id !== undefined && id !== null);

      if (testCaseIds.length === 0) {
        toast.error("No valid test case IDs found.")
        return
      }

      // Prepare the schedule data according to the backend API
      const scheduleData = {
        schedule_type: formData.schedule_type,
        schedule_time: formData.schedule_time,
        email_recipients: recipients,
        test_case_ids: testCaseIds,
        environments: selectedEnvironments.map(env => env.id),
        created_by: userId || 'system',
        updated_by: userId || 'system',
        is_active: formData.is_active,
        test_config: testConfig
      }

      await createSchedule(scheduleData)
      
      toast.success(`New test schedule created successfully with ${selectedTestCases.length} test case(s) across ${selectedEnvironments.length} environment(s).`)

      // Reset form but keep the current package and intervention selections
      setFormData({
        ...defaultFormData,
        test_config: JSON.stringify({ test_parameters: {} }, null, 2)
      })
      setSelectedTestCases([]);
      setEnvironments(prev => prev.map(env => ({ ...env, selected: false })));
      
      onScheduleCreated?.()
    } catch (error: any) {
      console.error('Failed to create schedule:', error)
      const errorMessage = error.response?.data?.message || "Failed to create schedule. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof ScheduleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8 text-gray-500">
          Loading packages and interventions...
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Schedule Configuration</CardTitle>
          <CardDescription>Configure when and how tests should run</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schedule_type">Schedule Type *</Label>
              <Select 
                value={formData.schedule_type} 
                onValueChange={(value: any) => handleChange('schedule_type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule_time">Schedule Time *</Label>
              <Input
                type="time"
                id="schedule_time"
                value={formData.schedule_time}
                onChange={(e) => handleChange('schedule_time', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Time when tests will be executed
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email_recipients">Email Recipients *</Label>
            <Textarea
              id="email_recipients"
              placeholder="Enter email addresses separated by commas (e.g., user1@example.com, user2@example.com)"
              value={formData.email_recipients}
              onChange={(e) => handleChange('email_recipients', e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple emails with commas. These recipients will receive test reports.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleChange('is_active', checked)}
              className='data-[state=checked]:bg-green-900'
            />
            <Label htmlFor="is_active" className={`${formData.is_active ? 'text-green-900' : 'text-gray-500'}`}>
              Active Schedule
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Case Selection</CardTitle>
          <CardDescription>Select test cases from multiple categories to run together</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {categorizedTestCases.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Test Cases by Intervention Category</Label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedTestCases.length} selected across {new Set(selectedTestCases.map(tc => tc.intervention_category)).size} categories
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearAllSelections}
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-96 rounded-md border">
                <div className="p-4 space-y-4">
                  {categorizedTestCases.map((category, categoryIndex) => {
                    const categoryTestCases = category.testCases;
                    const selectedInCategory = categoryTestCases.filter(tc =>
                      selectedTestCases.some(selectedTc => selectedTc.TC_ID === tc.TC_ID)
                    );
                    const allSelected = selectedInCategory.length === categoryTestCases.length;
                    const isCategoryExpanded = expandedCategories.has(category.name);
                    
                    const subCategories = getSubCategories(categoryTestCases);

                    return (
                      <div key={category.name} className="space-y-3">
                        <Collapsible
                          open={isCategoryExpanded}
                          onOpenChange={() => toggleCategory(category.name)}
                          className="border rounded-lg"
                        >
                          <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                {isCategoryExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                            <Checkbox
                              checked={allSelected}
                              onCheckedChange={() => handleCategoryToggle(category)}
                            />
                            <Label className="font-medium flex-1 cursor-pointer">
                              {category.name}
                              <span className="text-muted-foreground ml-2">
                                ({selectedInCategory.length}/{categoryTestCases.length} test cases)
                              </span>
                            </Label>
                            <Badge variant="outline" className="ml-2">
                              {categoryTestCases.length}
                            </Badge>
                          </div>
                          
                          <CollapsibleContent className="p-3 space-y-3">
                            {subCategories.map((subCategory, subIndex) => {
                              const selectedInSubCategory = subCategory.testCases.filter(tc =>
                                selectedTestCases.some(selectedTc => selectedTc.TC_ID === tc.TC_ID)
                              );
                              const allSubSelected = selectedInSubCategory.length === subCategory.testCases.length;
                              const isSubExpanded = expandedCategories.has(`${category.name}-${subCategory.name}`);
                              
                              return (
                                <Collapsible
                                  key={subCategory.name}
                                  open={isSubExpanded}
                                  onOpenChange={() => toggleCategory(`${category.name}-${subCategory.name}`)}
                                  className="ml-4 border rounded-md"
                                >
                                  <div className="flex items-center space-x-2 p-2 bg-background rounded-md">
                                    <CollapsibleTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                        {isSubExpanded ? (
                                          <ChevronDown className="h-3 w-3" />
                                        ) : (
                                          <ChevronRight className="h-3 w-3" />
                                        )}
                                      </Button>
                                    </CollapsibleTrigger>
                                    <Checkbox
                                      checked={allSubSelected}
                                      onCheckedChange={() => handleSubCategoryToggle(subCategory.testCases)}
                                    />
                                    <Label className="text-sm font-medium flex-1 cursor-pointer">
                                      {subCategory.name}
                                      <span className="text-muted-foreground ml-2">
                                        ({selectedInSubCategory.length}/{subCategory.testCases.length})
                                      </span>
                                    </Label>
                                    <Badge 
                                      variant={subCategory.name.includes('Positive') ? 'default' : 'destructive'}
                                      className="text-xs"
                                    >
                                      {subCategory.name.includes('Positive') ? 'Positive' : 'Negative'}
                                    </Badge>
                                  </div>
                                  
                                  <CollapsibleContent className="p-2 space-y-1">
                                    {subCategory.testCases.map((testCase) => {
                                      const isSelected = selectedTestCases.some(
                                        tc => tc.TC_ID === testCase.TC_ID
                                      );
                                      
                                      return (
                                        <div
                                          key={testCase.TC_ID}
                                          className="flex items-center space-x-2 p-2 hover:bg-muted/30 rounded-md ml-4"
                                        >
                                          <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => handleTestCaseToggle(testCase)}
                                          />
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2">
                                              <span className="text-sm font-medium truncate">
                                                {testCase.TC_Name}
                                              </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground truncate">
                                              {testCase.TC_ID} • {testCase.intervention_code}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </CollapsibleContent>
                                </Collapsible>
                              );
                            })}
                          </CollapsibleContent>
                        </Collapsible>
                        
                        {categoryIndex < categorizedTestCases.length - 1 && <Separator />}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environment Selection</CardTitle>
          <CardDescription>Select environments where tests should run</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {environments.map((environment) => (
              <div
                key={environment.id}
                className={`flex items-center space-x-2 p-3 border rounded-md cursor-pointer transition-colors ${
                  environment.selected 
                    ? 'border-green-900 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleEnvironmentToggle(environment.id)}
              >
                <Checkbox
                  checked={environment.selected}
                  onCheckedChange={() => handleEnvironmentToggle(environment.id)}
                />
                <Label className="cursor-pointer flex-1">{environment.name}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1"
          onClick={clearAllSelections}
        >
          Clear All Selections
        </Button>
        <Button 
          type="submit" 
          className="flex-1 bg-green-900 text-white hover:bg-green-800" 
          disabled={isSubmitting || selectedTestCases.length === 0 || !environments.some(env => env.selected)}
        >
          {isSubmitting ? 'Creating Schedule...' : `Create Schedule (${selectedTestCases.length} test cases)`}
        </Button>
      </div>
    </form>
  )
}