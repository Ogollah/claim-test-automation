import SanityTestCases from "@/components/Dashboard/sanity/SanityCheck";
import Layout from "@/components/Layout/Layout";

export default function TestCases() {
    return (
        <Layout>
            <SanityTestCases isRunning={false} />
        </Layout>
    );
}