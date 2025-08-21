import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import TestCasesRunner from "@/components/Dashboard/TestCasesRunner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function TestCases() {

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} grid grid-rows-[20px_1fr_20px] items-center p-3 gap-7 font-[family-name:var(--font-geist-sans)]`}
    >
      <Header/>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
              <main className="flex-1 overflow-y-auto focus:outline-none bg-gray-100">
          <div className=" px-8">
            <TestCasesRunner />
          </div>
        </main>
      </div>
    </div>
  );
}
