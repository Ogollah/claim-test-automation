import Layout from "@/components/Layout/Layout";
import ComplexCaseBuilder from "@/components/Dashboard/ComplexCaseBuilder";
import ResultsTable from "@/components/Dashboard/ResultsTable";
import { toast } from "sonner";
import { runTestSuite } from "@/utils/testUtils";
import { TestResult } from "@/lib/types";
import { useState } from "react";
import { refreshTestResult } from "@/utils/claimUtils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Navbar } from "@/components/Layout/navbar";
import Link from "next/link";
import { useAuthSession } from "@/hook/useAuth";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function ComplexCases() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const { session, isLoading } = useAuthSession();

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
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleRefreshResult = async (claimId: string) => {
    try {
      const { outcome, status, message, ruleStatus } = await refreshTestResult(claimId);

      setResults(prevResults =>
        prevResults.map(result => {
          if (result.claimId === claimId) {
            return {
              ...result,
              outcome,
              status,
              message,
              ruleStatus,
              timestamp: new Date().toISOString()
            };
          }
          return result;
        })
      );

      toast.success('Result refreshed successfully');
    } catch (error) {
      console.error('Error refreshing result:', error);
      toast.error('Failed to refresh result');
      throw error;
    }
  };
  return (
    <Layout session={session}>

      <Navbar title={"Complex builder"} />

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
              <BreadcrumbPage>Complex builder</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className=" mx-auto px-6">
        <ComplexCaseBuilder
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