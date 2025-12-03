// app/dashboard/page.tsx
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useAuthSession } from "@/hook/useAuth";
import { Button } from "@/components/ui/button";
import { Code, Mail, Play, RefreshCw, Server, TestTube } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCards from "./components/StatsCards";
import ScheduleForm from "./components/ScheduleForm";
import Reports from "./components/report/TestReport";
import ScheduleList from "./components/ScheduleList";
import EmailStatus from "./components/EmailStatus";
import { sendManualReports, triggerManualTests, verifyTestExecution } from "@/lib/api";
import TestMetricsLineChart from "./components/TestMetricsLineChart";

interface ScheduleAutoReportProps {
    isRunning?: boolean;
    onRunTests?: (config: any) => Promise<void>;
}

export default function ScheduleAutoReport({ isRunning, onRunTests }: ScheduleAutoReportProps) {
    const [activeTab, setActiveTab] = useState('overview')
    const [refreshing, setRefreshing] = useState(false)
    const { userId } = useAuthSession();
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            setRefreshKey(prev => prev + 1);
            toast.success("All data has been updated successfully.");
        } catch (error) {
            toast.error("Failed to refresh data.");
        } finally {
            setRefreshing(false);
        }
    }

    const handleRunTests = async () => {
        try {
            toast.info("Manual test execution has been initiated.");
            const result = await triggerManualTests();
            toast.success(`Tests completed! ${result} tests executed.`);
            // Refresh the data
            handleRefresh();
        } catch (error) {
            console.error('Error running tests:', error);
            toast.error("Failed to start tests.");
        }
    }

    const handleSendReports = async () => {
        try {
            toast.info("Sending email reports...");
            const result = await sendManualReports();
            toast.success(result.message || "Email reports have been dispatched.");
            // Refresh the data
            handleRefresh();
        } catch (error) {
            console.error('Error sending reports:', error);
            toast.error("Failed to send email reports.");
        }
    }

    const handleScheduleCreated = () => {
        toast.success("Schedule created successfully!");
        handleRefresh();
    }

    const handleScheduleUpdated = () => {
        toast.success("Schedule updated successfully!");
        handleRefresh();
    }

    const handleScheduleDeleted = () => {
        toast.success("Schedule deleted successfully!");
        handleRefresh();
    }

    function handleSwitchEnvironment(): void {
        throw new Error("Function not implemented.");
    }

    return (
        <div className="max-auto py-3 px-4">
            <div className="bg-white rounded-sm shadow-md p-6 mb-8 max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-green-900">Test Automation Dashboard</h1>
                            <p className="text-muted-foreground">
                                Schedule, monitor, and manage automated test executions
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                onClick={handleSwitchEnvironment} 
                                className="text-gray-500"
                                disabled={refreshing}
                            >
                                <Code className="h-4 w-4 mr-2 text-green-900" />
                                Development environment
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={handleSwitchEnvironment} 
                                className="text-gray-500"
                                disabled={refreshing}
                            >
                                <TestTube className="h-4 w-4 mr-2 text-green-900" />
                                UAT environment
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={handleSwitchEnvironment} 
                                className="text-gray-500"
                                disabled={refreshing}
                            >
                                <Server className="h-4 w-4 mr-2 text-green-900" />
                                Production environment
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={handleRunTests} 
                                className="text-gray-500"
                                disabled={refreshing}
                            >
                                <Play className="h-4 w-4 mr-2 text-green-900" />
                                Run Tests
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={handleRefresh} 
                                disabled={refreshing} 
                                className="text-gray-500"
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 text-yellow-700 ${refreshing ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                        </div>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger
                                value="overview"
                                className="text-gray-500 data-[state=active]:text-green-900"
                            >
                                Overview
                            </TabsTrigger>
                            <TabsTrigger
                                value="schedules"
                                className="text-gray-500 data-[state=active]:text-green-900"
                            >
                                Schedules
                            </TabsTrigger>
                            <TabsTrigger
                                value="reports"
                                className="text-gray-500 data-[state=active]:text-green-900"
                            >
                                Reports
                            </TabsTrigger>
                            {/* <TabsTrigger
                                value="emails"
                                className="text-gray-500 data-[state=active]:text-green-900"
                            >
                                Email Status
                            </TabsTrigger>
                            <TabsTrigger
                                value="configuration"
                                className="text-gray-500 data-[state=active]:text-green-900"
                            >
                                Configuration
                            </TabsTrigger> */}
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6">
                            <StatsCards refreshKey={refreshKey} />
                            <TestMetricsLineChart  />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-green-900">Recent Schedules</CardTitle>
                                        <CardDescription>Active and upcoming test schedules</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ScheduleList 
                                            compact 
                                            refreshKey={refreshKey}
                                            onScheduleUpdate={handleScheduleUpdated}
                                            onScheduleDelete={handleScheduleDeleted}
                                        />
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-green-900">Latest Reports</CardTitle>
                                        <CardDescription>Most recent test cases reports</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Reports 
                                            compact 
                                            refreshKey={refreshKey}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                        <TabsContent value="schedules" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card className="lg:col-span-1">
                                    <CardHeader>
                                        <CardTitle className="text-green-900">Create Schedule</CardTitle>
                                        <CardDescription>Set up new test automation schedule</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ScheduleForm onScheduleCreated={handleScheduleCreated} />
                                    </CardContent>
                                </Card>
                                <Card className="lg:col-span-1">
                                    <CardHeader>
                                        <CardTitle className="text-green-900">Active Schedules</CardTitle>
                                        <CardDescription>Manage your test schedules</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ScheduleList 
                                            refreshKey={refreshKey}
                                            onScheduleUpdate={handleScheduleUpdated}
                                            onScheduleDelete={handleScheduleDeleted}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="reports">
                            <Reports refreshKey={refreshKey} />
                        </TabsContent>

                        <TabsContent value="emails">
                            <EmailStatus 
                                refreshKey={refreshKey}
                                onEmailSent={handleRefresh}
                            />
                        </TabsContent>
{/* 
                        <TabsContent value="configuration">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-green-900">Configuration</CardTitle>
                                    <CardDescription>System settings and preferences</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-sm text-muted-foreground">Email Settings</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm text-muted-foreground">
                                                        Default recipient: kogollah@gmail.com
                                                    </p>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-sm text-muted-foreground">Test Settings</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm text-muted-foreground">
                                                        Non-complex interventions only (is_complex = 0)
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </div>
                                        <Button 
                                            onClick={async () => {
                                                try {
                                                    const result = await verifyTestExecution();
                                                    if (result.allTestsExecuted) {
                                                        toast.success("All tests are executing correctly!");
                                                    } else {
                                                        toast.warning(`Missing ${result.missingExecutions} test executions`);
                                                    }
                                                } catch (error) {
                                                    toast.error("Failed to verify test execution");
                                                }
                                            }}
                                            className={`bg-green-900`}
                                        >
                                            Verify Test Execution
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent> */}
                    </Tabs>
                </div>
            </div>
        </div>
    );
}