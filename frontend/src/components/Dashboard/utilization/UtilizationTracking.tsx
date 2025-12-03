import { useEffect, useState } from 'react';
import { Package } from '@/lib/types';
import { FundUtilization, UtilizationResponse, ComputationalDetail, IntermediatePeriodUsage } from '@/lib/api/types';
import { getPackages, getUtilization } from '@/lib/api';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  Users,
  Package as PackageIcon,
  Clock,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function UtilizationTracking() {
  const [selectedPackage, setSelectedPackage] = useState('');
  const [packages, setPackages] = useState<Package[]>([]);
  const [utilization, setUtilization] = useState<UtilizationResponse[]>([]);
  const [crID, setCrID] = useState('CR5429727418444-1');
  const [loading, setLoading] = useState(false);
  const [groupedByPackage, setGroupedByPackage] = useState<Record<string, UtilizationResponse[]>>({});
  const [activeTab, setActiveTab] = useState('overview');

  // Extract package code from item code (e.g., SHA-06-001 -> SHA-06)
  const extractPackageCode = (code: string) => {
    const parts = code.split('-');
    if (parts.length >= 2) {
      return `${parts[0]}-${parts[1]}`;
    }
    return code;
  };

  // Group items by package code
  const groupByPackage = (data: UtilizationResponse[]) => {
    const grouped: Record<string, UtilizationResponse[]> = {};
    
    data.forEach(item => {
      const pkgCode = extractPackageCode(item.code);
      if (!grouped[pkgCode]) {
        grouped[pkgCode] = [];
      }
      grouped[pkgCode].push(item);
    });
    
    return grouped;
  };

  // Calculate package summary
  const calculatePackageSummary = (items: UtilizationResponse[]) => {
    let totalIndividualMax = 0;
    let totalIndividualUsed = 0;
    let totalHouseholdMax = 0;
    let totalHouseholdUsed = 0;
    let totalFundsAvailable = 0;
    let totalFundsUsed = 0;
    let totalFundsMax = 0;
    let eligibleItems = 0;
    let totalLimitAvailableAmount = 0;
    let itemsWithIntermediatePeriod = 0;

    items.forEach(item => {
      totalIndividualMax += item.individualMaxLimit || 0;
      totalIndividualUsed += item.individualUtilisedLimit || 0;
      totalHouseholdMax += item.householdMaxLimit || 0;
      totalHouseholdUsed += item.householdUtilisedLimit || 0;
      
      if (item.computationalDetail?.eligibility) eligibleItems++;
      
      totalLimitAvailableAmount += item.computationalDetail?.limitAvailableAmount || 0;
      
      if (item.computationalDetail?.intermediatePeriodUsage?.individualUtilisedDuringPeriod !== null) {
        itemsWithIntermediatePeriod++;
      }
      
      item.fundUtilization?.forEach(fund => {
        totalFundsUsed += fund.utilisedAmount || 0;
        totalFundsMax += fund.maxAmount || 0;
        totalFundsAvailable += fund.availableAmount || 0;
      });
    });

    return {
      totalIndividualMax,
      totalIndividualUsed,
      totalHouseholdMax,
      totalHouseholdUsed,
      totalFundsAvailable,
      totalFundsUsed,
      totalFundsMax,
      eligibleItems,
      totalItems: items.length,
      totalLimitAvailableAmount,
      itemsWithIntermediatePeriod,
      individualUsagePercentage: totalIndividualMax > 0 ? (totalIndividualUsed / totalIndividualMax) * 100 : 0,
      fundUsagePercentage: totalFundsMax > 0 ? (totalFundsUsed / totalFundsMax) * 100 : 0
    };
  };

  // Fetch packages on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      const pck = await getPackages();
      setPackages(pck || []);
    };
    fetchPackages();
  }, []);

  // Fetch utilization data when package changes
  useEffect(() => {
    const fetchUtilization = async () => {
      if (selectedPackage) {
        setLoading(true);
        try {
          const util = await getUtilization(crID, selectedPackage);
          setUtilization(util || []);
          if (util) {
            setGroupedByPackage(groupByPackage(util));
          }
        } catch (error) {
          console.error('Error fetching utilization:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUtilization();
  }, [selectedPackage, crID]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Format date with time
  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Get status color based on utilization
  const getStatusColor = (utilized: number, max: number) => {
    const percentage = max > 0 ? (utilized / max) * 100 : 0;
    if (percentage >= 100) return 'destructive';
    if (percentage >= 80) return 'warning';
    return 'success';
  };

  return (
    <div className="py-3 min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8 max-w-9xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Package Utilization Tracking</h1>
              <p className="text-gray-600">Monitor patient package usage, limits, and fund allocation</p>
            </div>
            <Badge variant="outline" className="text-sm">
              CR: {crID}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Package Selector */}
            <div className="space-y-2">
              <Label htmlFor="package" className="flex items-center gap-2">
                <PackageIcon className="w-4 h-4" />
                Select Package
              </Label>
              <Select
                value={selectedPackage || ""}
                onValueChange={(value) => {
                  setSelectedPackage(value);
                  setActiveTab('overview');
                }}
                disabled={loading}
              >
                <SelectTrigger id="package" className="w-full">
                  <SelectValue placeholder="Select a package to view utilization" />
                </SelectTrigger>
                <SelectContent>
                  {packages.map((pkg) => (
                    <SelectItem key={pkg.id} value={String(pkg.id)}>
                      <div className="flex flex-col">
                        <span className="font-medium">{pkg.name}</span>
                        <span className="text-sm text-gray-500">{pkg.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stats Summary */}
            {selectedPackage && utilization.length > 0 && (
              <div className="space-y-2">
                <Label>Quick Stats</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-blue-50 p-3 rounded-md text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {utilization.length}
                    </div>
                    <div className="text-xs text-blue-500">Service Codes</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-md text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {utilization.filter(item => item.computationalDetail?.eligibility).length}
                    </div>
                    <div className="text-xs text-green-500">Eligible</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-md text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Object.keys(groupedByPackage).length}
                    </div>
                    <div className="text-xs text-purple-500">Package Groups</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : selectedPackage && utilization.length > 0 ? (
          <>
            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full md:w-auto grid-cols-3">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <PackageIcon className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="detailed" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Detailed View
                </TabsTrigger>
                <TabsTrigger value="funds" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Fund Analysis
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                {/* Summary Cards by Package Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(groupedByPackage).map(([pkgCode, items]) => {
                    const summary = calculatePackageSummary(items);
                    const firstItem = items[0];
                    
                    return (
                      <Card key={pkgCode} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg font-mono">
                                {pkgCode}
                              </CardTitle>
                              <CardDescription>
                                {items.length} service code{items.length !== 1 ? 's' : ''}
                              </CardDescription>
                            </div>
                            <Badge 
                              variant={summary.eligibleItems > 0 ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {summary.eligibleItems} eligible
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Individual Limit Progress */}
                          {summary.totalIndividualMax > 0 && (
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="flex items-center gap-1 text-gray-600">
                                  <Users className="w-3 h-3" />
                                  Individual Limit
                                </span>
                                <span className="font-medium">
                                  {summary.totalIndividualUsed} / {summary.totalIndividualMax}
                                </span>
                              </div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div>
                                      <Progress 
                                        value={summary.individualUsagePercentage} 
                                        className="h-2"
                                        indicatorClassName={
                                          summary.individualUsagePercentage >= 100 
                                            ? 'bg-red-500' 
                                            : summary.individualUsagePercentage >= 80 
                                            ? 'bg-yellow-500' 
                                            : 'bg-green-500'
                                        }
                                      />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{summary.individualUsagePercentage.toFixed(1)}% utilized</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          )}

                          {/* Fund Utilization */}
                          {summary.totalFundsMax > 0 && (
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="flex items-center gap-1 text-gray-600">
                                  <DollarSign className="w-3 h-3" />
                                  Funds Utilized
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(summary.totalFundsUsed)}
                                </span>
                              </div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div>
                                      <Progress 
                                        value={summary.fundUsagePercentage} 
                                        className="h-2"
                                        indicatorClassName={
                                          summary.fundUsagePercentage >= 100 
                                            ? 'bg-red-500' 
                                            : summary.fundUsagePercentage >= 80 
                                            ? 'bg-yellow-500' 
                                            : 'bg-green-500'
                                        }
                                      />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{summary.fundUsagePercentage.toFixed(1)}% utilized</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <div className="text-xs text-gray-500 mt-1">
                                Available: {formatCurrency(summary.totalFundsAvailable)}
                              </div>
                            </div>
                          )}

                          {/* Coverage Period */}
                          {firstItem?.computationalDetail && (
                            <div className="pt-3 border-t">
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <Calendar className="w-3 h-3" />
                                <span>Coverage Period</span>
                              </div>
                              <div className="text-sm font-medium">
                                {formatDate(firstItem.computationalDetail.coverageStartDate)} - {formatDate(firstItem.computationalDetail.coverageEndDate)}
                              </div>
                              {firstItem.computationalDetail.nextAvailableDate && (
                                <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                                  <Clock className="w-3 h-3" />
                                  Next available: {formatDate(firstItem.computationalDetail.nextAvailableDate)}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Available Limit Amount */}
                          {summary.totalLimitAvailableAmount > 0 && (
                            <div className="bg-green-50 p-3 rounded-md">
                              <div className="text-sm font-medium text-green-800">
                                Available Limit: {formatCurrency(summary.totalLimitAvailableAmount)}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Alerts Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    Important Notices
                  </h3>
                  
                  {utilization.some(item => 
                    item.individualMaxLimit && 
                    item.individualUtilisedLimit && 
                    item.individualUtilisedLimit >= item.individualMaxLimit
                  ) && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Limit Exhaustion Detected</AlertTitle>
                      <AlertDescription>
                        Some service codes have reached their maximum individual utilization limit.
                      </AlertDescription>
                    </Alert>
                  )}

                  {utilization.some(item => 
                    item.fundUtilization?.some(fund => fund.availableAmount === 0)
                  ) && (
                    <Alert variant="warning">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Funds Exhausted</AlertTitle>
                      <AlertDescription>
                        Some service codes have fully utilized their allocated funds.
                      </AlertDescription>
                    </Alert>
                  )}

                  {utilization.every(item => !item.computationalDetail?.eligibility) && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Eligibility Status</AlertTitle>
                      <AlertDescription>
                        No service codes are currently eligible. Please check coverage dates.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>

              {/* Detailed View Tab */}
              <TabsContent value="detailed">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Detailed Service Code Utilization</span>
                      <Badge variant="outline">{utilization.length} Codes</Badge>
                    </CardTitle>
                    <CardDescription>
                      Expand each service code for detailed breakdown
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="multiple" className="w-full">
                      {utilization.map((item, index) => {
                        const computationalDetail = item.computationalDetail;
                        const intermediatePeriod = computationalDetail?.intermediatePeriodUsage;
                        const isEligible = computationalDetail?.eligibility || false;
                        const hasFunds = item.fundUtilization && item.fundUtilization.length > 0;
                        
                        return (
                          <AccordionItem key={`${item.code}-${index}`} value={item.code}>
                            <AccordionTrigger className="px-4 hover:bg-gray-50">
                              <div className="flex items-center justify-between w-full text-left">
                                <div className="flex items-center gap-4">
                                  <div className="text-left">
                                    <div className="font-mono font-semibold text-gray-900">
                                      {item.code}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge 
                                        variant={isEligible ? "default" : "secondary"} 
                                        className="text-xs"
                                      >
                                        {isEligible ? 'Eligible' : 'Not Eligible'}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {item.limitScope}
                                      </Badge>
                                      {computationalDetail?.nextAvailableDate && (
                                        <Badge variant="outline" className="text-xs">
                                          <Clock className="w-3 h-3 mr-1" />
                                          {formatDate(computationalDetail.nextAvailableDate)}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                  {/* Individual Limits */}
                                  {item.individualMaxLimit !== undefined && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className="text-right">
                                            <div className="text-sm text-gray-600">Individual</div>
                                            <div className="font-medium">
                                              {item.individualUtilisedLimit || 0}/{item.individualMaxLimit}
                                            </div>
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Utilization: {item.individualUtilisedLimit || 0} of {item.individualMaxLimit}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}

                                  {/* Available Count */}
                                  {computationalDetail?.individualLimitAvailableCount !== undefined && (
                                    <div className="text-right">
                                      <div className="text-sm text-gray-600">Available</div>
                                      <div className={`font-medium ${
                                        computationalDetail.individualLimitAvailableCount > 0 
                                          ? 'text-green-600' 
                                          : 'text-red-600'
                                      }`}>
                                        {computationalDetail.individualLimitAvailableCount}
                                      </div>
                                    </div>
                                  )}

                                  {/* Available Amount */}
                                  {computationalDetail?.limitAvailableAmount !== undefined && computationalDetail.limitAvailableAmount > 0 && (
                                    <div className="text-right">
                                      <div className="text-sm text-gray-600">Available Amt</div>
                                      <div className="font-medium text-green-600">
                                        {formatCurrency(computationalDetail.limitAvailableAmount)}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </AccordionTrigger>
                            
                            <AccordionContent>
                              <div className="p-4 space-y-6">
                                {/* Fund Utilization Section */}
                                {hasFunds && (
                                  <>
                                    <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                      <DollarSign className="w-4 h-4" />
                                      Fund Allocation
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      {item.fundUtilization!.map((fund, fundIndex) => {
                                        const fundProgress = fund.maxAmount > 0 
                                          ? (fund.utilisedAmount / fund.maxAmount) * 100 
                                          : 0;
                                        
                                        return (
                                          <Card key={`${fund.fundType}-${fundIndex}`} className="bg-gray-50">
                                            <CardHeader className="pb-2">
                                              <div className="flex items-center justify-between">
                                                <Badge variant="outline" className="bg-white">
                                                  {fund.fundType}
                                                </Badge>
                                                <span className={`text-xs font-medium ${
                                                  fund.availableAmount > 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                  {fund.availableAmount > 0 ? 'Available' : 'Exhausted'}
                                                </span>
                                              </div>
                                            </CardHeader>
                                            <CardContent>
                                              <div className="space-y-3">
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                  <div className="text-gray-600">Utilised:</div>
                                                  <div className="font-semibold text-right">
                                                    {formatCurrency(fund.utilisedAmount)}
                                                  </div>
                                                  <div className="text-gray-600">Max Amount:</div>
                                                  <div className="font-semibold text-right">
                                                    {formatCurrency(fund.maxAmount)}
                                                  </div>
                                                  <div className="text-gray-600">Available:</div>
                                                  <div className={`font-semibold text-right ${
                                                    fund.availableAmount > 0 ? 'text-green-600' : 'text-red-600'
                                                  }`}>
                                                    {formatCurrency(fund.availableAmount)}
                                                  </div>
                                                </div>
                                                
                                                <div className="mt-2">
                                                  <Progress value={fundProgress} className="h-2" />
                                                  <div className="text-xs text-gray-500 mt-1 text-center">
                                                    {fundProgress.toFixed(1)}% Utilized
                                                  </div>
                                                </div>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        );
                                      })}
                                    </div>
                                    <Separator />
                                  </>
                                )}

                                {/* Computational Details */}
                                {computationalDetail && (
                                  <>
                                    <h4 className="font-semibold text-gray-700">Policy & Coverage Details</h4>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Parameter</TableHead>
                                          <TableHead>Value</TableHead>
                                          <TableHead>Status</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        <TableRow>
                                          <TableCell className="font-medium">Coverage Start</TableCell>
                                          <TableCell>{formatDate(computationalDetail.coverageStartDate)}</TableCell>
                                          <TableCell>
                                            <Badge variant="outline" className="bg-blue-50">
                                              Active
                                            </Badge>
                                          </TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell className="font-medium">Coverage End</TableCell>
                                          <TableCell>{formatDate(computationalDetail.coverageEndDate)}</TableCell>
                                          <TableCell>
                                            {new Date(computationalDetail.coverageEndDate) > new Date() ? (
                                              <Badge variant="outline" className="bg-green-50">
                                                Valid
                                              </Badge>
                                            ) : (
                                              <Badge variant="destructive">Expired</Badge>
                                            )}
                                          </TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell className="font-medium">Policy Start</TableCell>
                                          <TableCell>{formatDateTime(computationalDetail.policyStartDate)}</TableCell>
                                          <TableCell>
                                            <Badge variant="outline" className="bg-blue-50">
                                              Active
                                            </Badge>
                                          </TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell className="font-medium">Policy End</TableCell>
                                          <TableCell>{formatDateTime(computationalDetail.policyEndDate)}</TableCell>
                                          <TableCell>
                                            {new Date(computationalDetail.policyEndDate) > new Date() ? (
                                              <Badge variant="outline" className="bg-green-50">
                                                Valid
                                              </Badge>
                                            ) : (
                                              <Badge variant="destructive">Expired</Badge>
                                            )}
                                          </TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell className="font-medium">Available Amount</TableCell>
                                          <TableCell>{formatCurrency(computationalDetail.limitAvailableAmount)}</TableCell>
                                          <TableCell>
                                            <Badge variant={computationalDetail.limitAvailableAmount > 0 ? "default" : "secondary"}>
                                              {computationalDetail.limitAvailableAmount > 0 ? 'Available' : 'Exhausted'}
                                            </Badge>
                                          </TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell className="font-medium">Eligibility</TableCell>
                                          <TableCell>{isEligible ? 'Eligible for service' : 'Not eligible'}</TableCell>
                                          <TableCell>
                                            {isEligible ? (
                                              <div className="flex items-center gap-1 text-green-600">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>Eligible</span>
                                              </div>
                                            ) : (
                                              <div className="flex items-center gap-1 text-red-600">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>Not Eligible</span>
                                              </div>
                                            )}
                                          </TableCell>
                                        </TableRow>
                                        {computationalDetail.nextAvailableDate && (
                                          <TableRow>
                                            <TableCell className="font-medium">Next Available Date</TableCell>
                                            <TableCell>{formatDate(computationalDetail.nextAvailableDate)}</TableCell>
                                            <TableCell>
                                              <Badge variant="outline" className="bg-blue-50">
                                                Scheduled
                                              </Badge>
                                            </TableCell>
                                          </TableRow>
                                        )}
                                      </TableBody>
                                    </Table>

                                    {/* Intermediate Period Usage */}
                                    {intermediatePeriod && 
                                      (intermediatePeriod.individualUtilisedDuringPeriod !== undefined || 
                                       intermediatePeriod.individualMaxDuringPeriod !== undefined) && (
                                      <div className="mt-6">
                                        <h5 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                          <Clock className="w-4 h-4" />
                                          Intermediate Period Usage
                                        </h5>
                                        <Card className="bg-yellow-50 border-yellow-200">
                                          <CardContent className="pt-4">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                              {intermediatePeriod.individualUtilisedDuringPeriod !== undefined && (
                                                <div>
                                                  <div className="text-sm text-gray-600">Used in Period</div>
                                                  <div className="text-lg font-semibold">
                                                    {intermediatePeriod.individualUtilisedDuringPeriod}
                                                  </div>
                                                </div>
                                              )}
                                              {intermediatePeriod.individualMaxDuringPeriod !== undefined && (
                                                <div>
                                                  <div className="text-sm text-gray-600">Period Max</div>
                                                  <div className="text-lg font-semibold">
                                                    {intermediatePeriod.individualMaxDuringPeriod}
                                                  </div>
                                                </div>
                                              )}
                                              {intermediatePeriod.period !== undefined && (
                                                <div>
                                                  <div className="text-sm text-gray-600">Period</div>
                                                  <div className="text-lg font-semibold">
                                                    {intermediatePeriod.period} days
                                                  </div>
                                                </div>
                                              )}
                                              {intermediatePeriod.lastUsageDate && (
                                                <div>
                                                  <div className="text-sm text-gray-600">Last Usage</div>
                                                  <div className="text-lg font-semibold">
                                                    {formatDate(intermediatePeriod.lastUsageDate)}
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Fund Analysis Tab */}
              <TabsContent value="funds">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Fund Utilization Analysis
                    </CardTitle>
                    <CardDescription>
                      Comprehensive breakdown of fund allocation across all service codes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Aggregate Fund Summary */}
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold mb-4">Total Fund Allocation</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(() => {
                          const fundTotals: Record<string, { used: number; max: number; available: number }> = {};
                          
                          utilization.forEach(item => {
                            item.fundUtilization?.forEach(fund => {
                              if (!fundTotals[fund.fundType]) {
                                fundTotals[fund.fundType] = { used: 0, max: 0, available: 0 };
                              }
                              fundTotals[fund.fundType].used += fund.utilisedAmount;
                              fundTotals[fund.fundType].max += fund.maxAmount;
                              fundTotals[fund.fundType].available += fund.availableAmount;
                            });
                          });

                          return Object.entries(fundTotals).map(([fundType, totals]) => {
                            const percentage = totals.max > 0 ? (totals.used / totals.max) * 100 : 0;
                            
                            return (
                              <Card key={fundType}>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base">{fundType}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span>Utilized:</span>
                                      <span className="font-semibold">
                                        {formatCurrency(totals.used)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Total:</span>
                                      <span className="font-semibold">
                                        {formatCurrency(totals.max)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Available:</span>
                                      <span className={`font-semibold ${
                                        totals.available > 0 ? 'text-green-600' : 'text-red-600'
                                      }`}>
                                        {formatCurrency(totals.available)}
                                      </span>
                                    </div>
                                    <Progress 
                                      value={percentage} 
                                      className="h-2 mt-2"
                                      indicatorClassName={
                                        percentage >= 100 
                                          ? 'bg-red-500' 
                                          : percentage >= 80 
                                          ? 'bg-yellow-500' 
                                          : 'bg-green-500'
                                      }
                                    />
                                    <div className="text-xs text-gray-500 text-center">
                                      {percentage.toFixed(1)}% utilized
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Fund Details Table */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Service Code</TableHead>
                            <TableHead>Fund Type</TableHead>
                            <TableHead>Utilized Amount</TableHead>
                            <TableHead>Max Amount</TableHead>
                            <TableHead>Available Amount</TableHead>
                            <TableHead>Utilization %</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {utilization.flatMap(item => 
                            (item.fundUtilization || []).map((fund, idx) => {
                              const percentage = fund.maxAmount > 0 ? (fund.utilisedAmount / fund.maxAmount) * 100 : 0;
                              
                              return (
                                <TableRow key={`${item.code}-${fund.fundType}-${idx}`}>
                                  <TableCell className="font-mono">{item.code}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{fund.fundType}</Badge>
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {formatCurrency(fund.utilisedAmount)}
                                  </TableCell>
                                  <TableCell>{formatCurrency(fund.maxAmount)}</TableCell>
                                  <TableCell className={
                                    fund.availableAmount > 0 ? 'text-green-600' : 'text-red-600'
                                  }>
                                    {formatCurrency(fund.availableAmount)}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Progress value={percentage} className="h-2 w-16" />
                                      <span>{percentage.toFixed(1)}%</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant={
                                      fund.availableAmount > 0 
                                        ? percentage >= 80 
                                          ? 'warning' 
                                          : 'default'
                                        : 'destructive'
                                    }>
                                      {fund.availableAmount > 0 ? 'Available' : 'Exhausted'}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : selectedPackage ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <PackageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Utilization Data</h3>
                <p className="text-gray-500">
                  No utilization records found for the selected package.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <PackageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a Package</h3>
                <p className="text-gray-500">
                  Choose a package from the dropdown above to view utilization details.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}