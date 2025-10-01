import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SendIcon,
  BotIcon,
  UserIcon,
  LoaderIcon,
  SparklesIcon,
  MicIcon,
  MicOffIcon,
  PaperclipIcon,
} from 'lucide-react';
import { apiClient, ChatRequest, ChatResponse } from '../lib/api';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  metadata?: {
    case_id?: string;
    case_status?: string;
    required_docs?: string[];
    completed_docs?: string[];
    is_new_case?: boolean;
  };
}

interface DashboardChatProps {
  userId: string;
  onCaseUpdate?: (caseId: string, status: string) => void;
  activeChatId?: string;
  onNewChat?: () => void;
  onChatCreated?: (chatId: string, title: string) => void;
}

const DashboardChat: React.FC<DashboardChatProps> = ({ 
  userId, 
  onCaseUpdate,
  activeChatId,
  onNewChat,
  onChatCreated
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentCaseId, setCurrentCaseId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat messages when activeChatId changes
  useEffect(() => {
    const loadChatMessages = async () => {
      if (activeChatId && activeChatId !== currentChatId) {
        try {
          setIsLoading(true);
          const response = await apiClient.getChatMessages(activeChatId) as { 
            messages: Array<{ id: string; content: string; chat_id: string; timestamp: string }> 
          };
          
          if (response.messages && response.messages.length > 0) {
            const loadedMessages: Message[] = response.messages.map((msg: { 
              id: string; 
              content: string; 
              chat_id: string; 
              timestamp: string;
            }) => ({
              id: msg.id,
              content: msg.content,
              isUser: true,
              timestamp: new Date(msg.timestamp),
            }));
            setMessages(loadedMessages);
            setCurrentChatId(activeChatId);
          }
        } catch (error) {
          console.error('Error loading chat messages:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadChatMessages();
  }, [activeChatId, currentChatId]);


  

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const request: ChatRequest = {
        clerk_user_id: userId,
        question: inputValue,
        history: messages.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content,
        })),
        chat_id: currentChatId || undefined,
      };

      const response: ChatResponse = await apiClient.sendMessage(request);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        isUser: false,
        timestamp: new Date(),
        metadata: {
          case_id: response.case_id,
          case_status: response.case_status,
          required_docs: response.required_docs,
          completed_docs: response.completed_docs,
          is_new_case: response.is_new_case,
        },
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // If this is a new chat, notify parent
      if (!currentChatId && response.chat_id) {
        const chatTitle = inputValue.length > 50 ? inputValue.substring(0, 47) + '...' : inputValue;
        onChatCreated?.(response.chat_id, chatTitle);
      }
      
      setCurrentChatId(response.chat_id);
      
      if (response.case_id) {
        setCurrentCaseId(response.case_id);
        onCaseUpdate?.(response.case_id, response.case_status || 'new');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!currentCaseId) {
      alert('Please start a conversation first to upload documents.');
      return;
    }

    try {
      const content = await file.text();
      await apiClient.uploadDocument({
        case_id: currentCaseId,
        document_name: file.name,
        document_content: content,
        document_type: file.type.includes('image') ? 'image' : 'document',
        document_data: {
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
        },
      });

      const uploadMessage: Message = {
        id: Date.now().toString(),
        content: `Document "${file.name}" uploaded and analyzed successfully!`,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, uploadMessage]);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    }
  };

  const quickStartPrompts = [
    "I was in a car accident and broke my arm",
    "I slipped and fell at work, injuring my back",
    "I was injured in a motorcycle accident",
    "I need help with a medical malpractice case",
    "I was injured in a slip and fall accident"
  ];

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setCurrentCaseId(null);
    onNewChat?.();
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header with New Chat button */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">AI Assistant</h2>
        <button
          onClick={handleNewChat}
          className="px-4 py-2 bg-[#8dff2d] text-black rounded-lg hover:bg-[#7be525] transition-colors font-medium text-sm"
        >
          + New Chat
        </button>
      </div>
     
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#8dff2d] to-[#7be525] flex items-center justify-center"
            >
              <SparklesIcon className="h-10 w-10 text-black" />
            </motion.div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              Welcome to DocuPilot AI
            </h3>
            <p className="text-gray-300 mb-8 max-w-md mx-auto">
              I'm here to help you with your personal injury case. Describe your injury and I'll guide you through the process.
            </p>
            <div className="space-y-3 max-w-lg mx-auto">
              {quickStartPrompts.map((prompt, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setInputValue(prompt)}
                  className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 rounded-lg border border-gray-700 hover:border-[#8dff2d] transition-all duration-300"
                >
                  "{prompt}"
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex gap-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!message.isUser && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8dff2d] to-[#7be525] flex items-center justify-center flex-shrink-0">
                  <BotIcon className="h-6 w-6 text-black" />
                </div>
              )}
              
              <div className={`max-w-2xl ${message.isUser ? 'order-first' : ''}`}>
                <div
                  className={`px-6 py-4 rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-[#8dff2d] to-[#7be525] text-black'
                      : 'bg-gray-800 text-white border border-gray-700'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
                
                {message.metadata && (
                  <div className="mt-3 space-y-2">
                    {message.metadata.is_new_case && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-4 py-3 bg-green-900/50 border border-green-700 rounded-lg"
                      >
                        <p className="text-sm text-green-300 font-medium flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                          New case created
                        </p>
                      </motion.div>
                    )}
                    
                    {/* {message.metadata.required_docs && message.metadata.required_docs.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-4 py-3 bg-blue-900/50 border border-blue-700 rounded-lg"
                      >
                        <p className="text-sm text-blue-300 font-medium mb-2">
                          Required documents:
                        </p>
                        <ul className="text-sm text-blue-200 space-y-1">
                          {message.metadata.required_docs.map((doc, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )} */}
                    
                    {message.metadata.completed_docs && message.metadata.completed_docs.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg"
                      >
                        <p className="text-sm text-gray-300 font-medium mb-2">
                          Completed documents:
                        </p>
                        <ul className="text-sm text-gray-200 space-y-1">
                          {message.metadata.completed_docs.map((doc, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-[#8dff2d] rounded-full"></span>
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>

              {message.isUser && (
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 justify-start"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8dff2d] to-[#7be525] flex items-center justify-center">
              <BotIcon className="h-6 w-6 text-black" />
            </div>
            <div className="bg-gray-800 rounded-2xl px-6 py-4 border border-gray-700">
              <div className="flex items-center gap-3">
                <LoaderIcon className="h-5 w-5 animate-spin text-[#8dff2d]" />
                <span className="text-sm text-gray-300">AI is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-800 bg-gray-900">
        <form onSubmit={handleSendMessage} className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe your injury or ask a question..."
              className="w-full px-6 py-4 pr-20 bg-gray-800 border border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8dff2d] focus:border-transparent text-white placeholder-gray-400"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
              <label
                htmlFor="file-upload"
                className="p-2 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                title="Upload file"
              >
                <PaperclipIcon className="h-5 w-5 text-gray-400" />
              </label>
              <button
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                className={`p-2 rounded-lg transition-colors ${
                  isRecording 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'hover:bg-gray-700 text-gray-400'
                }`}
                title={isRecording ? 'Stop recording' : 'Start recording'}
              >
                {isRecording ? <MicOffIcon className="h-5 w-5" /> : <MicIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-8 py-4 bg-gradient-to-r from-[#8dff2d] to-[#7be525] text-black rounded-2xl hover:from-[#7be525] hover:to-[#6dd11a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg hover:shadow-[#8dff2d]/20"
          >
            <SendIcon className="h-5 w-5" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardChat;