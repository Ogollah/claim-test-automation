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
import { useAuthSession } from "@/hook/useAuth";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ScheduleAutoReport from "@/components/Dashboard/schedule-test/ScheduleReport";

export default function TestCases() {
    const { session, isLoading } = useAuthSession();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }
    return (
        <Layout session={session}>
            <Navbar title="Test Automation Dashboard" />
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
                            <BreadcrumbPage className="text-green-900">Test Automation Dashboard</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <ScheduleAutoReport  />
        </Layout>
    );
}