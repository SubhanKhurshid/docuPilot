import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileTextIcon,
  UploadIcon,
  DownloadIcon,
  EyeIcon,
  TrashIcon,
  SearchIcon,
  CalendarIcon,
  FileIcon,
  ImageIcon,
  FileSpreadsheetIcon,
  PlusIcon,
  MailIcon,
} from 'lucide-react';
import { apiClient, CaseDocument, GenerateDocumentRequest } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploaded_at: string;
  status: 'analyzed' | 'pending' | 'error';
  ai_analysis?: any;
}

interface Case {
  id: string;
  injury_name: string;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}

interface DashboardDocumentsProps {
  userId: string;
  currentCaseId?: string;
}

const DashboardDocuments: React.FC<DashboardDocumentsProps> = ({ userId, currentCaseId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [caseDocuments, setCaseDocuments] = useState<CaseDocument[]>([]);
  const [allCases, setAllCases] = useState<Case[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | undefined>(currentCaseId);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadDocuments();
    loadAllCases();
    if (currentCaseId) {
      loadCaseDocuments();
    }
  }, [userId, currentCaseId]);

  useEffect(() => {
    if (selectedCaseId) {
      loadCaseDocuments();
    }
  }, [selectedCaseId]);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      // Load user-uploaded documents (if any)
      // For now, we'll focus on case-generated documents
      setDocuments([]);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllCases = async () => {
    if (!user) return;
    
    try {
      const response = await apiClient.getUserCases(user.id) as { cases: Case[] };
      setAllCases(response.cases);
      
      // If no case is selected, select the first one
      if (!selectedCaseId && response.cases.length > 0) {
        setSelectedCaseId(response.cases[0].id);
      }
    } catch (error) {
      console.error('Error loading cases:', error);
    }
  };

  const loadCaseDocuments = async () => {
    if (!selectedCaseId || !user) return;
    
    try {
      const response = await apiClient.getCaseDocuments(selectedCaseId, user.id);
      setCaseDocuments(response.documents);
    } catch (error) {
      console.error('Error loading case documents:', error);
    }
  };

  const handleGenerateDocument = async (documentType: 'claim_packet' | 'demand_letter') => {
    if (!selectedCaseId || !user) return;
    
    setIsGenerating(true);
    try {
      const request: GenerateDocumentRequest = {
        case_id: selectedCaseId,
        document_type: documentType,
        clerk_user_id: user.id
      };
      
      const response = await apiClient.generateDocument(request);
      
      // Download the PDF
      const link = document.createElement('a');
      link.href = response.download_url;
      link.download = response.document_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Reload case documents
      await loadCaseDocuments();
      
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Error generating document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // TODO: Implement actual file upload to backend
      console.log('Uploading file:', file.name);
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDocument: Document = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type.includes('image') ? 'image' : 'pdf',
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploaded_at: new Date().toISOString().split('T')[0],
        status: 'pending',
      };
      
      setDocuments(prev => [newDocument, ...prev]);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileTextIcon className="h-5 w-5 text-red-400" />;
      case 'image':
        return <ImageIcon className="h-5 w-5 text-blue-400" />;
      case 'spreadsheet':
        return <FileSpreadsheetIcon className="h-5 w-5 text-green-400" />;
      default:
        return <FileIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzed':
        return 'bg-[#8dff2d] text-black';
      case 'pending':
        return 'bg-yellow-600 text-yellow-100';
      case 'error':
        return 'bg-red-600 text-red-100';
      default:
        return 'bg-gray-600 text-gray-100';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 bg-black p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Documents</h1>
          <p className="text-gray-300">Manage and analyze your case documents</p>
        </div>

        {/* Case Selection */}
        {allCases.length > 0 && (
          <div className="mb-6 p-4 bg-gray-900 rounded-xl border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-3">Select Case</h2>
            <div className="flex items-center gap-4">
              <select
                value={selectedCaseId || ''}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#8dff2d] focus:border-transparent min-w-[300px]"
              >
                <option value="">Select a case...</option>
                {allCases.map((caseItem) => (
                  <option key={caseItem.id} value={caseItem.id}>
                    {caseItem.injury_name} - {caseItem.status}
                  </option>
                ))}
              </select>
              {selectedCaseId && (
                <div className="text-sm text-gray-400">
                  Case ID: {selectedCaseId}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#8dff2d] focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#8dff2d] focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="pdf">PDF</option>
            <option value="image">Images</option>
            <option value="spreadsheet">Spreadsheets</option>
          </select>
          <label className="px-6 py-3 bg-[#8dff2d] text-black rounded-lg hover:bg-[#7be525] transition-colors flex items-center gap-2 cursor-pointer font-semibold">
            <UploadIcon className="h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Upload Document'}
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
          </label>
        </div>

        {/* Document Generation Section */}
        {selectedCaseId && (
          <div className="mb-8 p-6 bg-gradient-to-r from-[#8dff2d]/10 to-[#7be525]/10 border border-[#8dff2d]/20 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <PlusIcon className="h-5 w-5 text-[#8dff2d]" />
              Generate Case Documents
            </h2>
            <p className="text-gray-300 mb-6">
              Generate professional documents for your case using the information you've provided.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={() => handleGenerateDocument('claim_packet')}
                disabled={isGenerating}
                className="px-6 py-3 bg-[#8dff2d] text-black rounded-lg hover:bg-[#7be525] transition-colors flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FileTextIcon className="h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Download Claim Packet'}
              </motion.button>
              <motion.button
                onClick={() => handleGenerateDocument('demand_letter')}
                disabled={isGenerating}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MailIcon className="h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Download Demand Letter'}
              </motion.button>
            </div>
          </div>
        )}

        {/* Case Documents Section */}
        {selectedCaseId && caseDocuments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Generated Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {caseDocuments.map((doc, index) => (
                <motion.div
                  key={doc.document_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-900 rounded-xl p-4 border border-gray-700 hover:border-[#8dff2d]/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {doc.document_type === 'claim_packet' ? (
                      <FileTextIcon className="h-5 w-5 text-[#8dff2d]" />
                    ) : (
                      <MailIcon className="h-5 w-5 text-blue-400" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">
                        {doc.document_name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {doc.document_type.replace('_', ' ').toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{new Date(doc.generated_date).toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={() => handleGenerateDocument(doc.document_type as 'claim_packet' | 'demand_letter')}
                    className="w-full px-3 py-2 text-sm bg-[#8dff2d] text-black rounded-lg hover:bg-[#7be525] transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <DownloadIcon className="h-4 w-4" />
                    Download
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Documents Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8dff2d] mx-auto mb-4"></div>
              <p className="text-gray-300">Loading documents...</p>
            </div>
          </div>
        ) : allCases.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FileTextIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Cases Found</h3>
              <p className="text-gray-400 mb-6">
                Complete the chatbot questionnaire to create a case and generate documents.
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-[#8dff2d] text-black rounded-lg hover:bg-[#7be525] transition-colors font-semibold"
              >
                Start New Case
              </button>
            </div>
          </div>
        ) : !selectedCaseId ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FileTextIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Select a Case</h3>
              <p className="text-gray-400 mb-6">
                Please select a case from the dropdown above to view and generate documents.
              </p>
            </div>
          </div>
        ) : filteredDocuments.length === 0 && caseDocuments.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FileTextIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Documents Yet</h3>
              <p className="text-gray-400 mb-6">
                Generate your claim packet and demand letter using the buttons above.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getFileIcon(doc.type)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate group-hover:text-[#8dff2d] transition-colors">
                        {doc.name}
                      </h3>
                      <p className="text-sm text-gray-400">{doc.size}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{doc.uploaded_at}</span>
                </div>

                {doc.ai_analysis && (
                  <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-600">
                    <h4 className="text-sm font-medium text-white mb-2">AI Analysis</h4>
                    <div className="space-y-1 text-xs text-gray-300">
                      {doc.ai_analysis.total_medical_costs && (
                        <p>Medical Costs: ${doc.ai_analysis.total_medical_costs.toLocaleString()}</p>
                      )}
                      {doc.ai_analysis.injury_details && (
                        <p>Injuries: {doc.ai_analysis.injury_details.join(', ')}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button className="flex-1 px-3 py-2 text-sm bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 border border-gray-600">
                    <EyeIcon className="h-4 w-4" />
                    View
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 border border-gray-600">
                    <DownloadIcon className="h-4 w-4" />
                    Download
                  </button>
                  <button className="px-3 py-2 text-sm bg-red-600 text-red-100 rounded-lg hover:bg-red-700 transition-colors">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredDocuments.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <FileIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No documents found</h3>
            <p className="text-gray-400 mb-6">Upload your first document to get started</p>
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-[#8dff2d] text-black rounded-lg hover:bg-[#7be525] transition-colors cursor-pointer font-semibold">
              <UploadIcon className="h-4 w-4" />
              Upload Document
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardDocuments;