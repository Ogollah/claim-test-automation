import { TestResult } from '@/lib/api';
import { CheckCircleIcon, XCircleIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';

export default function ResultsTable({ results }: { results: TestResult[] }) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Test
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {result.name}
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
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {expandedRows[result.id] ? (
                      <ChevronDownIcon className="h-5 w-5" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5" />
                    )}
                  </button>
                </td>
              </tr>
              {expandedRows[result.id] && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 bg-gray-50">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Request Payload</h4>
                        <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                          {JSON.stringify(result.details.request, null, 2)}
                        </pre>
                      </div>

                      {result.details.response && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Response</h4>
                          <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                            {`${result?.message}: ${result?.claimId}`}
                          </pre>
                        </div>
                      )}

                      {result.details.error && (
                        <div>
                          <h4 className="text-sm font-medium text-red-700">Error</h4>
                          <p className="mt-1 text-sm text-red-600">{result.details.error}</p>
                        </div>
                      )}

                      {result.details.validationErrors && result.details.validationErrors.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-red-700">Validation Errors</h4>
                          <ul className="mt-1 space-y-1">
                            {result.details.validationErrors.map((error:any, index:any) => (
                              <li key={index} className="text-sm text-red-600">
                                <span className="font-medium">{error.path}:</span> {error.message}
                              </li>
                            ))}
                            <li className="text-sm text-red-600">
                                <span className="font-medium">{result.details?.error}</span>
                              </li>
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