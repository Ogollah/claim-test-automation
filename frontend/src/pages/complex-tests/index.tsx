import Layout from "@/components/Layout/Layout";
import ComplexTestRunner from "@/components/Dashboard/ComplexTestRunner";
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
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useAuthSession } from "@/hook/useAuth";

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
                            <BreadcrumbPage>Complex test suite</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className=" mx-auto px-6">
                <ComplexTestRunner isRunning={false} />
            </div>
        </Layout>
    );
}