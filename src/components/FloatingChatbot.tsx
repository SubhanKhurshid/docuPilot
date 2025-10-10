import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircleIcon, XIcon, SendIcon, SparklesIcon, CheckIcon } from 'lucide-react';
import { apiClient } from '../lib/api';
import { useUser } from '@clerk/clerk-react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  buttons?: ButtonOption[];
  showInput?: boolean;
  showDatePicker?: boolean;
  showForm?: boolean;
  showDownload?: boolean;
}

interface ButtonOption {
  label: string;
  value: string;
  icon?: string;
}

interface ChatBotState {
  step: number;
  collectedInfo: {
    claimType: string;
    location: string;
    accidentDate: string;
    name: string;
    email: string;
    phone: string;
  };
  completed: boolean;
  subscriptionRequired: boolean;
}

const FloatingChatbot: React.FC = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [botState, setBotState] = useState<ChatBotState>({
    step: 0,
    collectedInfo: {
      claimType: '',
      location: '',
      accidentDate: '',
      name: '',
      email: '',
      phone: ''
    },
    completed: false,
    subscriptionRequired: false
  });
  const [conversationMessages, setConversationMessages] = useState<Array<{user_message: string, ai_response?: string, timestamp: string}>>([]);
  const [currentAIResponse, setCurrentAIResponse] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const popUpTimer = useRef<NodeJS.Timeout | null>(null);

  // Auto-popup after 5-8 seconds of page activity
  useEffect(() => {
    const startPopUpTimer = () => {
      if (popUpTimer.current) clearTimeout(popUpTimer.current);
      
      // Random delay between 5-8 seconds
      const delay = Math.random() * 3000 + 5000; // 5000-8000ms
      
      popUpTimer.current = setTimeout(() => {
        if (!isOpen && !showPopUp) {
          setShowPopUp(true);
        }
      }, delay);
    };

    // Start timer on page load
    startPopUpTimer();

    // Reset timer on user activity
    const handleUserActivity = () => {
      if (!isOpen && !showPopUp) {
        startPopUpTimer();
      }
    };

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    return () => {
      if (popUpTimer.current) clearTimeout(popUpTimer.current);
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [isOpen, showPopUp]);

  // Exit intent detection
  useEffect(() => {
    const handleExitIntent = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isOpen && !showPopUp) {
        setShowPopUp(true);
      }
    };

    document.addEventListener('mouseleave', handleExitIntent);
    return () => document.removeEventListener('mouseleave', handleExitIntent);
  }, [isOpen, showPopUp]);


  const handleAddBotMessage = (text: string, buttons?: ButtonOption[], options?: {
    showInput?: boolean;
    showDatePicker?: boolean;
    showForm?: boolean;
    showDownload?: boolean;
  }) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text,
        isUser: false,
        buttons,
        ...options
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleAddUserMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      isUser: true
    }]);
  };

  const handleButtonClick = async (value: string, label: string) => {
    handleAddUserMessage(label);
    
    // Create a new message pair with current AI response and user response
    setConversationMessages(prev => [...prev, {
      user_message: label,
      ai_response: currentAIResponse,
      timestamp: new Date().toISOString()
    }]);
    
    setIsTyping(true);
    
    try {
      if (value === "subscribe") {
        // Handle subscription
        setIsTyping(false);
        window.location.href = '/pricing';
        return;
      } else if (value === "dashboard") {
        // Handle dashboard navigation
        setIsTyping(false);
        window.location.href = '/dashboard';
        return;
      }
      
      // For all other cases, send the message to the backend
      const response = await apiClient.homePageChat({
        message: label,
        clerk_user_id: user?.id || '',
        context: { 
          step: botState.step, 
          collected_info: botState.collectedInfo,
          conversation_messages: conversationMessages
        }
      });
      
      // Update bot state with response
      setBotState(prev => ({
        ...prev,
        step: response.next_step || prev.step + 1,
        collectedInfo: response.collected_info || prev.collectedInfo,
        completed: response.completed || false,
        subscriptionRequired: response.subscription_required || false
      }));
      
      setIsTyping(false);
      
      // Handle AI response based on whether it's the final subscription prompt
      if (response.subscription_required) {
        // For subscription prompt, add AI response to the last user message
        setConversationMessages(prev => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              ai_response: response.response
            };
          }
          return updated;
        });
      } else {
        // For regular responses, store for next user message
        setCurrentAIResponse(response.response);
      }
      
      // Add bot response with buttons and special options
      if (response.subscription_required) {
        handleAddBotMessage(
          response.response,
          [
            { label: "Subscribe Now", value: "subscribe" },
            { label: "View Pricing", value: "subscribe" }
          ]
        );
      } else if (response.buttons) {
        handleAddBotMessage(
          response.response,
          response.buttons
        );
      } else if (response.show_date_picker) {
        handleAddBotMessage(
          response.response,
          [],
          { showDatePicker: true }
        );
      } else if (response.show_input) {
        handleAddBotMessage(
          response.response,
          [],
          { showInput: true }
        );
      } else {
        handleAddBotMessage(response.response);
      }
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsTyping(false);
      handleAddBotMessage("I'm sorry, I encountered an error. Please try again.");
    }
  };



  const handleSendMessage = async (e: React.FormEvent, directMessage?: string) => {
    e.preventDefault();
    
    const userInput = directMessage || inputValue;
    if (!userInput.trim()) return;

    if (!directMessage) {
      handleAddUserMessage(userInput);
      
      // Create a new message pair with current AI response and user response
      setConversationMessages(prev => [...prev, {
        user_message: userInput,
        ai_response: currentAIResponse,
        timestamp: new Date().toISOString()
      }]);
      
      setInputValue('');
    }
    setIsTyping(true);

    try {
      // Send message to AI for contextual response
      const response = await apiClient.homePageChat({
        message: userInput,
        clerk_user_id: user?.id || '',
        context: { 
          step: botState.step,
          collected_info: botState.collectedInfo,
          conversation_messages: conversationMessages
        }
      });

      // Update bot state with response
      setBotState(prev => ({
        ...prev,
        step: response.next_step || prev.step + 1,
        collectedInfo: response.collected_info || prev.collectedInfo,
        completed: response.completed || false,
        subscriptionRequired: response.subscription_required || false
      }));

      setIsTyping(false);

      // Handle AI response based on whether it's the final subscription prompt
      if (response.subscription_required) {
        // For subscription prompt, add AI response to the last user message
        setConversationMessages(prev => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              ai_response: response.response
            };
          }
          return updated;
        });
      } else {
        // For regular responses, store for next user message
        setCurrentAIResponse(response.response);
      }

      // Add bot response with buttons and special options
      if (response.subscription_required) {
        handleAddBotMessage(
          response.response,
          [
            { label: "Subscribe Now", value: "subscribe" },
            { label: "View Pricing", value: "subscribe" }
          ]
        );
      } else if (response.buttons) {
        handleAddBotMessage(
          response.response,
          response.buttons
        );
      } else if (response.show_date_picker) {
        handleAddBotMessage(
          response.response,
          [],
          { showDatePicker: true }
        );
      } else if (response.show_input) {
        handleAddBotMessage(
          response.response,
          [],
          { showInput: true }
        );
      } else {
        handleAddBotMessage(response.response);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsTyping(false);
      handleAddBotMessage("I'm sorry, I encountered an error. Please try again.");
    }
  };


  const openChat = () => {
    setIsOpen(true);
    setShowPopUp(false);
    
    // Initialize chat if not already done and no messages exist
    if (!hasInitialized.current && messages.length === 0) {
      hasInitialized.current = true;
      
      // Get AI-generated initial greeting
      const getInitialGreeting = async () => {
        try {
          const response = await apiClient.homePageChat({
            message: "INIT",
            clerk_user_id: user?.id || '',
            context: { step: 0, collected_info: botState.collectedInfo, conversation_messages: conversationMessages }
          });
          
          // Update bot state
          setBotState(prev => ({
            ...prev,
            step: response.next_step || 1
          }));
          
          // Store initial greeting as current AI response to be paired with first user response
          const initialGreeting = response.response || "Hi there! I'm DocuPilot AI, your personal injury claims assistant. What kind of injury did you occur?";
          setCurrentAIResponse(initialGreeting);
          
          handleAddBotMessage(
            initialGreeting,
            response.buttons
          );
        } catch (error) {
          console.error('Error getting initial greeting:', error);
          // Fallback to default greeting
          const fallbackGreeting = "Hi there! I'm DocuPilot AI, your personal injury claims assistant. What kind of injury did you occur?";
          const fallbackButtons = [
            { label: "🚗 Car Accident", value: "car_accident" },
            { label: "🏢 Slip & Fall", value: "slip_fall" },
            { label: "🏭 Workplace Incident", value: "workplace_incident" },
            { label: "🏥 Medical Malpractice", value: "medical_malpractice" },
            { label: "💡 Other", value: "other" }
          ];
          
          // Store fallback greeting as current AI response to be paired with first user response
          setCurrentAIResponse(fallbackGreeting);
          
          handleAddBotMessage(
            fallbackGreeting,
            fallbackButtons
          );
        }
      };

      setTimeout(() => {
        getInitialGreeting();
      }, 500);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Pop-up Message */}
      <AnimatePresence>
        {showPopUp && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 z-50 max-w-sm"
          >
            <div className="bg-[#0a0a0a]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#333333]/50 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8dff2d] to-[#7be525] flex items-center justify-center flex-shrink-0">
                  <SparklesIcon className="h-5 w-5 text-black" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white text-sm mb-1">Need help filing your claim?</h4>
                  <p className="text-gray-300 text-xs mb-3">I'm your friendly AI claims assistant. I'll guide you step by step—no attorney needed!</p>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={openChat}
                      className="px-3 py-1.5 bg-[#8dff2d] text-black rounded-full text-xs font-medium hover:bg-[#7be525] transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start Now
                    </motion.button>
                    <motion.button
                      onClick={() => setShowPopUp(false)}
                      className="px-3 py-1.5 bg-[#333333] text-gray-300 rounded-full text-xs font-medium hover:bg-[#444444] transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Maybe Later
                    </motion.button>
                  </div>
                </div>
                <motion.button
                  onClick={() => setShowPopUp(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XIcon className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <motion.button
        onClick={openChat}
        data-chat-trigger
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-[#8dff2d] to-[#7be525] rounded-full shadow-2xl hover:shadow-[#8dff2d]/30 transition-all duration-300 flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={showPopUp ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <MessageCircleIcon className="h-6 w-6 text-black group-hover:scale-110 transition-transform" />
        {!isOpen && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <span className="text-xs text-white font-bold">!</span>
          </motion.div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-[#0a0a0a]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#333333]/50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#333333]/50 flex items-center justify-between bg-[#0a0a0a]/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8dff2d] to-[#7be525] flex items-center justify-center">
                  <SparklesIcon className="h-4 w-4 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">DocuPilot AI</h3>
                  <p className="text-xs text-gray-400">Friendly Claims Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={closeChat}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XIcon className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            {/* Simple Progress Indicator */}
            {botState.step > 0 && botState.step <= 6 && (
              <div className="p-3 border-b border-[#333333]/50 bg-[#0a0a0a]/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-medium">
                    Step {botState.step} of 6
                  </span>
                  <span className="text-xs text-[#8dff2d] font-semibold">
                    {Math.round((botState.step / 6) * 100)}% Complete
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#222222] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#8dff2d] to-[#7be525]"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(botState.step / 6) * 100}%` 
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="h-[400px] overflow-y-auto p-4 flex flex-col gap-3 bg-gradient-to-b from-[#0a0a0a]/50 to-[#111111]/50">
              <AnimatePresence>
                {messages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] ${message.isUser ? '' : 'space-y-2'}`}>
                      <div className={`p-3 rounded-2xl ${
                        message.isUser 
                          ? 'bg-[#8dff2d] text-black rounded-br-none' 
                          : 'bg-[#252525] text-white rounded-bl-none'
                      }`}>
                        <p className="whitespace-pre-line text-sm leading-relaxed">{message.text}</p>
                      </div>

                      {/* Buttons */}
                      {message.buttons && message.buttons.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {message.buttons.map((button, idx) => (
                            <motion.button
                              key={idx}
                            onClick={() => handleButtonClick(button.value, button.label)}
                              className="px-3 py-1.5 bg-[#8dff2d] text-black rounded-full hover:bg-[#7be525] transition-colors font-medium text-xs shadow-lg"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {button.label}
                            </motion.button>
                          ))}
                        </div>
                      )}

                      {/* Date Picker */}
                      {message.showDatePicker && (
                        <div>
                          <input
                            type="date"
                            onChange={(e) => {
                              const date = e.target.value;
                              if (date) {
                                handleAddUserMessage(`Accident date: ${date}`);
                                // Send the date to backend
                                handleSendMessage({ preventDefault: () => {} } as React.FormEvent, date);
                              }
                            }}
                            className="w-full px-3 py-2 bg-[#222222]/80 border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8dff2d] text-white text-sm"
                          />
                        </div>
                      )}

                      {/* Custom Input Field */}
                      {message.showInput && (
                        <div>
                          <input
                            type="text"
                            placeholder="Enter your response..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const value = (e.target as HTMLInputElement).value;
                                if (value.trim()) {
                                  handleAddUserMessage(value);
                                  handleSendMessage({ preventDefault: () => {} } as React.FormEvent, value);
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }
                            }}
                            className="w-full px-3 py-2 bg-[#222222]/80 border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8dff2d] text-white placeholder-gray-400 text-sm"
                          />
                        </div>
                      )}

                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  className="flex items-center gap-2 text-gray-400 ml-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex gap-1">
                    <motion.span
                      className="w-1.5 h-1.5 bg-[#8dff2d] rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.span
                      className="w-1.5 h-1.5 bg-[#8dff2d] rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.span
                      className="w-1.5 h-1.5 bg-[#8dff2d] rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                  <span className="text-xs font-medium">DocuPilot is analyzing...</span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-[#333333]/50 bg-[#0a0a0a]/80">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder="Ask about your injury claim..."
                  className="flex-1 bg-[#222222]/80 border border-[#333333] rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8dff2d] focus:border-transparent text-white placeholder-gray-400 font-medium text-sm"
                />
                <motion.button
                  type="submit"
                  className="p-2 rounded-full bg-[#8dff2d] text-black hover:bg-[#7be525] transition-colors shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SendIcon className="h-4 w-4" />
                </motion.button>
              </div>
            </form>

            {/* Trust Signals */}
            <div className="p-3 border-t border-[#333333]/50 bg-[#0a0a0a]/80">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <div className="flex items-center gap-1 px-2 py-1 bg-[#8dff2d]/10 rounded-full border border-[#8dff2d]/20">
                  <CheckIcon className="h-3 w-3 text-[#8dff2d]" />
                  <span className="font-medium text-[#8dff2d]">No attorney needed</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-[#8dff2d]/10 rounded-full border border-[#8dff2d]/20">
                  <CheckIcon className="h-3 w-3 text-[#8dff2d]" />
                  <span className="font-medium text-[#8dff2d]">100% free</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-[#8dff2d]/10 rounded-full border border-[#8dff2d]/20">
                  <CheckIcon className="h-3 w-3 text-[#8dff2d]" />
                  <span className="font-medium text-[#8dff2d]">Takes 5 minutes</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatbot;
