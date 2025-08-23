import Layout from "@/components/Layout/Layout";
import ComplexCaseBuilder from "@/components/Dashboard/ComplexCaseBuilder";
import ResultsTable from "@/components/Dashboard/ResultsTable";
import { toast } from "sonner";
import { runTestSuite } from "@/utils/testUtils";
import { TestResult } from "@/lib/types";
import { useState } from "react";
import { refreshTestResult } from "@/utils/claimUtils";

export default function ComplexCases() {
    const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const handleRunTests = async (payload: any) => {
    setIsRunning(true);
    try {
      const result = await runTestSuite(payload);
      setResults(prev => [...prev, ...result]);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleRefreshResult = async (claimId: string) => {
    try {
      const { outcome, status, message } = await refreshTestResult(claimId);
      
      setResults(prevResults => 
        prevResults.map(result => {
          if (result.claimId === claimId) {
            return {
              ...result,
              outcome,
              status,
              message,
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
    <Layout>
      <ComplexCaseBuilder
        isRunning={isRunning}
        onRunTests={handleRunTests} 
      />
      <ResultsTable results={results} onRefresh={handleRefreshResult} />
    </Layout>
  );
}