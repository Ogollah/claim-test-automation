import { useState } from 'react'
import Layout from '@/components/Layout/Layout'
import { TestResult } from "@/lib/types";
import SanityCheck from '@/components/Dashboard/sanity/SanityCheck';

export default function Home() {
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState<TestResult[]>([]);

    const handleRunTests = async (payload: any) => {
        setIsRunning(true);
        try {
            setIsRunning(true);
        } catch (error) {
            console.error('Test execution failed:', error);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <Layout>
            <SanityCheck
                isRunning={isRunning}
                onRunTests={handleRunTests}
            />
        </Layout>
    );
}