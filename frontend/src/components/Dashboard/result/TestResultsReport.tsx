'use client';

import { useState } from "react";
import { TestResult } from "@/lib/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCcwIcon } from "lucide-react";

interface TestResultsReportProps {
    results: TestResult[];
    onRefresh?: (resultId: string, claimId: string, test?: string) => Promise<void>;
}

export default function TestResultsReport({ results, onRefresh }: TestResultsReportProps) {
    const [expanded, setExpanded] = useState<'passed' | 'failed' | 'pending' | null>(null);
    const [refreshingIds, setRefreshingIds] = useState<Record<string, boolean>>({});

    const passedResults = results.filter(r => r.status === 'passed');
    const failedResults = results.filter(r => r.status === 'failed' && r.outcome !== 'Pending');
    const pendingResults = results.filter(r => r.status === 'failed' && r.outcome === 'Pending');

    const passed = passedResults.length;
    const failed = failedResults.length;
    const pending = pendingResults.length;
    const total = results.length;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

    const handleRefresh = async (resultId: string, claimId: string, test?: string) => {
        if (!onRefresh) return;
        try {
            setRefreshingIds(prev => ({ ...prev, [resultId]: true }));
            await onRefresh(claimId, test);
        } finally {
            setRefreshingIds(prev => ({ ...prev, [resultId]: false }));
        }
    };

    const toggle = (type: typeof expanded) => {
        setExpanded(prev => prev === type ? null : type);
    };

    return (
        <div className="bg-white shadow rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3">Test Results Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                    onClick={() => toggle('passed')}
                    className="bg-green-50 p-3 rounded-lg text-center cursor-pointer hover:bg-green-100 transition"
                >
                    <div className="text-2xl font-bold text-green-700">{passed}</div>
                    <div className="text-sm text-green-600">Passed</div>
                </div>
                <div
                    onClick={() => toggle('failed')}
                    className="bg-red-50 p-3 rounded-lg text-center cursor-pointer hover:bg-red-100 transition"
                >
                    <div className="text-2xl font-bold text-red-700">{failed}</div>
                    <div className="text-sm text-red-600">Failed</div>
                </div>
                <div
                    onClick={() => toggle('pending')}
                    className="bg-yellow-50 p-3 rounded-lg text-center cursor-pointer hover:bg-yellow-100 transition"
                >
                    <div className="text-2xl font-bold text-yellow-700">{pending}</div>
                    <div className="text-sm text-yellow-600">Pending</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-700">{passRate}%</div>
                    <div className="text-sm text-blue-600">Pass Rate</div>
                </div>
            </div>

            {expanded === 'failed' && failed > 0 && (
                <div className="mt-6">
                    <h3 className="font-medium text-gray-700 mb-3">Failed Tests</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >Test Name</TableHead>
                                <TableHead scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error / Outcome</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...failedResults].reverse().map(result => (
                                <TableRow key={result.id}>
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-red-500">{result.name}</TableCell>
                                    <TableCell className="px-6 py-4 break-words whitespace-pre-wrap text-sm text-gray-500">{result.outcome ?? result.details?.error ?? result.details?.errorMessage}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {expanded === 'passed' && passed > 0 && (
                <div className="mt-6">
                    <h3 className="font-medium text-gray-700 mb-3">Passed Tests</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</TableHead>
                                <TableHead scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...passedResults].reverse().map(result => (
                                <TableRow key={result.id}>
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-green-500">{result.name}</TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.outcome ?? 'PASSED'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {expanded === 'pending' && pending > 0 && (
                <div className="mt-6">
                    <h3 className="font-medium text-gray-700 mb-3">Pending Tests</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</TableHead>
                                <TableHead scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >Status</TableHead>
                                <TableHead scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...pendingResults].reverse().map(result => (
                                <TableRow key={result.id}>
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-yellow-800">{result.name}</TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Pending</TableCell>
                                    <TableCell>
                                        {result.claimId && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleRefresh(result.id, result.claimId, result.test)}
                                                disabled={refreshingIds[result.id]}
                                            >
                                                <RefreshCcwIcon className={`h-4 w-4 mr-2 ${refreshingIds[result.id] ? 'animate-spin text-orange-500' : 'text-yellow-600'}`} />
                                                {refreshingIds[result.id] ? 'Refreshing...' : 'Refresh'}
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
