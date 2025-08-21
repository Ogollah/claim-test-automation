import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

import { useState } from 'react'
import Head from 'next/head'
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import TestcaseEditor from "@/components/testCases/jsonEditor/TestcaseEditor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AddTestCase() {

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} grid grid-rows-[20px_1fr_20px] items-center  min-h-screen p-3 gap-7 font-[family-name:var(--font-geist-sans)]`}
    >
      <Header/>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
              <main className="flex-1 overflow-y-auto focus:outline-none bg-gray-100">
          <div className=" px-8">
            <TestcaseEditor />
          </div>
        </main>
      </div>
    </div>
  );
}
