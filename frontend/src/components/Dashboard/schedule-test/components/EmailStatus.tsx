// app/dashboard/components/EmailStatus.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mail, CheckCircle, XCircle, Clock, Send } from 'lucide-react'
import { toast } from 'sonner'
import { sendPendingReportEmails, getReportTestResults, markEmailSent } from '@/lib/api'
import { ReportTestResult } from '@/lib/types'

interface EmailStatusProps {
  refreshKey?: number;
  onEmailSent?: () => void;
}

// Transform ReportTestResult to EmailStatus format
const transformToEmailStatus = (results: ReportTestResult[]) => {
  return results.flatMap(result => 
    result.email_recipients?.map(recipient => ({
      id: result.id,
      testcase_name: result.testcase_name || 'Unknown Test',
      intervention_name: result.intervention_name || 'Unknown Intervention',
      result_status: result.result_status ?? -1,
      is_email_sent: result.is_email_sent || false,
      email_sent_at: result.email_sent_at || null,
      recipient: recipient,
      created_at: result.created_at || new Date().toISOString()
    })) || [{
      id: result.id,
      testcase_name: result.testcase_name || 'Unknown Test',
      intervention_name: result.intervention_name || 'Unknown Intervention',
      result_status: result.result_status ?? -1,
      is_email_sent: result.is_email_sent || false,
      email_sent_at: result.email_sent_at || null,
      recipient: 'No recipient',
      created_at: result.created_at || new Date().toISOString()
    }]
  )
}

export default function EmailStatus({ refreshKey, onEmailSent }: EmailStatusProps) {
  const [emails, setEmails] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sendingAll, setSendingAll] = useState(false)
  const [sendingSingle, setSendingSingle] = useState<number | null>(null)

  useEffect(() => {
    fetchEmailStatus()
  }, [refreshKey])

  const fetchEmailStatus = async () => {
    try {
      setLoading(true)
      const response = await getReportTestResults()
      
      if (Array.isArray(response)) {
        const emailStatuses = transformToEmailStatus(response)
        setEmails(emailStatuses)
      } else {
        console.warn('Invalid response format:', response)
        setEmails([])
        // toast.error("Invalid data format received.")
      }
    } catch (error) {
      console.error('Failed to fetch email status:', error)
      toast.error("Failed to load email status.")
      setEmails([])
    } finally {
      setLoading(false)
    }
  }

  const sendAllPendingEmails = async () => {
    try {
      setSendingAll(true)
      const pendingEmails = emails.filter(email => !email.is_email_sent)
      
      if (pendingEmails.length === 0) {
        toast.info("No pending emails to send.")
        return
      }

      const result = await sendPendingReportEmails()
      
      // Refresh the data to get actual server state
      await fetchEmailStatus()
      
      toast.success(`Successfully sent ${result?.sentCount || pendingEmails.length} pending email(s).`)
      onEmailSent?.()
    } catch (error: any) {
      console.error('Failed to send pending emails:', error)
      const errorMessage = error.response?.data?.message || "Failed to send pending emails."
      toast.error(errorMessage)
    } finally {
      setSendingAll(false)
    }
  }

  const sendSingleEmail = async (emailId: number) => {
    try {
      setSendingSingle(emailId)
      
      // Mark the specific email as sent
      await markEmailSent(emailId)
      
      // Update local state
      setEmails(prev => prev.map(email => 
        email.id === emailId ? { 
          ...email, 
          is_email_sent: true, 
          email_sent_at: new Date().toISOString() 
        } : email
      ))

      toast.success("Test result email has been sent successfully.")
      onEmailSent?.()
    } catch (error: any) {
      console.error('Failed to send email:', error)
      const errorMessage = error.response?.data?.message || "Failed to send email."
      toast.error(errorMessage)
    } finally {
      setSendingSingle(null)
    }
  }

  const filteredEmails = emails.filter(email => {
    switch (filter) {
      case 'sent': return email.is_email_sent
      case 'pending': return !email.is_email_sent
      default: return true
    }
  })

  const pendingCount = emails.filter(email => !email.is_email_sent).length

  const getStatusIcon = (isSent: boolean) => {
    return isSent ? 
      <CheckCircle className="h-4 w-4 text-green-900" /> : 
      <Clock className="h-4 w-4 text-yellow-600" />
  }

  const getStatusBadge = (isSent: boolean) => {
    return isSent ? 
      <Badge variant="default" className='bg-green-900'>Sent</Badge> : 
      <Badge variant="secondary" className='bg-yellow-600 text-white'>Pending</Badge>
  }

  const getResultBadge = (status: number) => {
    switch (status) {
      case 1: 
        return <Badge variant="default" className='bg-green-900'>Passed</Badge>
      case 0: 
        return <Badge variant="destructive" className='bg-red-600'>Failed</Badge>
      default: 
        return <Badge variant="outline" className='bg-gray-500'>Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-10 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
            <div className="border rounded-lg">
              <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div>
              <CardTitle className='text-green-900'>Email Status</CardTitle>
              <CardDescription>
                Monitor and manage test result email delivery
              </CardDescription>
            </div>
            <Button 
              onClick={sendAllPendingEmails} 
              disabled={pendingCount === 0 || sendingAll}
              className='bg-green-900 hover:bg-green-800 text-white'
            >
              <Send className="h-4 w-4 mr-2" />
              {sendingAll ? 'Sending...' : `Send All Pending (${pendingCount})`}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <Mail className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter emails" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Emails</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Test Case</TableHead>
                  <TableHead>Intervention</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmails.map((email) => (
                  <TableRow key={`${email.id}-${email.recipient}`}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(email.is_email_sent)}
                        {getStatusBadge(email.is_email_sent)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{email.testcase_name}</TableCell>
                    <TableCell>{email.intervention_name}</TableCell>
                    <TableCell>{getResultBadge(email.result_status)}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={email.recipient}>
                      {email.recipient}
                    </TableCell>
                    <TableCell>
                      {email.email_sent_at ? 
                        new Date(email.email_sent_at).toLocaleString() : 
                        'Not sent'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      {!email.is_email_sent && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => sendSingleEmail(email.id)}
                          disabled={sendingSingle === email.id}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          {sendingSingle === email.id ? 'Sending...' : 'Send'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredEmails.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              No emails found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emails.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {emails.filter(e => 
                e.is_email_sent && 
                e.email_sent_at && 
                new Date(e.email_sent_at).toDateString() === new Date().toDateString()
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">Today's deliveries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting delivery</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}