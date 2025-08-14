import { TestResult } from '@/lib/types';
import { CheckCircleIcon, XCircleIcon, ChevronDownIcon, ChevronRightIcon, ArrowDownTrayIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';

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

const outcome = (result: TestResult) => {
    const entry = result.details.response?.entry?.find((e: any) => e.resource?.resourceType === 'ClaimResponse');
    const ext = entry?.resource.extension.find((i: any) => i.url.endsWith('claim-state-extension'));
    const valueCode = ext?.valueCodeableConcept.coding.find((s: any) => s.system.endsWith('claim-state'));
    const outcome = valueCode?.display  || '';
    return outcome;
}


  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Test type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Use
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Timestamp
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {results.map((result) => (
            <>
              <tr key={result.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                  {result.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.use?.id || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
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
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.duration}ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(result.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => toggleRow(result.id)}
                    className="text-blue-600 hover:text-blue-900 flex items-center"
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
                  </button>
                </td>
              </tr>
              {expandedRows[result.id] && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 bg-gray-50">
                    <div className="space-y-4">
                      <div className="border rounded-lg overflow-hidden">
                        <div className="flex justify-between items-center bg-gray-100 p-3">
                          <div className="flex items-center">
                            <button 
                              onClick={() => togglePayload(result.id, 'request')}
                              className="flex items-center text-gray-700 hover:text-gray-900"
                            >
                              {expandedPayloads[result.id]?.request ? (
                                <ChevronDownIcon className="h-5 w-5 mr-2" />
                              ) : (
                                <ChevronRightIcon className="h-5 w-5 mr-2" />
                              )}
                              <span className="font-medium">Request Payload</span>
                            </button>
                          </div>
                          <button
                            onClick={() => downloadPayload(result.details.request, `${result.id}-request.json`)}
                            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                            Download
                          </button>
                        </div>
                        {expandedPayloads[result.id]?.request && (
                          <pre className="p-3 bg-white text-xs overflow-x-auto">
                            {JSON.stringify(result.details.request, null, 2)}
                          </pre>
                        )}
                      </div>

                      {result.details.response && (
                        <>
                          <div className="border rounded-lg overflow-hidden">
                            <div className="flex justify-between items-center bg-gray-100 p-3">
                              <div className="flex items-center">
                                <button 
                                  onClick={() => togglePayload(result.id, 'response')}
                                  className="flex items-center text-gray-700 hover:text-gray-900"
                                >
                                  {expandedPayloads[result.id]?.response ? (
                                    <ChevronDownIcon className="h-5 w-5 mr-2" />
                                  ) : (
                                    <ChevronRightIcon className="h-5 w-5 mr-2" />
                                  )}
                                  <span className="font-medium">Response Payload</span>
                                </button>
                              </div>
                              <button
                                onClick={() => downloadPayload(result.details.response, `${result.id}-response.json`)}
                                className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                              >
                                <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                                Download
                              </button>
                            </div>
                            {expandedPayloads[result.id]?.response && (
                              <pre className="p-3 bg-white text-xs overflow-x-auto">
                                {JSON.stringify(result.details.response, null, 2)}
                              </pre>
                            )}
                          </div>

                          <div className="bg-gray-100 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Response Summary</h4>
                            <div className="bg-white p-3 rounded text-xs">
                              <div className="mb-1"><span className="font-medium">Message:</span> {result?.message}</div>
                              <div className="mb-1"><span className="font-medium">Claim ID:</span> {result?.claimId}</div>
                              <div><span className="font-medium">Outcome:</span> {result.outcome} {result.status}</div>
                            </div>
                          </div>
                        </>
                      )}

                      {result.details.error && (
                        <div className="bg-red-50 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-red-700">Error</h4>
                          <p className="mt-1 text-sm text-red-600">{result.details.error}</p>
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
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}