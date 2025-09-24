'use client';
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
import { Navbar } from "@/components/Layout/navbar";
import { useAuthSession } from "@/hook/useAuth";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ManagePackage from "@/packages/ManagePackage";

export default function ManagePackagesPage() {

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
            <Navbar title="Manage packages" />
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
                            <BreadcrumbPage>Manage packages</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className=" mx-auto px-6">
                <ManagePackage />
            </div>
        </Layout>
    );
}
