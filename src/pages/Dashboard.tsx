import React from 'react'
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
} from 'lucide-react'
const Dashboard = () => {
  // Sample data for documents
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
  ]
  // Sample data for presentations
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
  ]
  
  // Tasks data
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
  ]
  // Calculate completion percentage
  const completedTasks = tasks.filter((task) => task.completed).length
  const completionPercentage = (completedTasks / tasks.length) * 100
  return (
    <div className="min-h-screen bg-[#111111]">
      <div className="flex">
        
        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-400">Welcome back, Danielle M.</p>
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
            {/* Membership Info */}
            <div className="mb-8 bg-[#191919] rounded-xl p-6 border border-[#333333]">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                    <UserIcon className="h-5 w-5 text-[#8dff2d]" />
                    Membership Information
                  </h2>
                  <div className="bg-[#151515] rounded-lg p-6 border border-[#333333]">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-sm text-gray-400">Member</div>
                        <div className="font-medium text-xl">Danielle M.</div>
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
                        <span className="text-xl font-semibold">42 days</span>
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
            {/* Main Dashboard Sections */}
            <div className="">
              {/* Left Column - Documents */}
              <div className="lg:col-span-2 space-y-6">
                {/* Documents Section */}
                <div className="bg-[#191919] rounded-xl p-6 border border-[#333333]">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <FileTextIcon className="h-5 w-5 text-[#8dff2d]" />
                      Documents
                    </h2>
                    <button className="text-sm text-[#8dff2d] flex items-center gap-1">
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
                          <tr key={doc.id} className="text-sm">
                            <td className="py-3 pr-2">
                              <div className="flex items-center gap-2">
                                <FileTextIcon className="h-4 w-4 text-[#8dff2d]" />
                                <span>{doc.name}</span>
                              </div>
                            </td>
                            <td className="py-3 pr-2">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${doc.status === 'Generated' ? 'bg-[#1a3a40] text-[#8dff2d]' : 'bg-[#2a2a2a] text-gray-400'}`}
                              >
                                {doc.status === 'Generated' ? (
                                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                                ) : (
                                  <ClockIcon className="h-3 w-3 mr-1" />
                                )}
                                {doc.status}
                              </span>
                            </td>
                            <td className="py-3 pr-2 text-gray-400">
                              {doc.date}
                            </td>
                            <td className="py-3">
                              <button
                                className={`text-xs px-3 py-1 rounded-lg ${doc.status === 'Generated' ? 'bg-[#252525] text-white hover:bg-[#333333]' : 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed'}`}
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
                    <button className="text-sm text-[#8dff2d]">
                      View all 15 documents
                    </button>
                  </div>
                </div>
                {/* PowerPoint Section */}
                <div className="bg-[#191919] rounded-xl p-6 border border-[#333333]">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <FileTextIcon className="h-5 w-5 text-[#8dff2d]" />
                      Presentations
                    </h2>
                    <button className="text-sm text-[#8dff2d] flex items-center gap-1">
                      <UploadIcon className="h-4 w-4" />
                      Upload New
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {presentations.map((presentation) => (
                      <div
                        key={presentation.id}
                        className="flex items-center p-4 bg-[#151515] rounded-lg border border-[#333333] hover:border-[#8dff2d] transition-colors"
                      >
                        <div className="w-10 h-10 rounded bg-[#252525] flex items-center justify-center mr-3">
                          <FileTextIcon className="h-5 w-5 text-[#8dff2d]" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">
                            {presentation.name}.pptx
                          </div>
                          <div className="text-xs text-gray-400">
                            {presentation.size} • Added {presentation.date}
                          </div>
                        </div>
                        <button className="ml-2 p-2 rounded-full hover:bg-[#252525]">
                          <DownloadIcon className="h-4 w-4 text-[#8dff2d]" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 border border-dashed border-[#333333] rounded-lg p-6 text-center">
                    <UploadIcon className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 mb-2">
                      Drag and drop files here or
                    </p>
                    <button className="px-4 py-2 bg-[#252525] text-[#8dff2d] rounded-lg hover:bg-[#333333] transition-colors">
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
  )
}
// DownloadIcon component
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
  )
}
// CheckIcon component
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
  )
}
export default Dashboard
