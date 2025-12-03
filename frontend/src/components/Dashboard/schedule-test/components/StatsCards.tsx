'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Calendar, Mail, CheckCircle, XCircle, Clock, Zap, AlertTriangle } from 'lucide-react'
import { DashboardStats, TestCaseSummary } from '@/lib/types';
import { getDashboardStats } from '@/lib/api';

interface StatsCardsProps {
  refreshKey?: number;
}

// Realistic dummy data
const defaultStats: TestCaseSummary = {
  id: 1,
  name: 'Regression Test Suite',
  code: 'REG-001',
  intervention_name: 'User Authentication Flow',
  total_runs: 154,
  passes: 128,
  failures: 18,
  last_run: '2024-01-15T10:30:00Z',
  cancelled_runs: 3,
  errors: 5,
  in_progress: 8,
  execution_time: 1247
};

export default function StatsCards({ refreshKey }: StatsCardsProps) {
  const [stats, setStats] = useState<TestCaseSummary>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use dummy data for demonstration
      setStats(defaultStats);
      
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setError('Failed to load dashboard statistics');
      setStats(defaultStats); // Fallback to dummy data on error
    } finally {
      setLoading(false);
    }
  };

  // Calculate derived values
  const successRate = stats.total_runs > 0 ? ((stats.passes / stats.total_runs) * 100).toFixed(1) : '0';
  const failRate = stats.total_runs > 0 ? ((stats.failures / stats.total_runs) * 100).toFixed(1) : '0';

  const statCards = [
    {
      title: 'Total Test Runs',
      value: stats.total_runs.toString(),
      icon: Activity,
      description: 'All test executions',
      color: 'text-blue-600'
    },
    {
      title: 'Execution Time',
      value: `${Math.floor(stats.execution_time / 60)}m ${stats.execution_time % 60}s`,
      icon: Clock,
      description: 'Total execution time',
      color: 'text-purple-600'
    },
    {
      title: 'Success Rate',
      value: `${successRate}%`,
      icon: CheckCircle,
      description: `${stats.passes} passed out of ${stats.total_runs}`,
      color: 'text-emerald-600'
    },
    {
      title: 'Failures',
      value: stats.failures.toString(),
      icon: XCircle,
      description: `${failRate}% failure rate`,
      color: 'text-red-600'
    },
    {
      title: 'In Progress',
      value: stats.in_progress.toString(),
      icon: Zap,
      description: 'Tests currently running',
      color: 'text-yellow-600'
    },
    {
      title: 'Cancelled',
      value: stats.cancelled_runs.toString(),
      icon: AlertTriangle,
      description: 'Tests cancelled',
      color: 'text-orange-600'
    },
    {
      title: 'Errors',
      value: stats.errors.toString(),
      icon: XCircle,
      description: 'Execution errors',
      color: 'text-red-600'
    },
    {
      title: 'Last Run',
      value: new Date(stats.last_run).toLocaleDateString(),
      icon: Calendar,
      description: 'Most recent execution',
      color: 'text-gray-600'
    }
  ];

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((_, index) => (
          <Card key={index}>
            <CardContent className="p-3">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardContent className="p-3">
            <div className="text-center text-red-600">
              <XCircle className="h-8 w-8 mx-auto mb-2" />
              <p>{error}</p>
              <button 
                onClick={fetchStats}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="font-semibold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}