'use client';

import { useState, useEffect } from 'react';
import { FileText, CheckCircle2, XCircle, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface Job {
    id: string;
    status: 'processing' | 'completed' | 'failed';
    totalClaims: number;
    processedClaims: number;
    successfulClaims: number;
    failedClaims: number;
    startTime: string;
    endTime?: string;
    resultFilePath?: string;
}

interface BulkClaimsHistoryProps {
    refreshTrigger?: number;
}

export default function BulkClaimsHistory({ refreshTrigger = 0 }: BulkClaimsHistoryProps) {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadJobs();
    }, [refreshTrigger]);

    const loadJobs = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/claims/bundle/bulk/jobs`);
            const result = await response.json();

            if (result.success) {
                setJobs(result.jobs);
            } else {
                toast.error('Failed to load jobs');
            }
        } catch (error) {
            console.error('Error loading jobs:', error);
            toast.error('Error loading jobs');
        } finally {
            setLoading(false);
        }
    };

    const downloadResults = async (jobId: string) => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/claims/bundle/bulk/results/${jobId}`);

            if (!response.ok) {
                throw new Error('Download failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `claim_results_${jobId}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Downloaded successfully!');
        } catch (error) {
            console.error('Error downloading results:', error);
            toast.error('Download failed');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'processing': return <AlertCircle className="w-5 h-5 text-blue-600" />;
            case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
            case 'failed': return <XCircle className="w-5 h-5 text-red-600" />;
            default: return <FileText className="w-5 h-5 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading && jobs.length === 0) {
        return (
            <div className="bg-white rounded-sm shadow-md p-6 mb-8 max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-green-900">Bulk Claims History</h1>
                    </div>
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-3">
            <div className="bg-white rounded-sm shadow-md p-6 mb-8 max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-green-900">Bulk Claims History</h1>
                    </div>
                    <Button
                        onClick={loadJobs}
                        variant="outline"
                        className="bg-green-900 text-white hover:bg-green-700 hover:text-white"
                    >
                        {`${loading ? `Refreshing...` : `Refresh`}`}
                    </Button>
                </div>

                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <Table className="min-w-full divide-y divide-gray-200">
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Job ID
                                </TableHead>
                                <TableHead scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </TableHead>
                                <TableHead scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Progress
                                </TableHead>
                                <TableHead scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Results
                                </TableHead>
                                <TableHead scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Started
                                </TableHead>
                                <TableHead scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-white divide-y divide-gray-200">
                            {jobs.map((job) => (
                                <TableRow key={job.id} className="hover:bg-gray-50">
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {job.id.slice(0, 8)}...
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {getStatusIcon(job.status)}
                                            <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {job.processedClaims} / {job.totalClaims}
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                            <div
                                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: job.totalClaims > 0
                                                        ? `${(job.processedClaims / job.totalClaims) * 100}%`
                                                        : '0%'
                                                }}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex space-x-4">
                                            <div className="text-green-600">
                                                ✓ {job.successfulClaims}
                                            </div>
                                            <div className="text-red-600">
                                                ✗ {job.failedClaims}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(job.startTime)}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {job.status === 'completed' && (
                                            <Button
                                                onClick={() => downloadResults(job.id)}
                                                className="inline-flex items-center bg-green-900 hover:bg-green-700 text-white"
                                                disabled={loading}
                                            >
                                                <Download className="w-4 h-4 mr-1" />
                                                {loading ? `Downloading...` : `Download`}
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {jobs.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by uploading a bulk claims file.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}