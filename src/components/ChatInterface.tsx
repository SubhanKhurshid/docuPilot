import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendIcon, PaperclipIcon, DownloadIcon, FileTextIcon, DollarSignIcon } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import ChatBubble from './ChatBubble';
import { CircularProgress } from './CircularProgress';

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className = '' }) => {
  const { state, sendMessage } = useChat();
  const [inputValue, setInputValue] = useState('');
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isScrolledToBottom) {
      scrollToBottom();
    }
  }, [state.messages, isScrolledToBottom]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || state.isTyping) return;

    const message = inputValue.trim();
    setInputValue('');
    await sendMessage(message);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For now, just send a message about the file
      // In a real implementation, you'd upload the file to the backend
      sendMessage(`I've uploaded a file: ${file.name}`);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    setIsScrolledToBottom(isAtBottom);
  };

  const formatSettlementEstimate = (estimate: any) => {
    if (!estimate) return null;
    return `$${estimate.low_estimate.toLocaleString()} - $${estimate.high_estimate.toLocaleString()}`;
  };

  return (
    <div className={`flex flex-col h-full bg-[#0a0a0a]/90 backdrop-blur-xl rounded-2xl border border-[#333333]/50 ${className}`}>
      {/* Chat Header */}
      <div className="p-4 border-b border-[#333333]/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">DocuPilot AI Assistant</h3>
            <p className="text-sm text-gray-400">
              {state.caseStatus === 'initial' && 'Ready to help with your injury case'}
              {state.caseStatus === 'collecting_documents' && 'Collecting your case documents'}
              {state.caseStatus === 'reviewing' && 'Reviewing your case details'}
              {state.caseStatus === 'generating_demand_letter' && 'Generating demand letter'}
              {state.caseStatus === 'completed' && 'Case processing complete'}
            </p>
          </div>
          {state.injuryType && (
            <div className="text-right">
              <div className="text-sm text-gray-400">Injury Type</div>
              <div className="text-sm font-medium text-[#8dff2d] capitalize">
                {state.injuryType.replace('-', ' ')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onScroll={handleScroll}
      >
        <AnimatePresence>
          {state.messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ChatBubble 
                message={message.text} 
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
              
              {/* Show additional data for AI messages */}
              {!message.isUser && message.settlementEstimate && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 p-3 bg-[#111111]/30 rounded-lg border border-[#333333]/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSignIcon className="h-4 w-4 text-[#8dff2d]" />
                    <span className="text-sm font-medium text-white">Settlement Estimate</span>
                  </div>
                  <div className="text-sm text-[#8dff2d] font-semibold">
                    {formatSettlementEstimate(message.settlementEstimate)}
                  </div>
                  {message.settlementEstimate.factors.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-400 mb-1">Key Factors:</div>
                      <div className="flex flex-wrap gap-1">
                        {message.settlementEstimate.factors.map((factor, i) => (
                          <span key={i} className="text-xs bg-[#333333] text-gray-300 px-2 py-1 rounded">
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {!message.isUser && message.demandLetter && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 p-3 bg-[#111111]/30 rounded-lg border border-[#333333]/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FileTextIcon className="h-4 w-4 text-[#8dff2d]" />
                    <span className="text-sm font-medium text-white">Demand Letter Generated</span>
                  </div>
                  <div className="text-xs text-gray-400 mb-2">
                    Your demand letter has been prepared and is ready to be sent.
                  </div>
                  <button className="text-xs bg-[#8dff2d] text-black px-3 py-1 rounded hover:bg-[#7be525] transition-colors">
                    View Letter
                  </button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {state.isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-gray-400"
          >
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="text-sm font-medium">DocuPilot is analyzing...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-[#333333]/50">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe your injury or ask a question..."
              className="w-full px-4 py-3 bg-[#111111]/50 border border-[#333333] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#8dff2d] focus:ring-1 focus:ring-[#8dff2d] transition-colors"
              disabled={state.isTyping}
            />
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-[#333333] text-gray-400 rounded-xl hover:bg-[#444444] hover:text-white transition-colors"
            disabled={state.isTyping}
          >
            <PaperclipIcon className="h-5 w-5" />
          </button>
          
          <button
            type="submit"
            disabled={!inputValue.trim() || state.isTyping}
            className="p-3 bg-[#8dff2d] text-black rounded-xl hover:bg-[#7be525] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          Press Enter to send • Upload documents to support your case
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
