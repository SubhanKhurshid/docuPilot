import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileTextIcon,
  PlusIcon,
  TrendingUpIcon,
  WalletIcon,
CreditCardIcon,
  DollarSignIcon,
  MessageCircleIcon,
  BotIcon,
  EyeIcon,
} from 'lucide-react';
import { apiService } from '../services/api';
import { useChat } from '../contexts/ChatContext';

interface CaseData {
  id: string;
  user_id: string;
  injury_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  settlement_estimate?: {
    low_estimate: number;
    high_estimate: number;
    confidence: string;
  };
  demand_letter?: string;
  documents?: any[];
  required_documents?: string[];
}

import { SubscriptionManager } from '../components/subscription/SubscriptionManager';


const Dashboard = () => {
  const { state: chatState } = useChat();
  const [cases, setCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [showCreateCase] = useState(false);

  // Load user cases
  useEffect(() => {
    const loadCases = async () => {
      try {
        setLoading(true);
        const response = await apiService.getUserCases(chatState.currentUserId);
        setCases(response.cases);
      } catch (error) {
        console.error('Failed to load cases:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCases();
  }, [chatState.currentUserId]);

  // Listen for case creation events from chat
  useEffect(() => {
    const handleCaseCreated = () => {
      // Reload cases when a new case is created
      const loadCases = async () => {
        try {
          const response = await apiService.getUserCases(chatState.currentUserId);
          setCases(response.cases);
        } catch (error) {
          console.error('Failed to reload cases:', error);
        }
      };
      loadCases();
    };

    window.addEventListener('caseCreated', handleCaseCreated);
    return () => window.removeEventListener('caseCreated', handleCaseCreated);
  }, [chatState.currentUserId]);

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'initial': 'bg-gray-500',
      'collecting_documents': 'bg-yellow-500',
      'reviewing': 'bg-blue-500',
      'generating_demand_letter': 'bg-purple-500',
      'demand_sent': 'bg-orange-500',
      'negotiating': 'bg-indigo-500',
      'settlement_reached': 'bg-green-500',
      'litigation': 'bg-red-500',
      'closed': 'bg-gray-600'
    };
    return statusColors[status] || 'bg-gray-500';
  };

  const getStatusText = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        <div
          className="absolute inset-0 opacity-[0.01]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(141, 255, 45, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(141, 255, 45, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        />
        <div className="absolute top-32 left-20 w-1 h-1 bg-[#8dff2d] rounded-full opacity-20" />
        <div className="absolute top-64 right-32 w-1 h-1 bg-[#8dff2d] rounded-full opacity-15" />
        <div className="absolute bottom-64 left-40 w-1 h-1 bg-[#8dff2d] rounded-full opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-transparent to-[#111111]" />
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-white">Case Dashboard</h1>
            <p className="text-gray-300">Manage your personal injury cases</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link
              to="/chat"
              className="flex items-center gap-2 px-4 py-2 bg-[#8dff2d] text-black rounded-lg hover:bg-[#7be525] transition-colors font-medium"
            >
              <BotIcon className="h-4 w-4" />
              Start New Case
            </Link>
            <button
              onClick={() => setShowCreateCase(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#333333] text-white rounded-lg hover:bg-[#444444] transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Create Case
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#0a0a0a]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#333333]/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Cases</p>
                <p className="text-2xl font-bold text-white">{cases.length}</p>
              </div>
              <FileTextIcon className="h-8 w-8 text-[#8dff2d]" />
            </div>
          </div>
          
          <div className="bg-[#0a0a0a]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#333333]/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Cases</p>
                <p className="text-2xl font-bold text-white">
                  {cases.filter(c => !['closed', 'settlement_reached'].includes(c.status)).length}
                </p>
              </div>
              <TrendingUpIcon className="h-8 w-8 text-[#8dff2d]" />
            </div>
          </div>
          
          <div className="bg-[#0a0a0a]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#333333]/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Settlements</p>
                <p className="text-2xl font-bold text-white">
                  {cases.filter(c => c.status === 'settlement_reached').length}
                </p>
              </div>
              <DollarSignIcon className="h-8 w-8 text-[#8dff2d]" />
            </div>
          </div>
          
          <div className="bg-[#0a0a0a]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#333333]/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Value</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(
                    cases.reduce((sum, case_) => 
                      sum + (case_.settlement_estimate?.high_estimate || 0), 0
                    )
                  )}
                </p>
              </div>
              <WalletIcon className="h-8 w-8 text-[#8dff2d]" />
            </div>
          </div>
        </div>

        {/* Cases Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8dff2d]"></div>
          </div>
        ) : cases.length === 0 ? (
          <div className="text-center py-12">
            <FileTextIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Cases Yet</h3>
            <p className="text-gray-400 mb-6">Start by creating your first personal injury case</p>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#8dff2d] text-black rounded-lg hover:bg-[#7be525] transition-colors font-medium"
            >
              <BotIcon className="h-5 w-5" />
              Start with AI Assistant
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((case_) => (
              <motion.div
                key={case_.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0a0a0a]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#333333]/50 hover:border-[#8dff2d]/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white capitalize">
                      {case_.injury_type.replace('-', ' ')}
                    </h3>
                    <p className="text-sm text-gray-400">Case #{case_.id.split('_').pop()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)} text-white`}>
                    {getStatusText(case_.status)}
                  </span>
                </div>

                {case_.settlement_estimate && (
                  <div className="mb-4 p-3 bg-[#111111]/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSignIcon className="h-4 w-4 text-[#8dff2d]" />
                      <span className="text-sm font-medium text-white">Settlement Estimate</span>
                    </div>
                    <div className="text-lg font-bold text-[#8dff2d]">
                      {formatCurrency(case_.settlement_estimate.low_estimate)} - {formatCurrency(case_.settlement_estimate.high_estimate)}
                    </div>
                    <div className="text-xs text-gray-400">
                      Confidence: {case_.settlement_estimate.confidence}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>Created: {new Date(case_.created_at).toLocaleDateString()}</span>
                  <span>Updated: {new Date(case_.updated_at).toLocaleDateString()}</span>
                </div>


                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCase(case_)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#333333] text-white rounded-lg hover:bg-[#444444] transition-colors text-sm"
                  >
                    <EyeIcon className="h-4 w-4" />
                    View Details
                  </button>
                  <Link
                    to="/chat"
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-[#8dff2d] text-black rounded-lg hover:bg-[#7be525] transition-colors text-sm"
                  >
                    <MessageCircleIcon className="h-4 w-4" />
                    Chat
                  </Link>

            {/* Subscription Management Section */}
            <div className="mb-8 bg-[#0a0a0a]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#333333]/50">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 text-white">
                <CreditCardIcon className="h-5 w-5 text-[#8dff2d]" />
                Subscription Management
              </h2>
              <SubscriptionManager />
            </div>

            {/* Main Dashboard Sections - keeping original structure */}
            <div className="">
              {/* Left Column - Documents */}
              <div className="lg:col-span-2 space-y-6">
                {/* Documents Section - keeping original structure but updated styling */}
                <div className="bg-[#0a0a0a]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#333333]/50">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
                      <FileTextIcon className="h-5 w-5 text-[#8dff2d]" />
                      Documents
                    </h2>
                    <button className="text-sm text-[#8dff2d] flex items-center gap-1 font-medium hover:text-[#7be525] transition-colors">
                      <PlusIcon className="h-4 w-4" />
                      Generate New
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-gray-400 border-b border-[#333333]">
                          <th className="pb-3 font-medium">Form Name</th>
                          <th className="pb-3 font-medium">Status</th>
                          <th className="pb-3 font-medium">Date</th>
                          <th className="pb-3 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#333333]">
                        {documents.slice(0, 7).map((doc) => (
                          <tr key={doc.id} className="text-sm hover:bg-[#111111]/30 transition-colors">
                            <td className="py-3 pr-2">
                              <div className="flex items-center gap-2">
                                <FileTextIcon className="h-4 w-4 text-[#8dff2d]" />
                                <span className="text-white font-normal">{doc.name}</span>
                              </div>
                            </td>
                            <td className="py-3 pr-2">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${doc.status === 'Generated'
                                  ? 'bg-[#8dff2d]/10 text-[#8dff2d] border border-[#8dff2d]/20'
                                  : 'bg-[#333333]/50 text-gray-400 border border-[#333333]'
                                  }`}
                              >
                                {doc.status === 'Generated' ? (
                                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                                ) : (
                                  <ClockIcon className="h-3 w-3 mr-1" />
                                )}
                                {doc.status}
                              </span>
                            </td>
                            <td className="py-3 pr-2 text-gray-400 font-normal">
                              {doc.date}
                            </td>
                            <td className="py-3">
                              <button
                                className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${doc.status === 'Generated'
                                  ? 'bg-[#333333] text-white hover:bg-[#444444] border border-[#444444]'
                                  : 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed border border-[#333333]'
                                  }`}
                              >
                                {doc.status === 'Generated'
                                  ? 'Download'
                                  : 'Unavailable'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-center">
                    <button className="text-sm text-[#8dff2d] font-medium hover:text-[#7be525] transition-colors">
                      View all 15 documents
                    </button>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Case Detail Modal */}
        {selectedCase && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#0a0a0a] rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Case Details</h2>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Case ID</label>
                  <p className="text-white font-mono">{selectedCase.id}</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">Injury Type</label>
                  <p className="text-white capitalize">{selectedCase.injury_type.replace('-', ' ')}</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">Status</label>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCase.status)} text-white`}>
                    {getStatusText(selectedCase.status)}
                  </span>
                </div>
                
                {selectedCase.settlement_estimate && (
                  <div>
                    <label className="text-sm text-gray-400">Settlement Estimate</label>
                    <p className="text-lg font-bold text-[#8dff2d]">
                      {formatCurrency(selectedCase.settlement_estimate.low_estimate)} - {formatCurrency(selectedCase.settlement_estimate.high_estimate)}
                    </p>
                    <p className="text-sm text-gray-400">
                      Confidence: {selectedCase.settlement_estimate.confidence}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-2 pt-4">
                  <Link
                    to="/chat"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#8dff2d] text-black rounded-lg hover:bg-[#7be525] transition-colors"
                  >
                    <MessageCircleIcon className="h-4 w-4" />
                    Continue Chat
                  </Link>
                  {selectedCase.demand_letter && (
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#333333] text-white rounded-lg hover:bg-[#444444] transition-colors">
                      <DownloadIcon className="h-4 w-4" />
                      Download Letter
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default Dashboard;