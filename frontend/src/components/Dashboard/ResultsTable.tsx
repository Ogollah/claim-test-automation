import { TestResult } from '@/lib/types';
import { CheckCircleIcon, XCircleIcon, ChevronDownIcon, ChevronRightIcon, ArrowDownTrayIcon, ClipboardIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { RefreshCcwIcon } from 'lucide-react';

export default function ResultsTable({ results }: { results: TestResult[] }) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [expandedPayloads, setExpandedPayloads] = useState<Record<string, { request: boolean; response: boolean }>>({});

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const togglePayload = (id: string, type: 'request' | 'response') => {
    setExpandedPayloads(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type]: !prev[id]?.[type]
      }
    }));
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
        alert('Payload copied to clipboard!');
      })
      .catch(() => {
        alert('Failed to copy payload');
      });
  };

  //   const handleRefresh = async (resultId: string, claimId: any) => {
  //   if (!onRefresh) return;
    
  //   try {
  //     setLoadingStates(prev => ({ ...prev, [resultId]: true }));
      
  //     const updatedData = await onRefresh(claimId);
      
  //     setResults(prev => prev.map(result => {
  //       if (result.id === resultId) {
  //         return { ...result, ...updatedData };
  //       }
  //       return result;
  //     }));
  //   } catch (error) {
  //     console.error('Failed to refresh result:', error);
  //   } finally {
  //     setLoadingStates(prev => ({ ...prev, [resultId]: false }));
  //   }
  // };

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
                  {result.use?.id || 'N/A'}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    result.status === 'passed' 
                      ? 'bg-green-100 text-green-800'
                      : result.status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {result.status === 'passed' ? (
                      <CheckCircleIcon className="h-4 w-4 mr-1 inline" />
                    ) : result.status === 'failed' ? (
                      <XCircleIcon className="h-4 w-4 mr-1 inline" />
                    ) : null}
                    {result.status.toUpperCase()}
                  </span>
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
                                  onClick={() => downloadPayload(result.details.request, `${result.id}-response.json`)}
                                  className="flex items-center bg-gray-50 text-blue-600 hover:bg-gray-200 hover:text-blue-800 text-sm"
                                >
                                  <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                                <Button
                                  onClick={() => copyPayload(result.details.response)}
                                  className="flex items-center bg-gray-100 text-gray-500 hover:text-gray-500 hover:bg-100 hover:text-gray-900 text-sm"
                                >
                                  <ClipboardIcon className="h-4 w-4 mr-1" />
                                  Copy
                                </Button>
                              </div>
                            </div>
                            {expandedPayloads[result.id]?.response && (
                              <pre className="p-3 bg-white text-xs overflow-hiden">
                                {JSON.stringify(result.details.response, null, 2)}
                              </pre>
                            )}
                          </div>

                          <div className="bg-gray-100 p-3 rounded-lg">
                            <div className='flex  item-center justify-between p-3'>
                              <h4 className="text-sm font-medium text-gray-500 mb-2">Response Summary</h4>
                              {result?.claimId && (
                                <Button 
                                  // onClick={() => handleRefresh(result.id, result.claimId)}
                                  className='bg-gray-100 hover:bg-gree-200 text-green-500 hover:text-green-600'
                                  // disabled={result.id}
                                >
                                  <RefreshCcwIcon className={`h-4 w-4 mr-1 ${result.id ? 'text-green-500 animate-spin' : 'text-green-600'}`} />
                                  {result.id ? 'Refreshing...' : 'Refresh'}
                                </Button>
                              )}
                            </div>
                            <div className={`${result.status === 'passed' ? 'bg-white p-3 text-green-500' : 'bg-red-50 text-red-500'} p-3 rounded text-xs`}>
                              <div className="mb-1 p-2"><span className="font-medium">Message:</span> {result?.message}</div>
                              <div className="mb-1 p-2"><span className="font-medium">Claim ID:</span> {result?.claimId}</div>
                              <div className='p-2'><span className="font-medium">Outcome:</span> {result.outcome} {result.status}</div>
                            </div>
                          </div>
                        </>
                      )}

                      {result.details.error && (
                        <div className="bg-red-50 p-3 rounded-lg overflow-outo">
                          <h4 className="text-sm font-medium text-red-700">Error</h4>
                              <pre className="mt-1 text-sm text-red-600 whitespace-pre-wrap break-words overflow-hidden">
      {result.details.error}
    </pre>
                        </div>
                      )}

                      {result.details.validationErrors && result.details.validationErrors.length > 0 && (
                        <div className="bg-red-50 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-red-700">Validation Errors</h4>
                          <ul className="mt-1 space-y-1">
                            {result.details.validationErrors.map((error:any, index:any) => (
                              <li key={index} className="text-sm text-red-600">
                                <span className="font-medium">{error.path}:</span> {error.message}
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
