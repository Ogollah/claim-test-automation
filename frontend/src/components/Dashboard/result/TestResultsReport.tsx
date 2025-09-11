import { TestResult } from "@/lib/types";

export default function TestResultsReport({ results }: { results: TestResult[] }) {
    if (results.length === 0) return null;

    const passed = results.filter(r => r.status === 'passed').length;
    const failed = results.filter(r => r.status === 'failed').length;
    const pending = results.filter(r => r.outcome === 'Pending').length;
    const total = results.length;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

    return (
        <div className="bg-white shadow rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3">Test Results Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-700">{passed}</div>
                    <div className="text-sm text-green-600">Passed</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-700">{failed}</div>
                    <div className="text-sm text-red-600">Failed</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-700">{pending}</div>
                    <div className="text-sm text-yellow-600">Pending</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-700">{passRate}%</div>
                    <div className="text-sm text-blue-600">Pass Rate</div>
                </div>
            </div>

            {failed > 0 && (
                <div className="mt-4">
                    <h3 className="font-medium text-gray-700 mb-2">Failed Tests:</h3>
                    <ul className="list-disc list-inside text-sm text-red-600">
                        {results
                            .filter(r => r.status === 'failed')
                            .map((result, index) => (
                                <li key={index}>{result.name} - {result.outcome || 'Error'}</li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
}