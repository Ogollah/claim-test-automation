import Layout from "@/components/Layout/Layout";
import TestCasesRunner from "@/components/Dashboard/TestCasesRunner";
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

export default function TestCases() {
  return (
    <Layout>
      <Navbar title="Automated test suite" />
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
              <BreadcrumbPage>All tests</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className=" mx-auto px-6">
        <TestCasesRunner />
      </div>
    </Layout>
  );
}