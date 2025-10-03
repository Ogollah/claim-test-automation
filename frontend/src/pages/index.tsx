'use client'

import { useState } from 'react'
import { useAuthSession } from '@/hook/useAuth'
import Layout from '@/components/Layout/Layout'
import TestRunner from '../components/Dashboard/TestRunner'
import ResultsTable from '../components/Dashboard/ResultsTable'
import { TestResult } from "@/lib/types";
import { runTestSuite } from "@/utils/testUtils";
import { toast } from "sonner";
import { refreshTestResult } from "@/utils/claimUtils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Navbar } from '@/components/Layout/navbar'
import LoadingSpinner from '@/components/ui/loading-spinner'

export default function Home() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const { session, isLoading } = useAuthSession()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const handleRunTests = async (payload: any) => {
    setIsRunning(true);
    try {
      const result = await runTestSuite(payload, session?.user.id);
      setResults(prev => [...prev, ...result]);
      toast.success('Tests completed successfully');
    } catch (error) {
      console.error('Test execution failed:', error);
      toast.error('Test execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleRefreshResult = async (claimId: string) => {
    try {
      const { outcome, status, message, ruleStatus } = await refreshTestResult(claimId);

      setResults(prevResults =>
        prevResults.map(result =>
          result.claimId === claimId
            ? {
              ...result,
              outcome,
              status,
              message,
              ruleStatus,
              timestamp: new Date().toISOString()
            }
            : result
        )
      );

      toast.success('Result refreshed successfully');
    } catch (error) {
      console.error('Error refreshing result:', error);
      toast.error('Failed to refresh result');
    }
  };

  return (
    <Layout session={session}>
      <Navbar title={"Custom builder"} />
      <div className="p-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Custom builder</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mx-auto px-6">
        <TestRunner
          isRunning={isRunning}
          onRunTests={handleRunTests}
        />

        {results.length > 0 && (
          <ResultsTable results={results} onRefresh={handleRefreshResult} />
        )}
      </div>
    </Layout>
  );
}