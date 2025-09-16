import SanityTestCases from "@/components/Dashboard/sanity/SanityCheck";
import Layout from "@/components/Layout/Layout";
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
            <Navbar title="Sanity check" />
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
                            <BreadcrumbPage>Sanity check</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <SanityTestCases isRunning={false} />
        </Layout>
    );
}