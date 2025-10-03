'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle2, XCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import BulkClaimsHistory from './History';

interface JobStatus {
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

export default function BulkClaimsPage() {
    const [isUploading, setIsUploading] = useState(false);
    const [currentJob, setCurrentJob] = useState<JobStatus | null>(null);
    const [uploadError, setUploadError] = useState<string>('');
    const [isDev, setIsDev] = useState(false);
    const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);
    const [loading, setLoading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            toast.error('Please upload an Excel file')
            setUploadError('Please upload an Excel file (.xlsx or .xls)');
            return;
        }

        await uploadFile(file);
    }, [isDev]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls']
        },
        multiple: false
    });

    const uploadFile = async (file: File) => {
        setIsUploading(true);
        setUploadError('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('isDev', isDev.toString());
        formData.append('batchSize', '1000');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/claims/bundle/bulk/upload`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                toast.success('File uploaded successfully!');
                setCurrentJob({
                    id: result.jobId,
                    status: 'processing',
                    totalClaims: 0,
                    processedClaims: 0,
                    successfulClaims: 0,
                    failedClaims: 0,
                    startTime: new Date().toISOString(),
                });

                // Trigger history refresh
                setHistoryRefreshTrigger(prev => prev + 1);

                // Start polling for status
                startPolling(result.jobId);
            } else {
                setUploadError(result.message || 'Upload failed');
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
            setUploadError('Network error. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const startPolling = (jobId: string) => {
        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/claims/bundle/bulk/status/${jobId}`);
                const result = await response.json();

                if (result.success) {
                    setCurrentJob(result.job);

                    setHistoryRefreshTrigger(prev => prev + 1);

                    if (result.job.status === 'completed' || result.job.status === 'failed') {
                        clearInterval(pollInterval);
                    }
                }
            } catch (error) {
                toast.error('Error polling job status:');
                console.error('Error polling job status:', error);
            }
        }, 3000);
    };

    const downloadResults = async () => {
        if (!currentJob?.resultFilePath) return;

        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/claims/bundle/bulk/results/${currentJob.id}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `claim_results_${currentJob.id}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Downloaded succefully!');
        } catch (error) {
            console.error('Error downloading results:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'processing': return 'text-blue-600';
            case 'completed': return 'text-green-600';
            case 'failed': return 'text-red-600';
            default: return 'text-gray-600';
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

    return (
        <div className="py-3">
            <div className="bg-white rounded-sm shadow-md p-6 mb-8 max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className=" mb-8">
                    <h1 className="text-3xl font-bold text-green-900 mb-2">
                        Bulk Claims Processing
                    </h1>
                    <p className="text-lg text-gray-600">
                        Upload Excel file with claim data for bulk processing
                    </p>
                </div>
                {/* Environment Toggle */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Environment</h3>
                            <p className="text-sm text-gray-500">Select the target environment for claim submission</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className={`text-sm ${!isDev ? 'text-green-900 font-medium' : 'text-gray-500'}`}>
                                QA
                            </span>
                            <button
                                type="button"
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-900 focus:ring-offset-2 ${isDev ? 'bg-green-900' : 'bg-gray-200'
                                    }`}
                                onClick={() => setIsDev(!isDev)}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isDev ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                />
                            </button>
                            <span className={`text-sm ${isDev ? 'text-green-900 font-medium' : 'text-gray-500'}`}>
                                Development
                            </span>
                        </div>
                    </div>
                </div>

                {/* Upload Area */}
                <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-8 mb-6">
                    <div
                        {...getRootProps()}
                        className={`text-center cursor-pointer transition-colors duration-200 ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                            }`}
                    >
                        <Input {...getInputProps()} />
                        <Upload className="mx-auto h-12 w-12 text-green-900 " />
                        <div className="mt-4">
                            <p className="text-lg font-medium text-green-900">
                                {isDragActive ? 'Drop the file here' : 'Upload Excel File'}
                            </p>
                            <p className="mt-2 text-sm text-gray-600">
                                Drag and drop your Excel file here, or click to browse
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Supports .xlsx, .xls files up to 50MB
                            </p>
                        </div>
                    </div>

                    {uploadError && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                            <div className="flex items-center">
                                <XCircle className="w-5 h-5 text-red-400 mr-2" />
                                <p className="text-sm text-red-700">{uploadError}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Current Job Status */}
                {currentJob && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Processing Status</h3>
                            <div className="flex items-center">
                                {getStatusIcon(currentJob.status)}
                                <span className={`ml-2 text-sm font-medium ${getStatusColor(currentJob.status)}`}>
                                    {currentJob.status.charAt(0).toUpperCase() + currentJob.status.slice(1)}
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Progress</span>
                                <span>
                                    {currentJob.processedClaims} / {currentJob.totalClaims} claims
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: currentJob.totalClaims > 0
                                            ? `${(currentJob.processedClaims / currentJob.totalClaims) * 100}%`
                                            : '0%'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="flex items-center">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                                    <span className="text-sm font-medium text-green-800">Successful</span>
                                </div>
                                <p className="text-2xl font-bold text-green-900 mt-1">
                                    {currentJob.successfulClaims}
                                </p>
                            </div>

                            <div className="bg-red-50 p-4 rounded-lg">
                                <div className="flex items-center">
                                    <XCircle className="w-5 h-5 text-red-600 mr-2" />
                                    <span className="text-sm font-medium text-red-800">Failed</span>
                                </div>
                                <p className="text-2xl font-bold text-red-900 mt-1">
                                    {currentJob.failedClaims}
                                </p>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center">
                                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                                    <span className="text-sm font-medium text-blue-800">Remaining</span>
                                </div>
                                <p className="text-2xl font-bold text-blue-900 mt-1">
                                    {currentJob.totalClaims - currentJob.processedClaims}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        {currentJob.status === 'completed' && currentJob.resultFilePath && (
                            <div className="flex justify-end">
                                <Button
                                    disabled={loading}
                                    onClick={downloadResults}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-900 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    {loading ? `Downloading` : `Download Results`}
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* RELOAD EVERYTIME THERE IS PROGRESS */}
                <BulkClaimsHistory refreshTrigger={historyRefreshTrigger} />
            </div>
        </div>
    );
}