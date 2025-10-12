import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircleIcon,
  BarChart3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  BriefcaseIcon,
  FileIcon,
  HistoryIcon,
  BotIcon,
  SparklesIcon,
  CreditCardIcon,
} from 'lucide-react';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  chatHistory: Array<{ id: string; title: string; timestamp: string }>;
  onChatSelect: (chatId: string) => void;
  activeChatId?: string;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  chatHistory,
  onChatSelect,
  activeChatId,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('main');
  const [expandedChats, setExpandedChats] = useState<boolean>(true);

  const mainTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'chat', label: 'AI Assistant', icon: BotIcon },
    { id: 'cases', label: 'My Cases', icon: BriefcaseIcon },
    { id: 'documents', label: 'Documents', icon: FileIcon },
    { id: 'analytics', label: 'Analytics', icon: BarChart3Icon },
    { id: 'subscription', label: 'Subscription', icon: CreditCardIcon },
  ];

  // Removed settings section

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <motion.div
      className={`bg-black border-r border-gray-800 flex flex-col h-screen transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      initial={false}
      animate={{ width: isCollapsed ? 64 : 256 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#8dff2d] flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-black" />
              </div>
              <span className="font-semibold text-white">DocuPilot</span>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-4 w-4 text-gray-300" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4 text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* Main Navigation */}
        <div className="p-2">
          {!isCollapsed && (
            <div className="mb-4">
              <button
                onClick={() => toggleSection('main')}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <span>Main</span>
                <ChevronRightIcon
                  className={`h-4 w-4 transition-transform ${
                    expandedSection === 'main' ? 'rotate-90' : ''
                  }`}
                />
              </button>
            </div>
          )}

          {expandedSection === 'main' && (
            <div className="space-y-1 mb-4">
              {mainTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-[#8dff2d] text-black border border-[#8dff2d]'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span>{tab.label}</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* Chat History Section - Always visible */}
          {!isCollapsed && chatHistory.length > 0 && (
            <div className="mb-4">
              <button
                onClick={() => setExpandedChats(!expandedChats)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <HistoryIcon className="h-4 w-4" />
                  <span>Recent Chats</span>
                </div>
                <ChevronRightIcon
                  className={`h-4 w-4 transition-transform ${
                    expandedChats ? 'rotate-90' : ''
                  }`}
                />
              </button>
            </div>
          )}

          {expandedChats && !isCollapsed && chatHistory.length > 0 && (
            <div className="space-y-1 mb-4 max-h-64 overflow-y-auto">
              {chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onChatSelect(chat.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all text-left ${
                    activeChatId === chat.id
                      ? 'bg-[#8dff2d] text-black border border-[#8dff2d]'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  }`}
                >
                  <MessageCircleIcon className="h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{chat.title}</div>
                    <div className={`text-xs ${activeChatId === chat.id ? 'text-black/70' : 'text-gray-500'}`}>
                      {chat.timestamp}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

        </div>
      </div>

    </motion.div>
  );
};

export default DashboardSidebar;
