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
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploaded_at: string;
  status: 'analyzed' | 'pending' | 'error';
  ai_analysis?: any;
}

interface DashboardDocumentsProps {
  userId: string;
}

const DashboardDocuments: React.FC<DashboardDocumentsProps> = ({ userId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [userId]);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call when document endpoints are available
      // For now, using mock data but with real structure
      setDocuments([
        {
          id: '1',
          name: 'Medical Records - Dr. Smith.pdf',
          type: 'pdf',
          size: '2.3 MB',
          uploaded_at: '2024-01-15',
          status: 'analyzed',
          ai_analysis: {
            total_medical_costs: 15000,
            injury_details: ['Fractured arm', 'Soft tissue damage'],
          }
        },
        {
          id: '2',
          name: 'X-Ray Results.jpg',
          type: 'image',
          size: '1.8 MB',
          uploaded_at: '2024-01-14',
          status: 'analyzed',
        },
        {
          id: '3',
          name: 'Insurance Claim Form.pdf',
          type: 'pdf',
          size: '856 KB',
          uploaded_at: '2024-01-13',
          status: 'pending',
        },
      ]);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setIsLoading(false);
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

        {/* Documents Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8dff2d] mx-auto mb-4"></div>
              <p className="text-gray-300">Loading documents...</p>
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