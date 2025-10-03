import { TestResult } from '@/lib/types';
import { CheckCircleIcon, XCircleIcon, ChevronDownIcon, ChevronRightIcon, ArrowDownTrayIcon, ClipboardIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Minus, RefreshCcwIcon } from 'lucide-react';
import { toast } from 'sonner';
import TestResultsReport from './result/TestResultsReport';
import { CLAIM_STATUS } from '@/lib/utils';

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
  const [showSummary, setShowSummary] = useState<boolean>(true);

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
  const passingOutcomes = [CLAIM_STATUS.APPROVED, CLAIM_STATUS.SENT_FOR_PAYMENT, CLAIM_STATUS.CLINICAL_REVIEW];

  const inProgressOutcomes = ['Pending', CLAIM_STATUS.CLINICAL_REVIEW, CLAIM_STATUS.IN_REVIEW];

  const getStatusClasses = (status: string, outcome?: string) => {
    if (status === 'passed') return 'bg-green-100 text-green-800';
    if (status === 'failed' && inProgressOutcomes.includes(outcome || '')) {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (status === 'failed') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };


  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <TestResultsReport
        results={results}
        onRefresh={(claimId, test) => {
          const matchingResult = results.find(r => r.claimId === claimId && r.test === test);
          if (matchingResult) {
            return handleRefresh(matchingResult.id, claimId, test);
          }
          return Promise.resolve();
        }}
      />
      <div className="border-b border-gray-200">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-semibold text-gray-700">Test Summary</h2>
          <Button
            variant="ghost"
            onClick={() => setShowSummary(!showSummary)}
            className="text-green-900 hover:text-green-700"
          >
            {showSummary ? (
              <>
                <ChevronDownIcon className="h-5 w-5 mr-1" />
                Hide details
              </>
            ) : (
              <>
                <ChevronRightIcon className="h-5 w-5 mr-1" />
                Show details
              </>
            )}
          </Button>
        </div>
        {showSummary && (

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
                  Rule Status
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
              {[...results].reverse().map((result) => (
                <>
                  <TableRow key={result.id} className="hover:bg-gray-50">
                    <TableCell className="px-6 py-4 align-top text-sm font-medium text-gray-500">
                      <div className="break-words whitespace-normal text-gray-500">
                        {result.name}
                      </div>
                      <div className="text-xs text-gray-400 break-words whitespace-pre-wrap">

                        {result.outcome ? (<span className={`${passingOutcomes.includes(result.outcome) ? 'text-green-500' : 'text-red-500'}`}>
                          {result.outcome}</span>) : (<span className="text-red-400 break-words">{result.details.error ? `${result.details.error}` : <span className={`h-4 w-4 ${passingOutcomes.includes(result.ruleStatus) || result.details?.request?.formData?.is_bundle_only
                            ? 'text-green-500'
                            : 'text-red-500'
                            }`}>{result.message}</span>}</span>)}

                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result?.use || 'N/A'}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-start">
                        <span
                          className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
                            result.status,
                            result.outcome
                          )}`}
                        >
                          {(() => {
                            const isPending = result.outcome === 'Pending';
                            const isInReview = result.outcome === CLAIM_STATUS.CLINICAL_REVIEW || result.outcome === CLAIM_STATUS.IN_REVIEW;
                            const isFailed = result.status === 'failed';
                            const isPassed = result.status === 'passed';
                            const isRefreshing = refreshingIds[result.id];

                            if (isPassed) {
                              return <CheckCircleIcon className="h-4 w-4 mr-1" />;
                            }

                            if (isFailed && (isPending || isInReview)) {
                              return (
                                <Button
                                  variant="link"
                                  onClick={() => handleRefresh(result.id, result.claimId ?? '', result.test)}
                                  size="sm"
                                  disabled={isRefreshing}
                                  className="h-4 w-4 mr-1"
                                >
                                  <RefreshCcwIcon
                                    className={`h-4 w-4 ${isRefreshing ? 'text-orange-500 animate-spin' : 'text-orange-400'
                                      }`}
                                  />
                                </Button>
                              );
                            }

                            if (isFailed) {
                              return <XCircleIcon className="h-4 w-4 mr-1" />;
                            }

                            return (
                              <Button
                                onClick={() => copyPayload(result.details.fhirBundle)}
                                className="h-4 w-4 mr-1 bg-blue-100 text-blue-800 hover:text-blue-500 hover:bg-blue-100 text-sm"
                              >
                                <ClipboardIcon className="h-4 w-4 mr-1" />
                              </Button>
                            );
                          })()}

                          {(() => {
                            const isPending = result.outcome === 'Pending';
                            const isInReview = result.outcome === CLAIM_STATUS.CLINICAL_REVIEW;
                            const isRefreshing = refreshingIds[result.id];

                            if (!isPending && !isInReview) {
                              return result.status.toUpperCase();
                            }

                            return (
                              <span className="text-orange-400">
                                {isRefreshing
                                  ? 'Refreshing...'
                                  : isPending
                                    ? 'PENDING'
                                    : isInReview
                                      ? 'IN REVIEW'
                                      : result.outcome}
                              </span>
                            );
                          })()}
                        </span>
                      </div>

                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {result.outcome ? (<span className={`${passingOutcomes.includes(result.outcome) ? 'text-green-500' : 'text-red-500'}`}>
                        {result.outcome}</span>) : (<span className="text-red-400 break-words">{result.details.error ? `${result.details.error}` : <span className={`h-4 w-4 ${passingOutcomes.includes(result.ruleStatus) || result.details?.request?.formData?.is_bundle_only
                          ? 'text-green-500'
                          : 'text-red-500'
                          }`}>{result.message}</span>}</span>)}
                    </TableCell>

                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(result.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button
                        onClick={() => toggleRow(result.id)}
                        className="text-green-900 bg-gray-50 hover:bg-gray-100 hover:text-green-700 flex items-center"
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
                          {!result.details.request.formData?.is_bundle_only && (
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
                                    className="flex items-center bg-gray-50 text-green-900 hover:bg-gray-200 hover:text-green-700 text-sm"
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
                          )}

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
                                      <span className="font-medium">
                                        {result.details.request.formData?.is_bundle_only
                                          ? "Built bundle"
                                          : "Submitted payload"}
                                      </span>

                                    </Button>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button
                                      onClick={() => downloadPayload(result.details.fhirBundle, `${result.id}-response.json`)}
                                      className="flex items-center bg-gray-50 text-green-900 hover:bg-gray-200 hover:text-green-700 text-sm"
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
                              {!result.details.request.formData?.is_bundle_only && (
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
                                    <div className='p-2'><span className="font-medium">Outcome:</span> {result.outcome ?? result.details.error}</div>
                                  </div>
                                </div>
                              )}
                            </>
                          )}

                          {/* {result.details.error && (
                        <div className="border border-red-100 rounded-lg overflow-hidden">
                          <div className="flex justify-between items-center bg-red-50 p-3">
                            <pre className="p-3 text-red-600 text-xs whitespace-pre-wrap break-words">
                              {result.details.error}
                            </pre>
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
                      )} */}

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
        )}
      </div>
    </div>
  );
}