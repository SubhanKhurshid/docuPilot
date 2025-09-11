import {
  AlertCircleIcon,
  BarChartIcon,
  BellIcon,
  CalendarIcon,
  CheckCircleIcon,
  CheckSquareIcon,
  ClockIcon,
  FileTextIcon,
  HistoryIcon,
  PlusIcon,
  RefreshCwIcon,
  SettingsIcon,
  TrendingUpIcon,
  UploadIcon,
  UserIcon,
  WalletIcon,
} from 'lucide-react';

const Dashboard = () => {
  // Sample data for documents - keeping original data
  const documents = [
    {
      id: 1,
      name: 'Tax Declaration Form',
      status: 'Generated',
      date: 'Oct 12, 2023',
    },
    {
      id: 2,
      name: 'Employee Contract',
      status: 'Generated',
      date: 'Oct 10, 2023',
    },
    {
      id: 3,
      name: 'Non-Disclosure Agreement',
      status: 'Generated',
      date: 'Oct 8, 2023',
    },
    {
      id: 4,
      name: 'Investment Disclosure',
      status: 'Generated',
      date: 'Oct 5, 2023',
    },
    {
      id: 5,
      name: 'Financial Statement',
      status: 'Generated',
      date: 'Oct 3, 2023',
    },
    {
      id: 6,
      name: 'Compliance Certificate',
      status: 'Pending',
      date: 'Awaiting data',
    },
    {
      id: 7,
      name: 'Annual Report Template',
      status: 'Pending',
      date: 'Awaiting data',
    },
    {
      id: 8,
      name: 'Vendor Agreement',
      status: 'Generated',
      date: 'Sep 28, 2023',
    },
    {
      id: 9,
      name: 'Client Onboarding Form',
      status: 'Generated',
      date: 'Sep 25, 2023',
    },
    {
      id: 10,
      name: 'Data Processing Agreement',
      status: 'Generated',
      date: 'Sep 22, 2023',
    },
    {
      id: 11,
      name: 'Security Assessment',
      status: 'Pending',
      date: 'Awaiting data',
    },
    {
      id: 12,
      name: 'Expense Report Template',
      status: 'Generated',
      date: 'Sep 18, 2023',
    },
    {
      id: 13,
      name: 'Privacy Policy Template',
      status: 'Generated',
      date: 'Sep 15, 2023',
    },
    {
      id: 14,
      name: 'Terms of Service Template',
      status: 'Generated',
      date: 'Sep 12, 2023',
    },
    {
      id: 15,
      name: 'Intellectual Property Form',
      status: 'Pending',
      date: 'Awaiting data',
    },
  ];

  // Sample data for presentations - keeping original data
  const presentations = [
    {
      id: 1,
      name: 'Q3 Financial Review',
      size: '4.2 MB',
      date: 'Oct 5, 2023',
    },
    {
      id: 2,
      name: 'Investment Opportunities',
      size: '3.7 MB',
      date: 'Oct 1, 2023',
    },
    {
      id: 3,
      name: 'Market Analysis Report',
      size: '5.1 MB',
      date: 'Sep 28, 2023',
    },
    {
      id: 4,
      name: 'Strategic Planning',
      size: '2.8 MB',
      date: 'Sep 22, 2023',
    },
  ];
  
  // Tasks data - keeping original data
  const tasks = [
    {
      id: 1,
      name: 'Complete account setup',
      completed: true,
    },
    {
      id: 2,
      name: 'Set up payment methods',
      completed: true,
    },
    {
      id: 3,
      name: 'Create first savings goal',
      completed: false,
    },
    {
      id: 4,
      name: 'Connect external accounts',
      completed: false,
    },
    {
      id: 5,
      name: 'Review security settings',
      completed: false,
    },
    {
      id: 6,
      name: 'Schedule quarterly review',
      completed: false,
    },
  ];

  // Calculate completion percentage - keeping original logic
  const completedTasks = tasks.filter((task) => task.completed).length;
  const completionPercentage = (completedTasks / tasks.length) * 100;

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Background elements - subtle, no animation - positioned only within main content area */}
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
        {/* Static floating elements */}
        <div className="absolute top-32 left-20 w-1 h-1 bg-[#8dff2d] rounded-full opacity-20" />
        <div className="absolute top-64 right-32 w-1 h-1 bg-[#8dff2d] rounded-full opacity-15" />
        <div className="absolute bottom-64 left-40 w-1 h-1 bg-[#8dff2d] rounded-full opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-transparent to-[#111111]" />
      </div>

      <div className="flex">
        {/* Main content */}
        <main className="flex-1 p-6 relative">
          <div className="max-w-6xl mx-auto">
            {/* Header - keeping original structure */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
                <p className="text-gray-300 font-normal">Welcome back, Danielle M.</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Membership Info - keeping original structure but updated styling */}
            <div className="mb-8 bg-[#0a0a0a]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#333333]/50">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-white">
                    <UserIcon className="h-5 w-5 text-[#8dff2d]" />
                    Membership Information
                  </h2>
                  <div className="bg-[#111111]/50 rounded-lg p-6 border border-[#333333]">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-sm text-gray-400">Member</div>
                        <div className="font-medium text-xl text-white">Danielle M.</div>
                      </div>
                      <div className="bg-[#8dff2d] text-black px-3 py-1 rounded-full text-sm font-medium">
                        Premium
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm text-gray-400 mb-1">
                        Membership expires in
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4 text-[#8dff2d]" />
                        <span className="text-xl font-semibold text-white">42 days</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      Auto-renewal is{' '}
                      <span className="text-[#8dff2d]">enabled</span>
                    </div>
                  </div>
                </div>
              </div>
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

                {/* PowerPoint Section - keeping original structure but updated styling */}
                <div className="bg-[#0a0a0a]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#333333]/50">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
                      <FileTextIcon className="h-5 w-5 text-[#8dff2d]" />
                      Presentations
                    </h2>
                    <button className="text-sm text-[#8dff2d] flex items-center gap-1 font-medium hover:text-[#7be525] transition-colors">
                      <UploadIcon className="h-4 w-4" />
                      Upload New
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {presentations.map((presentation) => (
                      <div
                        key={presentation.id}
                        className="flex items-center p-4 bg-[#111111]/50 rounded-lg border border-[#333333] hover:border-[#8dff2d] transition-colors"
                      >
                        <div className="w-10 h-10 rounded bg-[#333333] flex items-center justify-center mr-3">
                          <FileTextIcon className="h-5 w-5 text-[#8dff2d]" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white">
                            {presentation.name}.pptx
                          </div>
                          <div className="text-xs text-gray-400">
                            {presentation.size} • Added {presentation.date}
                          </div>
                        </div>
                        <button className="ml-2 p-2 rounded-full hover:bg-[#333333] transition-colors">
                          <DownloadIcon className="h-4 w-4 text-[#8dff2d]" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 border border-dashed border-[#333333] rounded-lg p-6 text-center">
                    <UploadIcon className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 mb-2 font-normal">
                      Drag and drop files here or
                    </p>
                    <button className="px-4 py-2 bg-[#333333] text-[#8dff2d] rounded-lg hover:bg-[#444444] transition-colors font-medium">
                      Browse Files
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// DownloadIcon component - keeping original
const DownloadIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
};

// CheckIcon component - keeping original
const CheckIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
};

export default Dashboard;