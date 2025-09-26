import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BotIcon, ArrowLeftIcon, MessageCircleIcon } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';
import { useChat } from '../contexts/ChatContext';

const Chat: React.FC = () => {
  const { state } = useChat();

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

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-3 py-2 bg-[#333333] text-white rounded-lg hover:bg-[#444444] transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#8dff2d]/10 rounded-lg">
                <BotIcon className="h-6 w-6 text-[#8dff2d]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AI Assistant</h1>
                <p className="text-sm text-gray-400">Personal injury case guidance</p>
              </div>
            </div>
          </div>
          
          {state.currentCaseId && (
            <div className="text-right">
              <div className="text-sm text-gray-400">Current Case</div>
              <div className="text-sm font-mono text-[#8dff2d]">{state.currentCaseId}</div>
            </div>
          )}
        </div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="h-[calc(100vh-200px)]"
        >
          <ChatInterface />
        </motion.div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-[#333333] text-white rounded-lg hover:bg-[#444444] transition-colors text-sm"
          >
            <MessageCircleIcon className="h-4 w-4" />
            View All Cases
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-[#8dff2d] text-black rounded-lg hover:bg-[#7be525] transition-colors text-sm"
          >
            <BotIcon className="h-4 w-4" />
            Start New Conversation
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;