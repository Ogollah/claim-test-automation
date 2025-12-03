// app/dashboard/components/TestResults.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Filter, Download, Eye } from 'lucide-react'
import { getReportResults } from '@/lib/api';
import { ReportResult } from '@/lib/types'
import { useRouter } from 'next/navigation'

interface ReportProps {
  compact?: boolean;
  refreshKey?: number;
}

// Dummy data structure matching your requirements
const dummyData = {
  summary: {
    totalTestCases: 12,
    passedTestCases: 3,
    failedTestCases: 9,
    status: "Fail",
    reportTitle: "Palliative Care Test Execution Summary"
  },
  executionId: "exec-1764066853",
  details: [
    {
      testCaseId: "5",
      category: "Palliative Care Claim Validation - Claim Validation [Positive] Valid Facility & Tariff",
      status: "Pass",
      message: "Success",
      requestPayload: "N/A",
      responseBody: "N/A",
      responseCode: "N/A",
      claimId: "N/A",
      timestamp: "N/A"
    },
    {
      testCaseId: "4",
      category: "Palliative Care Claim Validation - Claim Validation [Positive] Tariff Below Allowed",
      status: "Fail",
      message: "Status code mismatch",
      requestPayload: "N/A",
      responseBody: "N/A",
      responseCode: "N/A",
      claimId: "N/A",
      timestamp: "4:04:23 pm"
    },
    {
      testCaseId: "2",
      category: "Palliative Care Claim Validation - Claim Validation [Positive] Tariff Below Allowed",
      status: "Fail",
      message: "Status code mismatch",
      requestPayload: "N/A",
      responseBody: "N/A",
      responseCode: "N/A",
      claimId: "N/A",
      timestamp: "4:04:24 pm"
    },
    {
      testCaseId: "1",
      category: "Palliative Care Claim Validation - Claim Validation [Positive] Tariff Below Allowed",
      status: "Fail",
      message: "Status code mismatch",
      requestPayload: "N/A",
      responseBody: "N/A",
      responseCode: "N/A",
      claimId: "N/A",
      timestamp: "4:04:27 pm"
    },
    {
      testCaseId: "8",
      category: "Palliative Care Claim Validation - Claim Validation [Positive] Tariff Below Allowed",
      status: "Pass",
      message: "Success",
      requestPayload: "N/A",
      responseBody: "N/A",
      responseCode: "N/A",
      claimId: "N/A",
      timestamp: "N/A"
    },
    {
      testCaseId: "9",
      category: "Palliative Care Claim Validation - Claim Validation [Negative] Tariff Above Allowed",
      status: "Fail",
      message: "Status code mismatch",
      requestPayload: "N/A",
      responseBody: "N/A",
      responseCode: "N/A",
      claimId: "N/A",
      timestamp: "4:04:23 pm"
    },
    {
      testCaseId: "3",
      category: "Palliative Care Claim Validation - Claim Validation [Positive] Valid Facility & Tariff",
      status: "Fail",
      message: "Status code mismatch",
      requestPayload: "N/A",
      responseBody: "N/A",
      responseCode: "N/A",
      claimId: "N/A",
      timestamp: "4:04:28 pm"
    },
    {
      testCaseId: "10",
      category: "Palliative Care Claim Validation - Claim Validation [Negative] Tariff Above Allowed",
      status: "Fail",
      message: "Status code mismatch",
      requestPayload: "N/A",
      responseBody: "N/A",
      responseCode: "N/A",
      claimId: "N/A",
      timestamp: "4:04:20 pm"
    },
    {
      testCaseId: "7",
      category: "Palliative Care Claim Validation - Claim Validation [Positive] Valid Facility & Tariff",
      status: "Fail",
      message: "Status code mismatch",
      requestPayload: "N/A",
      responseBody: "N/A",
      responseCode: "N/A",
      claimId: "N/A",
      timestamp: "4:04:20 pm"
    },
    {
      testCaseId: "6",
      category: "Palliative Care Claim Validation - Claim Validation [Positive] Valid Facility & Tariff",
      status: "Fail",
      message: "Status code mismatch",
      requestPayload: "N/A",
      responseBody: "N/A",
      responseCode: "N/A",
      claimId: "N/A",
      timestamp: "4:04:24 pm"
    },
    {
      testCaseId: "11",
      category: "Palliative Care Claim Validation - Claim Validation [Negative] Tariff Above Allowed",
      status: "Fail",
      message: "Status code mismatch",
      requestPayload: "N/A",
      responseBody: "N/A",
      responseCode: "N/A",
      claimId: "N/A",
      timestamp: "4:04:23 pm"
    }
  ]
};

// Convert dummy data to ReportResult format
const convertDummyToReportResult = (): ReportResult => ({
  id: parseInt(dummyData.executionId.replace('exec-', '')),
  name: dummyData.summary.reportTitle,
  number_of_tests: dummyData.summary.totalTestCases,
  number_passed: dummyData.summary.passedTestCases,
  number_failed: dummyData.summary.failedTestCases,
  test_details: JSON.stringify(dummyData),
  is_email_sent: false,
  created_at: new Date().toISOString()
});

const defaultResult: Partial<ReportResult> = {
  id: 0,
  name: 'Unknown Report',
  number_of_tests: 12,
  number_passed: 10,
  number_failed: 2,
  test_details: '',
  is_email_sent: false,
  created_at: new Date().toISOString()
};

// Function to export report to Excel
const exportToExcel = (result: ReportResult) => {
  try {
    const testDetails = typeof result.test_details === 'string' 
      ? JSON.parse(result.test_details) 
      : result.test_details;

    // Create CSV content
    const headers = ['Test Case ID', 'Category', 'Status', 'Message', 'Request Payload', 'Response Body', 'Response Code', 'Claim ID', 'Timestamp'];
    
    // Summary section
    const summaryContent = [
      ['Test Execution Report'],
      [''],
      ['Summary'],
      [`Total Test Cases: ${testDetails.summary.totalTestCases}`],
      [`Passed Test Cases: ${testDetails.summary.passedTestCases}`],
      [`Failed Test Cases: ${testDetails.summary.failedTestCases}`],
      [`Overall Status: ${testDetails.summary.status}`],
      [`Report Title: ${testDetails.summary.reportTitle}`],
      [`Execution ID: ${testDetails.executionId}`],
      [''],
      ['Detailed Test Results'],
      headers.join(',')
    ];

    // Detailed test results
    const detailsContent = testDetails.details.map((test: any) => [
      test.testCaseId,
      `"${test.category}"`, // Wrap in quotes to handle commas in category
      test.status,
      `"${test.message}"`,
      `"${test.requestPayload}"`,
      `"${test.responseBody}"`,
      test.responseCode,
      test.claimId,
      test.timestamp
    ].join(','));

    const csvContent = [...summaryContent, ...detailsContent].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `test-report-${testDetails.executionId}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Error exporting report. Please try again.');
  }
};

export default function Reports({ compact = false, refreshKey }: ReportProps) {
  const [results, setResults] = useState<ReportResult[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchResults()
  }, [refreshKey])

  const fetchResults = async () => {
    try {
      setLoading(true)
      const response = await getReportResults()
    
      if (Array.isArray(response) && response.length > 0) {
        setResults(response)
      } else {
        // Use dummy data when no data is returned
        console.log('No data returned from API, using dummy data')
        setResults([convertDummyToReportResult()])
      }
    } catch (error) {
      console.error('Failed to fetch results:', error)
      // Use dummy data on error as well
      setResults([convertDummyToReportResult()])
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (result: ReportResult) => {
    // Navigate to detailed report view
    router.push(`/schedule/${result.id}`)
  }

  const handleExportReport = (result: ReportResult) => {
    exportToExcel(result)
  }

  // Safe result access with fallbacks
  const getSafeResult = (result: ReportResult) => ({
    id: result?.id ?? defaultResult.id!,
    name: result?.name ?? defaultResult.name!,
    number_of_tests: result?.number_of_tests ?? defaultResult.number_of_tests!,
    number_passed: result?.number_passed ?? defaultResult.number_passed!,
    number_failed: result?.number_failed ?? defaultResult.number_failed!,
    test_details: result?.test_details ?? defaultResult.test_details!,
    is_email_sent: result?.is_email_sent ?? defaultResult.is_email_sent!,
    created_at: result?.created_at ?? defaultResult.created_at!
  })

  const filteredResults = results
    .map(result => getSafeResult(result))
    .filter(result => {
      const matchesFilter = filter === 'all' || 
        (filter === 'unsent' && !result.is_email_sent)
      
      const matchesSearch = 
        result.name.toLowerCase().includes(search.toLowerCase()) ||
        result.is_email_sent
      
      return matchesFilter && matchesSearch
    })

  if (loading) {
    if (compact) {
      return (
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-1 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
          </div>
          <div className="border rounded-lg">
            <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div>
            <CardTitle className='text-green-900'>Test Reports</CardTitle>
            <CardDescription>
              View and manage test execution reports
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter results" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="unsent">Unsent Emails</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Total Tests</TableHead>
                <TableHead>Passed</TableHead>
                <TableHead>Failed</TableHead>
                <TableHead>Email Sent</TableHead>
                <TableHead>Execution Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">{result.name}</TableCell>
                  <TableCell>{result.number_of_tests}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className='bg-green-900 text-white'>
                      {result.number_passed}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className='bg-red-900 text-white'>
                      {result.number_failed || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={result.is_email_sent ? "default" : "secondary"} 
                      className={result.is_email_sent ? 'bg-green-900' : 'bg-yellow-500 text-white'}
                    >
                      {result.is_email_sent ? 'Sent' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(result.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(result)}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleExportReport(result)}
                        className="bg-green-900 text-white hover:bg-green-800"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredResults.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            No report results found!
          </div>
        )}
      </CardContent>
    </Card>
  )
}