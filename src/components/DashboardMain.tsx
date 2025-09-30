import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  TrendingUpIcon,
  DollarSignIcon,
  BriefcaseIcon,
  PlusIcon,
  EyeIcon,
  DownloadIcon,
} from 'lucide-react';
import { apiClient, CaseDetails } from '../lib/api';

interface DashboardMainProps {
  userId: string;
  onCaseUpdate?: (caseId: string, status: string) => void;
}

const DashboardMain: React.FC<DashboardMainProps> = ({ userId, onCaseUpdate }) => {
  const [cases, setCases] = useState<CaseDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setSelectedCase] = useState<CaseDetails | null>(null);

  useEffect(() => {
    loadUserCases();
  }, [userId]);

  const loadUserCases = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getUserCases(userId) as { cases: CaseDetails[] };
      setCases(response.cases);
    } catch (error) {
      console.error('Error loading cases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'demand_letter_generated':
        return 'bg-[#8dff2d] text-black border-[#8dff2d]';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <ClockIcon className="h-4 w-4" />;
      case 'in_progress':
        return <AlertCircleIcon className="h-4 w-4" />;
      case 'demand_letter_generated':
        return <CheckCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const formatInjuryName = (injury: string) => {
    return injury.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const totalFinancialImpact = cases.reduce((sum, case_) => 
    sum + (case_.ai_analysis_summary?.total_financial_impact || 0), 0
  );

  const completedCases = cases.filter(case_ => 
    case_.status === 'demand_letter_generated'
  ).length;

  return (
    <div className="flex-1 bg-black p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-300">Manage your personal injury cases and track progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Total Cases</p>
                <p className="text-2xl font-bold text-white">{cases.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                <BriefcaseIcon className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Completed Cases</p>
                <p className="text-2xl font-bold text-white">{completedCases}</p>
              </div>
              <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Total Value</p>
                <p className="text-2xl font-bold text-white">
                  ${totalFinancialImpact.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-900 rounded-lg flex items-center justify-center">
                <DollarSignIcon className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Success Rate</p>
                <p className="text-2xl font-bold text-white">
                  {cases.length > 0 ? Math.round((completedCases / cases.length) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center">
                <TrendingUpIcon className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Cases Section */}
        <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Your Cases</h2>
                <p className="text-gray-300">Track the progress of your personal injury claims</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#8dff2d] text-black rounded-lg hover:bg-[#7be525] transition-colors font-semibold">
                <PlusIcon className="h-4 w-4" />
                New Case
              </button>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : cases.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                  <BriefcaseIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No cases yet</h3>
                <p className="text-gray-400 mb-6">Start a conversation with our AI assistant to begin your first case.</p>
                <button className="px-6 py-3 bg-[#8dff2d] text-black rounded-lg hover:bg-[#7be525] transition-colors font-semibold">
                  Start New Case
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cases.map((case_, index) => (
                  <motion.div
                    key={case_.case_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                          <BriefcaseIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">
                            {formatInjuryName(case_.injury_name)}
                          </h3>
                          <p className="text-sm text-gray-400">Case #{case_.case_id.slice(-8)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(case_.status)}`}>
                          {getStatusIcon(case_.status)}
                          {case_.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <button
                          onClick={() => setSelectedCase(case_)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-400">Progress</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-[#8dff2d] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${case_.progress_percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-white">
                            {Math.round(case_.progress_percentage)}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">Documents</p>
                        <p className="text-sm font-medium text-white">
                          {case_.completed_docs?.length || 0} / {case_.required_docs?.length || 0} completed
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">Estimated Value</p>
                        <p className="text-sm font-medium text-white">
                          ${case_.ai_analysis_summary?.total_financial_impact?.toLocaleString() || '0'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {(case_.required_docs || []).map((doc, docIndex) => (
                          <span
                            key={docIndex}
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              (case_.completed_docs || []).includes(doc)
                                ? 'bg-[#8dff2d] text-black'
                                : 'bg-gray-700 text-gray-300'
                            }`}
                          >
                            {doc.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors">
                          View Details
                        </button>
                        {case_.status === 'demand_letter_generated' && (
                          <button className="px-3 py-1 text-sm bg-[#8dff2d] text-black rounded hover:bg-[#7be525] transition-colors flex items-center gap-1 font-medium">
                            <DownloadIcon className="h-4 w-4" />
                            Download Letter
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;
