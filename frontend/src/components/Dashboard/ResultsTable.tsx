import { TestResult } from '@/lib/types';
import { CheckCircleIcon, XCircleIcon, ChevronDownIcon, ChevronRightIcon, ArrowDownTrayIcon, ClipboardIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Minus, RefreshCcwIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ResultsTableProps {
  results: TestResult[];
  onRefresh?: (claimId: string, test?: string) => Promise<void>;
}

export default function ResultsTable({ results, onRefresh }: ResultsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [expandedPayloads, setExpandedPayloads] = useState<Record<string, {
    request: boolean;
    response: boolean;
    error?: boolean;
  }>>({});

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const [refreshingIds, setRefreshingIds] = useState<Record<string, boolean>>({});

  const togglePayload = (id: string, type: 'request' | 'response' | 'error') => {
    setExpandedPayloads(prev => ({
      ...prev,
      [id]: { ...prev[id], [type]: !prev[id]?.[type] }
    }));
  };

  const handleRefresh = async (resultId: string, claimId: string, test?: string) => {
    if (!onRefresh) return;

    try {
      setRefreshingIds(prev => ({ ...prev, [resultId]: true }));
      await onRefresh(claimId, test);
    } finally {
      setRefreshingIds(prev => ({ ...prev, [resultId]: false }));
    }
  };

  const downloadPayload = (content: any, filename: string) => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyPayload = (content: any) => {
    const textToCopy = JSON.stringify(content, null, 2);
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast.success('Payload copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy payload');
      });
  };

  const getStatusClasses = (status: string, outcome?: string) => {
    if (status === 'passed') return 'bg-green-100 text-green-800';
    if (status === 'failed' && outcome === 'Pending') return 'bg-yellow-100 text-yellow-800';
    if (status === 'failed') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Test type
            </TableHead>
            <TableHead scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Use
            </TableHead>
            <TableHead scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </TableHead>
            <TableHead scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Timestamp
            </TableHead>
            <TableHead scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Details
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          {results.map((result) => (
            <>
              <TableRow key={result.id} className="hover:bg-gray-50">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                  {result.name}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result?.use || 'N/A'}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-start">
                    <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusClasses(result.status, result.outcome)}`}>
                      {result.status === 'passed' ? (
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                      ) : result.status === 'failed' && result.outcome !== 'Pending' ? (
                        <XCircleIcon className="h-4 w-4 mr-1" />
                      ) : result.outcome === 'Pending' && result.status === 'failed' ? (
                        <Button
                          variant="link"
                          onClick={() => handleRefresh(result.id, result.claimId ?? '', result.test)}
                          size="sm"
                          disabled={refreshingIds[result.id]}
                          className="h-4 w-4 p-0 mr-1"
                        >
                          <RefreshCcwIcon className={`h-4 w-4 ${refreshingIds[result.id] ? 'text-orange-500 animate-spin' : 'text-orange-400'}`} />
                        </Button>
                      ) : (
                        <Minus className="h-4 w-4 mr-1" />
                      )}
                      {result.outcome !== 'Pending' ? (
                        result.status.toUpperCase()
                      ) : (
                        <span className="text-orange-400">{refreshingIds[result.id] ? 'Refreshing...' : 'PENDING'}</span>
                      )}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.duration}ms
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(result.timestamp).toLocaleString()}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Button
                    onClick={() => toggleRow(result.id)}
                    className="text-blue-600 bg-gray-50 hover:bg-gray-100 hover:text-blue-900 flex items-center"
                  >
                    {expandedRows[result.id] ? (
                      <>
                        <ChevronDownIcon className="h-5 w-5 mr-1" />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronRightIcon className="h-5 w-5 mr-1" />
                        Show
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
              {expandedRows[result.id] && (
                <TableRow>
                  <TableCell colSpan={6} className="px-6 py-4 bg-gray-50">
                    <div className="space-y-4">
                      <div className="border rounded-lg overflow-hidden">
                        <div className="flex justify-between items-center bg-gray-100 p-3">
                          <div className="flex items-center">
                            <Button
                              onClick={() => togglePayload(result.id, 'request')}
                              className="flex items-center bg-gray-100 text-gray-700 hover:text-gray-500 hover:bg-100"
                            >
                              {expandedPayloads[result.id]?.request ? (
                                <ChevronDownIcon className="h-5 w-5 mr-2" />
                              ) : (
                                <ChevronRightIcon className="h-5 w-5 mr-2" />
                              )}
                              <span className="font-medium">Request Payload</span>
                            </Button>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => downloadPayload(result.details.request, `${result.id}-request.json`)}
                              className="flex items-center bg-gray-50 text-blue-600 hover:bg-gray-200 hover:text-blue-800 text-sm"
                            >
                              <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button
                              onClick={() => copyPayload(result.details.request)}
                              className="flex items-center bg-gray-100 text-gray-500 hover:text-gray-500 hover:bg-100 hover:text-gray-900 text-sm"
                            >
                              <ClipboardIcon className="h-4 w-4 mr-1" />
                              Copy
                            </Button>
                          </div>
                        </div>
                        {expandedPayloads[result.id]?.request && (
                          <pre className="mt-1 bg-white text-xs whitespace-pre-wrap break-words overflow-hidden">
                            {JSON.stringify(result.details.request, null, 2)}
                          </pre>
                        )}
                      </div>

                      {result.details.response && (
                        <>
                          <div className="border rounded-lg overflow-autto ">
                            <div className="flex justify-between items-center bg-gray-100 p-3">
                              <div className="flex items-center">
                                <Button
                                  onClick={() => togglePayload(result.id, 'response')}
                                  className="flex items-center bg-gray-100 text-gray-700 hover:text-gray-500 hover:bg-100"
                                >
                                  {expandedPayloads[result.id]?.response ? (
                                    <ChevronDownIcon className="h-5 w-5 mr-2" />
                                  ) : (
                                    <ChevronRightIcon className="h-5 w-5 mr-2" />
                                  )}
                                  <span className="font-medium">Submited payload</span>
                                </Button>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => downloadPayload(result.details.fhirBundle, `${result.id}-response.json`)}
                                  className="flex items-center bg-gray-50 text-blue-600 hover:bg-gray-200 hover:text-blue-800 text-sm"
                                >
                                  <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                                <Button
                                  onClick={() => copyPayload(result.details.fhirBundle)}
                                  className="flex items-center bg-gray-100 text-gray-500 hover:text-gray-500 hover:bg-100 hover:text-gray-900 text-sm"
                                >
                                  <ClipboardIcon className="h-4 w-4 mr-1" />
                                  Copy
                                </Button>
                              </div>
                            </div>
                            {expandedPayloads[result.id]?.response && (
                              <pre className="p-3 bg-white text-xs overflow-hiden">
                                {JSON.stringify(result.details.fhirBundle, null, 2)}
                              </pre>
                            )}
                          </div>

                          <div className="bg-gray-100 p-3 rounded-lg">
                            <div className='flex  item-center justify-between p-3'>
                              <h4 className="text-sm font-medium text-gray-500 mb-2">Response Summary</h4>
                              {result?.claimId && (
                                <Button
                                  onClick={() => handleRefresh(result.id, result.claimId ?? '', result.test)}
                                  className={`bg-gray-100 hover:bg-gree-200 ${refreshingIds[result.id] ? 'text-orange-500' : 'text-green-500'} hover:text-green-600`}
                                  size="sm"
                                  disabled={refreshingIds[result.id]}
                                >
                                  <RefreshCcwIcon className={`h-4 w-4 mr-1 ${refreshingIds[result.id] ? 'text-orange-500 animate-spin' : 'text-green-600'}`} />
                                  {refreshingIds[result.id] ? 'Refreshing...' : 'Refresh'}
                                </Button>
                              )}
                            </div>
                            <div className={`${result.status === 'passed' ? 'bg-white p-3 text-green-500' : 'bg-red-50 text-red-500'} p-3 rounded text-xs`}>
                              <div className="mb-1 p-2"><span className="font-medium">Message:</span> {result?.message}</div>
                              {result?.claimId && (
                                <div className="mb-1 p-2"><span className="font-medium">Claim ID:</span> {result?.claimId}</div>
                              )}
                              <div className='p-2'><span className="font-medium">Outcome:</span> {result.outcome}</div>
                            </div>
                          </div>
                        </>
                      )}

                      {result.details.error && (
                        <div className="border border-red-100 rounded-lg overflow-hidden">
                          <div className="flex justify-between items-center bg-red-50 p-3">
                            <Button
                              onClick={() => togglePayload(result.id, 'error')}
                              variant="ghost"
                              className="text-red-700 hover:bg-red-100"
                            >
                              {expandedPayloads[result.id]?.error ? (
                                <ChevronDownIcon className="h-5 w-5 mr-2" />
                              ) : (
                                <ChevronRightIcon className="h-5 w-5 mr-2" />
                              )}
                              <span className="font-medium">Error Details</span>
                            </Button>
                          </div>
                          {expandedPayloads[result.id]?.error && (
                            <pre className="p-3 bg-white text-red-600 text-xs whitespace-pre-wrap break-words">
                              {result.details.error}
                            </pre>
                          )}
                        </div>
                      )}

                      {result.details.validationErrors && result.details.validationErrors.length > 0 && (
                        <div className="bg-red-50 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-red-700">Validation Errors</h4>
                          <ul className="mt-1 space-y-1">
                            {result.details.validationErrors.map((error: any, index: any) => (
                              <li key={index} className="text-sm text-red-600">
                                <span className="font-medium">{error.path}:</span> {error.error}
                              </li>
                            ))}
                            {result.details?.error && (
                              <li className="text-sm text-red-600">
                                <span className="font-medium">Error:</span> {result.details.error}
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}