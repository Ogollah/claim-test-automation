import Layout from "@/components/Layout/Layout";
import ComplexTestRunner from "@/components/Dashboard/ComplexTestRunner";

export default function TestCases() {
    return (
        <Layout>
            <ComplexTestRunner isRunning={false} />
        </Layout>
    );
}