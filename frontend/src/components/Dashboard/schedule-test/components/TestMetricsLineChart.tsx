'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertTriangle, Ban } from 'lucide-react'
import { useState } from 'react'

// Mock data for one week of test runs
const weeklyTestData = [
{ date: 'Nov 11', passed: 45, failed: 8, errors: 2, cancelled: 1, total: 56 },
  { date: 'Nov 12', passed: 52, failed: 6, errors: 1, cancelled: 0, total: 59 },
  { date: 'Nov 13', passed: 38, failed: 12, errors: 3, cancelled: 2, total: 55 },
  { date: 'Nov 14', passed: 61, failed: 4, errors: 0, cancelled: 1, total: 66 },
  { date: 'Nov 15', passed: 49, failed: 7, errors: 2, cancelled: 0, total: 58 },
  { date: 'Nov 16', passed: 55, failed: 5, errors: 1, cancelled: 1, total: 62 },
  { date: 'Nov 17', passed: 58, failed: 3, errors: 0, cancelled: 0, total: 61 },
]

const colors = {
  passed: '#10b981',
  failed: '#ef4444',
  errors: '#f59e0b',
  cancelled: '#6b7280',
}

const metricConfigs = {
  passed: { label: 'Passed', icon: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-500' },
  failed: { label: 'Failed', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-500' },
  errors: { label: 'Errors', icon: AlertTriangle, color: 'text-amber-600', bgColor: 'bg-amber-500' },
  cancelled: { label: 'Cancelled', icon: Ban, color: 'text-gray-600', bgColor: 'bg-gray-500' },
}

export default function TestMetricsLineChart() {
    const [activeMetric, setActiveMetric] = useState<string | null>(null);
    const weeklyTotals = weeklyTestData.reduce(
    (acc, day) => ({
      passed: acc.passed + day.passed,
      failed: acc.failed + day.failed,
      errors: acc.errors + day.errors,
      cancelled: acc.cancelled + day.cancelled,
      total: acc.total + day.total,
    }),
    { passed: 0, failed: 0, errors: 0, cancelled: 0, total: 0 }
  );
  const successRate = ((weeklyTotals.passed / weeklyTotals.total) * 100).toFixed(1);
  return (
    <Card className="w-full">
      <CardHeader>
        {/* <CardTitle>Test Metrics - Last 7 Days</CardTitle>
        <CardDescription>
          Daily test execution results over the past 7 days
        </CardDescription> */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Test Metrics - Last 7 Days</CardTitle>
            <CardDescription>
              Daily test execution trends and performance overview
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              Success Rate: {successRate}%
            </Badge>
            <Badge variant="outline" className="text-sm">
              Total: {weeklyTotals.total} tests
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={weeklyTestData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'currentColor' }}
                tickLine={{ stroke: 'currentColor' }}
                axisLine={{ stroke: 'currentColor' }}
              />
              <YAxis 
                tick={{ fill: 'currentColor' }}
                tickLine={{ stroke: 'currentColor' }}
                axisLine={{ stroke: 'currentColor' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
                labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                formatter={(value: number) => [value, 'Tests']}
              />
              {(Object.keys(metricConfigs) as Array<keyof typeof metricConfigs>).map((metric) => (
                <Line 
                  key={metric}
                  type="monotone" 
                  dataKey={metric} 
                  stroke={colors[metric]}
                  strokeWidth={activeMetric ? (activeMetric === metric ? 3 : 1.5) : 2}
                  opacity={activeMetric ? (activeMetric === metric ? 1 : 0.6) : 1}
                  dot={{ fill: colors[metric], strokeWidth: 2, r: activeMetric === metric ? 5 : 3 }}
                  activeDot={{ r: 6, stroke: colors[metric], strokeWidth: 2 }}
                  name={metricConfigs[metric].label}
                  onMouseEnter={() => setActiveMetric(metric)}
                  onMouseLeave={() => setActiveMetric(null)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {(Object.keys(metricConfigs) as Array<keyof typeof metricConfigs>).map((metric) => {
            const config = metricConfigs[metric]
            const Icon = config.icon
            const total = weeklyTotals[metric]
            const percentage = ((total / weeklyTotals.total) * 100).toFixed(1)
            
            return (
              <div
                key={metric}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                  activeMetric === metric 
                    ? 'bg-accent border-foreground/20' 
                    : 'bg-background border-border hover:bg-accent/50'
                }`}
                onMouseEnter={() => setActiveMetric(metric)}
                onMouseLeave={() => setActiveMetric(null)}
              >
                <div className={`p-2 rounded-full ${config.bgColor} bg-opacity-10`}>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {config.label}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-foreground">{total}</span>
                    <span className="text-xs text-muted-foreground">({percentage}%)</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}