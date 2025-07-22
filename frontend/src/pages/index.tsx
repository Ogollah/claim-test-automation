import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

import { useState } from 'react'
import Head from 'next/head'
import Header from '../components/Layout/Header'
import Sidebar from '../components/Layout/Sidebar'
import TestRunner from '../components/Dashboard/TestRunner'
import ResultsTable from '../components/Dashboard/ResultsTable'
import { runTestSuite, TestResult } from '@/lib/api'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {

    const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const handleRunTests = async (payload: any) => {
    setIsRunning(true);
    try {
      const result = await runTestSuite(payload);
      console.log('Test execution result:', result);
      
      setResults(prev => [...prev, ...result]);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-3 gap-16 font-[family-name:var(--font-geist-sans)]`}
    >
      <Header/>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
              <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <TestRunner 
              isRunning={isRunning}
              onRunTests={handleRunTests}
            />
            
            <ResultsTable results={results} />
          </div>
        </main>
      </div>
    </div>
  );
}
