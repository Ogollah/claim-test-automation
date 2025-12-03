'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Download, Link } from 'lucide-react'
import Layout from '@/components/Layout/Layout'
import { useAuthSession } from '@/hook/useAuth'
import { Navbar } from '@/components/Layout/navbar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

interface TestDetail {
  testCaseId: string
  category: string
  status: string
  message: string
  requestPayload: string
  responseBody: string
  responseCode: string
  claimId: string
  timestamp: string
}

interface ReportData {
  summary: {
    totalTestCases: number
    passedTestCases: number
    failedTestCases: number
    status: string
    reportTitle: string
  }
  executionId: string
  details: TestDetail[]
}

export default function ReportDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true);
  const { session, isLoading } = useAuthSession();

  useEffect(() => {
    // In a real app, you would fetch the specific report data by ID
    // For now, we'll use the dummy data
    const dummyReportData: ReportData = {
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
        // ... include all other test details from the dummy data
      ]
    }
    
    setReportData(dummyReportData)
    setLoading(false)
  }, [params.id])

  const exportToExcel = () => {
    if (!reportData) return

    try {
      const headers = ['Test Case ID', 'Category', 'Status', 'Message', 'Request Payload', 'Response Body', 'Response Code', 'Claim ID', 'Timestamp'];
      
      // Summary section
      const summaryContent = [
        ['Test Execution Report'],
        [''],
        ['Summary'],
        [`Total Test Cases: ${reportData.summary.totalTestCases}`],
        [`Passed Test Cases: ${reportData.summary.passedTestCases}`],
        [`Failed Test Cases: ${reportData.summary.failedTestCases}`],
        [`Overall Status: ${reportData.summary.status}`],
        [`Report Title: ${reportData.summary.reportTitle}`],
        [`Execution ID: ${reportData.executionId}`],
        [''],
        ['Detailed Test Results'],
        headers.join(',')
      ];

      // Detailed test results
      const detailsContent = reportData.details.map((test) => [
        test.testCaseId,
        `"${test.category}"`,
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
      link.setAttribute('download', `test-report-${reportData.executionId}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error exporting report. Please try again.');
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Report Not Found</h2>
          <Button onClick={() => router.back()} className="bg-green-900 text-white">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Layout session={session}>
        <Navbar title="Test Automation Dashboard" />
        <div className="p-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-green-900">Test Automation Dashboard</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
        </div>
            <div className="mx-auto p-6 bg-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="bg-green-900 text-white hover:bg-green-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button> */}
          <div>
            <h1 className="text-3xl font-bold text-green-900">{reportData.summary.reportTitle}</h1>
            <p className="text-gray-600">Execution ID: {reportData.executionId}</p>
          </div>
        </div>
        <Button 
          onClick={exportToExcel}
          className="bg-green-900 text-white hover:bg-green-800"
        >
          <Download className="h-4 w-4 mr-2" />
          Export to Excel
        </Button>
      </div>

      {/* Summary Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-green-900">Execution Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{reportData.summary.totalTestCases}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-green-50">
              <div className="text-2xl font-bold text-green-900">{reportData.summary.passedTestCases}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-red-50">
              <div className="text-2xl font-bold text-red-900">{reportData.summary.failedTestCases}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Badge 
                className={reportData.summary.status === 'Pass' ? 'bg-green-900 text-white text-lg px-4 py-2' : 'bg-red-900 text-white text-lg px-4 py-2'}
              >
                {reportData.summary.status}
              </Badge>
              <div className="text-sm text-gray-600 mt-2">Overall Status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-900">Test Case Details</CardTitle>
          <CardDescription>
            Detailed results for each test case execution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Case ID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Response Code</TableHead>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.details.map((test) => (
                  <TableRow key={test.testCaseId}>
                    <TableCell className="font-medium">{test.testCaseId}</TableCell>
                    <TableCell className="max-w-[300px]">
                      <div title={test.category} className="truncate">
                        {test.category}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={test.status === 'Pass' ? 'bg-green-900 text-white' : 'bg-red-900 text-white'}
                      >
                        {test.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{test.message}</TableCell>
                    <TableCell>{test.responseCode}</TableCell>
                    <TableCell>{test.claimId}</TableCell>
                    <TableCell>{test.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
    </Layout>

  )
}