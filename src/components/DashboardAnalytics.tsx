import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3Icon,
  TrendingUpIcon,
  DollarSignIcon,
  ClockIcon,
  FileTextIcon,
  CheckCircleIcon,
  ActivityIcon,
  BriefcaseIcon,
} from 'lucide-react';
import { apiClient, CaseDetails } from '../lib/api';

interface AnalyticsData {
  totalCases: number;
  activeCases: number;
  completedCases: number;
  totalSettlementValue: number;
  averageSettlementTime: number;
  documentsProcessed: number;
  aiAnalysisAccuracy: number;
  monthlyTrends: {
    month: string;
    cases: number;
    settlements: number;
  }[];
  caseStatusDistribution: {
    status: string;
    count: number;
    percentage: number;
  }[];
  topInjuryTypes: {
    type: string;
    count: number;
    averageSettlement: number;
  }[];
}

interface DashboardAnalyticsProps {
  userId: string;
}

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ userId }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [, setCases] = useState<CaseDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6months');

  useEffect(() => {
    loadAnalytics();
  }, [userId, timeRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      
      // Load real case data from API
      const response = await apiClient.getUserCases(userId) as { cases: CaseDetails[] };
      const userCases = response.cases || [];
      setCases(userCases);

      // Calculate analytics from real data
      const totalCases = userCases.length;
      const activeCases = userCases.filter(c => c.status === 'in_progress').length;
      const completedCases = userCases.filter(c => c.status === 'demand_letter_generated').length;
      
      const totalSettlementValue = userCases.reduce((sum: number, c: CaseDetails) => 
        sum + (c.ai_analysis_summary?.total_financial_impact || 0), 0
      );
      
      const documentsProcessed = userCases.reduce((sum: number, c: CaseDetails) => 
        sum + (c.completed_docs?.length || 0), 0
      );

      // Calculate case status distribution
      const statusCounts = userCases.reduce((acc: Record<string, number>, c: CaseDetails) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const caseStatusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
        status: status.replace('_', ' ').toUpperCase(),
        count: count as number,
        percentage: totalCases > 0 ? Math.round((count as number / totalCases) * 100) : 0
      }));

      // Calculate top injury types
      const injuryCounts = userCases.reduce((acc: Record<string, number>, c: CaseDetails) => {
        const injury = c.injury_name.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
        acc[injury] = (acc[injury] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topInjuryTypes = Object.entries(injuryCounts)
        .map(([type, count]) => ({
          type,
          count: count as number,
          averageSettlement: Math.round(totalSettlementValue / totalCases) || 0
        }))
        .sort((a, b) => (b.count as number) - (a.count as number))
        .slice(0, 4);

      // Generate monthly trends (mock data for now)
      const monthlyTrends = [
        { month: 'Jan', cases: Math.floor(totalCases * 0.1), settlements: Math.floor(completedCases * 0.1) },
        { month: 'Feb', cases: Math.floor(totalCases * 0.15), settlements: Math.floor(completedCases * 0.15) },
        { month: 'Mar', cases: Math.floor(totalCases * 0.2), settlements: Math.floor(completedCases * 0.2) },
        { month: 'Apr', cases: Math.floor(totalCases * 0.25), settlements: Math.floor(completedCases * 0.25) },
        { month: 'May', cases: Math.floor(totalCases * 0.2), settlements: Math.floor(completedCases * 0.2) },
        { month: 'Jun', cases: Math.floor(totalCases * 0.1), settlements: Math.floor(completedCases * 0.1) },
      ];

      setAnalytics({
        totalCases,
        activeCases,
        completedCases,
        totalSettlementValue,
        averageSettlementTime: 45, // Mock data
        documentsProcessed,
        aiAnalysisAccuracy: 94.2, // Mock data
        monthlyTrends,
        caseStatusDistribution,
        topInjuryTypes,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    subtitle?: string;
    trend?: { value: number; isPositive: boolean };
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trend.isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            <TrendingUpIcon className={`h-4 w-4 ${!trend.isPositive ? 'rotate-180' : ''}`} />
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="flex-1 bg-black p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8dff2d] mx-auto mb-4"></div>
          <p className="text-gray-300">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex-1 bg-black p-6 flex items-center justify-center">
        <div className="text-center">
          <BarChart3Icon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No analytics data</h3>
          <p className="text-gray-400">Analytics will appear once you have case data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-black p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
              <p className="text-gray-300">Track your case performance and insights</p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#8dff2d] focus:border-transparent"
            >
              <option value="3months">Last 3 months</option>
              <option value="6months">Last 6 months</option>
              <option value="1year">Last year</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Cases"
            value={analytics.totalCases}
            icon={BriefcaseIcon}
            color="bg-blue-600"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Active Cases"
            value={analytics.activeCases}
            icon={ActivityIcon}
            color="bg-yellow-600"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Completed Cases"
            value={analytics.completedCases}
            icon={CheckCircleIcon}
            color="bg-[#8dff2d]"
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            title="Total Settlement Value"
            value={`$${analytics.totalSettlementValue.toLocaleString()}`}
            icon={DollarSignIcon}
            color="bg-green-600"
            trend={{ value: 23, isPositive: true }}
          />
          <StatCard
            title="Average Settlement Time"
            value={`${analytics.averageSettlementTime} days`}
            icon={ClockIcon}
            color="bg-purple-600"
          />
          <StatCard
            title="Documents Processed"
            value={analytics.documentsProcessed}
            icon={FileTextIcon}
            color="bg-indigo-600"
            trend={{ value: 18, isPositive: true }}
          />
          <StatCard
            title="AI Analysis Accuracy"
            value={`${analytics.aiAnalysisAccuracy}%`}
            icon={TrendingUpIcon}
            color="bg-[#8dff2d]"
            trend={{ value: 2, isPositive: true }}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Trends */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-6">Monthly Trends</h3>
            <div className="space-y-4">
              {analytics.monthlyTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">{trend.month}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#8dff2d] rounded-full"></div>
                      <span className="text-sm text-gray-400">Cases: {trend.cases}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-400">Settlements: {trend.settlements}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Case Status Distribution */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-6">Case Status Distribution</h3>
            <div className="space-y-4">
              {analytics.caseStatusDistribution.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">{status.status}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-[#8dff2d] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${status.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-400 w-12 text-right">{status.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Injury Types */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-6">Top Injury Types</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Injury Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Cases</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Avg. Settlement</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topInjuryTypes.map((injury, index) => (
                  <tr key={index} className="border-b border-gray-800">
                    <td className="py-3 px-4 text-sm text-white">{injury.type}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{injury.count}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">
                      ${injury.averageSettlement.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;