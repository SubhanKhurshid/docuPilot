import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightIcon,
  CheckIcon,
  ShieldCheckIcon,
  FileTextIcon,
  BarChart3Icon,
  StarIcon,
  SparklesIcon,
  TrendingUpIcon,
  BotIcon,
  DollarSignIcon,
  SendIcon,
  ChevronDownIcon
} from 'lucide-react';
import { CircularProgress } from '../components/CircularProgress';
import SettlementCalculator from '../components/SettlementCalculator';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useState, useRef, useEffect } from 'react';
import { apiClient } from '../lib/api';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  buttons?: Array<{
    label: string;
    value: string;
  }>;
}

const ChatBubble = ({
  message,
  isUser,
  buttons,
  onButtonClick
}: {
  message: string;
  isUser: boolean;
  buttons?: Array<{ label: string; value: string }>;
  onButtonClick?: (value: string) => void;
}) => {
  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${isUser
            ? 'bg-gradient-to-r from-[#8dff2d] to-[#7be525] text-black font-medium'
            : 'bg-[#222222] text-gray-200 font-normal'
          }`}
      >
        {message}
      </div>
      {buttons && buttons.length > 0 && (
        <div className="flex flex-col gap-2 mt-3 w-full max-w-[80%]">
          {buttons.map((button, index) => (
            <motion.button
              key={index}
              onClick={() => onButtonClick?.(button.value)}
              className="px-4 py-3 rounded-xl border border-[#8dff2d] text-[#8dff2d] font-medium text-sm hover:bg-[#8dff2d] hover:text-black transition-all duration-300 text-left"
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              {button.label}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

const FAQItem = ({
  question,
  onQuestionClick
}: {
  question: string;
  onQuestionClick: (question: string) => void;
}) => {
  return (
    <button
      onClick={() => onQuestionClick(question)}
      className="w-full flex items-center justify-between py-3 px-4 text-left hover:bg-[#222222]/50 transition-all border-b border-[#333333]/50 last:border-b-0"
      aria-label={`Ask: ${question}`}
    >
      <span className="text-sm font-medium text-gray-200">{question}</span>
      <ArrowRightIcon className="h-4 w-4 text-[#8dff2d] flex-shrink-0 ml-2" />
    </button>
  );
};

const FAQSection = ({ onQuestionClick }: { onQuestionClick: (question: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const faqs = [
    "How long does it take to submit a claim?",
    "What documents do I need?",
    "Can I handle this without a lawyer?",
    "Do I need insurance info?",
    "How do I document my injury?"
  ];

  return (
    <div className="border-t border-[#333333]/50 bg-[#0a0a0a]/80">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-[#222222]/30 transition-colors"
        aria-label="Toggle FAQ section"
      >
        <div className="flex items-center gap-2">
          <FileTextIcon className="h-4 w-4 text-[#8dff2d]" />
          <span className="text-sm font-semibold text-white">Common Questions</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="h-5 w-5 text-[#8dff2d]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto">
              {faqs.map((question, index) => (
                <FAQItem
                  key={index}
                  question={question}
                  onQuestionClick={(q) => {
                    setIsExpanded(false);
                    onQuestionClick(q);
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Progress Bar Component
const ProgressBar: React.FC<{ step: number; totalSteps: number }> = ({ step, totalSteps }) => {
  const progress = Math.min((step / totalSteps) * 100, 100);

  return (
    <div className="w-full bg-[#222222]/50 rounded-full h-2 overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-[#8dff2d] to-[#7be525] rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

// Inline Tip Component
const InlineTip: React.FC<{ tip: string; icon: string }> = ({ tip, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2 p-3 bg-[#8dff2d]/10 border border-[#8dff2d]/20 rounded-lg mb-3"
    >
      <span className="text-lg">{icon}</span>
      <p className="text-xs text-gray-300 font-medium leading-relaxed">{tip}</p>
    </motion.div>
  );
};

const HomePage = () => {
  const { hasActiveSubscription } = useSubscription();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [conversationStep, setConversationStep] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [progressInfo, setProgressInfo] = useState<{ current: number; total: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Unified function to send messages to backend
  const sendMessageToBackend = async (message: string) => {
    // Add user message to UI
    const userMessage: Message = {
      id: messages.length + 1,
      text: message,
      isUser: true
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await apiClient.homePageChat({
        message,
        session_id: sessionId || undefined,
        context: {
          step: conversationStep
        }
      });

      // Update session ID if provided
      if (response.session_id && !sessionId) {
        setSessionId(response.session_id);
      }

      // Update conversation step
      if (response.next_step !== undefined) {
        setConversationStep(response.next_step);
      }

      // Update progress info
      if (response.question_index !== undefined && response.total_questions !== undefined) {
        setProgressInfo({
          current: response.question_index,
          total: response.total_questions
        });
      }

      // Check for signup requirement
      if (response.require_signup) {
        setShowSignupPrompt(true);
      }

      // Check for date picker
      if (response.show_date_picker) {
        setShowDatePicker(true);
      } else {
        setShowDatePicker(false);
      }

      setIsTyping(false);

      // Add AI response with buttons if provided
      const aiResponse: Message = {
        id: messages.length + 2,
        text: response.response,
        isUser: false,
        buttons: response.buttons?.map(b => ({ label: b.label, value: b.value }))
      };
      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsTyping(false);

      // Fallback message
      const fallbackResponse: Message = {
        id: messages.length + 2,
        text: "I'm having trouble processing that. Could you try again?",
        isUser: false
      };
      setMessages(prev => [...prev, fallbackResponse]);
    }
  };

  // Initialize chat on component mount
  useEffect(() => {
    const initializeChat = async () => {
      if (isInitialized) return;

      setIsTyping(true);

      try {
        const response = await apiClient.homePageChat({
          message: "init",
          context: {
            step: 0
          }
        });

        // Set session ID
        if (response.session_id) {
          setSessionId(response.session_id);
        }

        // Set initial step
        if (response.next_step !== undefined) {
          setConversationStep(response.next_step);
        }

        // Add initial bot message with buttons
        const initialMessage: Message = {
          id: 1,
          text: response.response,
          isUser: false,
          buttons: response.buttons?.map(b => ({ label: b.label, value: b.value }))
        };
        setMessages([initialMessage]);
        setIsInitialized(true);

      } catch (error) {
        console.error('Error initializing chat:', error);

        // Fallback to default message with buttons if API fails
        const fallbackMessage: Message = {
          id: 1,
          text: "Hi there! I'm ClaimBot. I can help you handle your personal injury claim step-by-step without an attorney. What type of incident are you dealing with?",
          isUser: false,
          buttons: [
            { label: "🚗 Auto Accident", value: "Auto Accident" },
            { label: "🚶 Slip & Fall", value: "Slip & Fall" },
            { label: "💼 Workplace Injury", value: "Workplace Injury" },
            { label: "📋 Other", value: "Other" }
          ]
        };
        setMessages([fallbackMessage]);
        setIsInitialized(true);
      } finally {
        setIsTyping(false);
      }
    };

    initializeChat();
  }, [isInitialized]);

  const handleSkipQuestionnaire = async () => {
    // Don't add user message for skip action, just send to backend
    setIsTyping(true);

    try {
      const response = await apiClient.homePageChat({
        message: "SKIP_QUESTIONS",
        session_id: sessionId || undefined,
        context: {
          step: conversationStep
        }
      });

      // Update session ID if provided
      if (response.session_id && !sessionId) {
        setSessionId(response.session_id);
      }

      // Update conversation step
      if (response.next_step !== undefined) {
        setConversationStep(response.next_step);
      }

      // Check for signup requirement
      if (response.require_signup) {
        setShowSignupPrompt(true);
      }

      setIsTyping(false);

      // Add AI response only (no user message for skip)
      const aiResponse: Message = {
        id: messages.length + 1,
        text: response.response,
        isUser: false,
        buttons: response.buttons?.map(b => ({ label: b.label, value: b.value }))
      };
      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error('Error skipping questionnaire:', error);
      setIsTyping(false);
    }
  };

  const handleButtonClick = async (value: string) => {
    // Remove buttons from the last bot message
    setMessages(prev => prev.map((msg, index) =>
      index === prev.length - 1 ? { ...msg, buttons: undefined } : msg
    ));

    await sendMessageToBackend(value);
  };

  const handleFAQClick = async (question: string) => {
    await sendMessageToBackend(question);
  };

  const handleQuickAction = async (action: string) => {
    await sendMessageToBackend(action);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userInput = inputValue.trim();
    await sendMessageToBackend(userInput);
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#111111] overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          animate={{
            backgroundPosition: ['0px 0px', '100px 100px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundImage: `
              linear-gradient(rgba(141, 255, 45, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(141, 255, 45, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        />

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-20 w-2 h-2 bg-[#8dff2d] rounded-full"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-32 w-1 h-1 bg-[#8dff2d] rounded-full"
          animate={{
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-40 left-40 w-1.5 h-1.5 bg-[#8dff2d] rounded-full"
          animate={{
            opacity: [0.4, 0.9, 0.4],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-transparent to-[#111111]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center py-20">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-7xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left: Text Content */}
                <div className="max-w-2xl">
                  <motion.div
                    className="inline-flex items-center gap-3 px-4 py-2 mb-8 rounded-full border border-[#333333] bg-[#111111]/80 backdrop-blur-sm"
                    variants={itemVariants}
                  >
                    <motion.div
                      className="w-2 h-2 bg-[#8dff2d] rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <span className="text-sm text-gray-300 font-medium">AI-Powered Injury Solutions</span>
                    <SparklesIcon className="h-4 w-4 text-[#8dff2d]" />
                  </motion.div>

                  <motion.h1
                    className="text-5xl md:text-6xl lg:text-7xl font-semibold mb-8 leading-tight tracking-tight"
                    variants={itemVariants}
                  >
                    <span className="text-white">Your case,</span>
                    <br />
                    <span className="text-white">your settlement—</span>
                    <br />
                    <span className="text-[#8dff2d] font-medium">AI powered</span>
                  </motion.h1>

                  <motion.p
                    className="text-xl text-gray-300 mb-12 leading-relaxed font-normal"
                    variants={itemVariants}
                  >
                    Maximize your personal injury settlements with expert AI guidance, customizable documents, and step-by-step instructions.
                    <span className="text-[#8dff2d] font-semibold"> Keep 100% of your settlement.</span>
                  </motion.p>

                  <motion.div
                    className="flex flex-col sm:flex-row gap-4 mb-12"
                    variants={itemVariants}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/signup"
                        className="group inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#8dff2d] text-black font-semibold text-lg hover:bg-[#7be525] transition-all duration-300 shadow-lg hover:shadow-[#8dff2d]/20 w-full sm:w-auto"
                      >
                        {hasActiveSubscription ? "Go to Dashboard" : "Start Free Assessment"}
                        <motion.div
                          className="ml-2"
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRightIcon className="h-5 w-5" />
                        </motion.div>
                      </Link>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="flex flex-wrap items-center gap-6 text-sm text-gray-400"
                    variants={itemVariants}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheckIcon className="h-4 w-4 text-[#8dff2d]" />
                      <span className="font-medium">HIPAA Compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-[#8dff2d]" />
                      <span className="font-medium">No Legal Fees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarIcon className="h-4 w-4 text-[#8dff2d] fill-current" />
                      <span className="font-medium">4.9/5 Rating</span>
                    </div>
                  </motion.div>
                </div>

                {/* Right: Chatbot */}
                <motion.div
                  className="relative"
                  variants={itemVariants}
                  animate={{
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut" as const
                  }}
                >
                  <div className="relative">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8dff2d]/20 to-[#7be525]/20 rounded-3xl blur-xl" />

                    {/* Chatbot Container */}
                    <div className="relative bg-[#0a0a0a]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#333333]/50 overflow-hidden">
                      <div className="p-6 border-b border-[#333333]/50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8dff2d] to-[#7be525] flex items-center justify-center">
                              <SparklesIcon className="h-5 w-5 text-black" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">DocuPilot AI Assistant</h3>
                              <p className="text-xs text-gray-400">Your Personal Injury Expert</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <motion.div
                              className="h-2 w-2 rounded-full bg-[#8dff2d]"
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.7, 1, 0.7]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                            <span className="text-xs text-gray-300 font-medium">Online</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {progressInfo && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400 font-medium">
                                Question {progressInfo.current} of {progressInfo.total}
                              </span>
                              <span className="text-xs text-[#8dff2d] font-semibold">
                                {Math.round((progressInfo.current / progressInfo.total) * 100)}% Complete
                              </span>
                            </div>
                            <ProgressBar step={progressInfo.current} totalSteps={progressInfo.total} />
                          </div>
                        )}
                      </div>

                      <div className="h-80 overflow-y-auto p-6 flex flex-col gap-4 bg-gradient-to-b from-[#0a0a0a]/50 to-[#111111]/50">
                        {messages.map(message => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChatBubble
                              message={message.text}
                              isUser={message.isUser}
                              buttons={message.buttons}
                              onButtonClick={handleButtonClick}
                            />
                          </motion.div>
                        ))}

                        {/* Contextual Tips - Removed, backend handles all logic */}

                        {/* Quick Action Buttons - Removed, backend provides buttons in response */}
                        {!isTyping && false && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-3 justify-center"
                          >
                            <motion.button
                              onClick={() => handleQuickAction("Yes, I had injuries")}
                              className="px-6 py-3 bg-[#8dff2d]/10 hover:bg-[#8dff2d]/20 border border-[#8dff2d]/30 rounded-full text-white font-medium transition-all"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              ✅ Yes, I had injuries
                            </motion.button>
                            <motion.button
                              onClick={() => handleQuickAction("No injuries")}
                              className="px-6 py-3 bg-gray-700/10 hover:bg-gray-700/20 border border-gray-600/30 rounded-full text-white font-medium transition-all"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              ❌ No injuries
                            </motion.button>
                          </motion.div>
                        )}

                        {isTyping && (
                          <motion.div
                            className="flex items-center gap-2 text-gray-400 ml-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <div className="flex gap-1">
                              <motion.span
                                className="w-2 h-2 bg-gray-400 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                              />
                              <motion.span
                                className="w-2 h-2 bg-gray-400 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                              />
                              <motion.span
                                className="w-2 h-2 bg-gray-400 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                              />
                            </div>
                            <span className="text-sm font-medium">DocuPilot is analyzing...</span>
                          </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* FAQ Section */}
                      <FAQSection onQuestionClick={handleFAQClick} />

                      {/* Skip Questions Button - Show when in questionnaire mode */}
                      {progressInfo && !showSignupPrompt && (
                        <div className="p-4 border-t border-[#333333]/50 bg-[#0a0a0a]/80 flex justify-center">
                          <motion.button
                            onClick={handleSkipQuestionnaire}
                            className="px-4 py-2 text-sm text-gray-300 hover:text-[#8dff2d] transition-colors font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Skip Questions & Get Claim Packet
                          </motion.button>
                        </div>
                      )}

                      {/* Sign-up Prompt - Show when claim packet is ready */}
                      {showSignupPrompt ? (
                        <div className="p-6 border-t border-[#333333]/50 bg-gradient-to-r from-[#8dff2d]/10 to-[#7be525]/10">
                          <div className="text-center">
                            <h4 className="text-lg font-semibold text-white mb-2">Your Claim Packet is Ready! 🎉</h4>
                            <p className="text-sm text-gray-300 mb-4">Create your account to access and download your complete claim package</p>
                            <Link to="/signup">
                              <motion.button
                                className="w-full px-6 py-3 rounded-full bg-[#8dff2d] text-black font-semibold hover:bg-[#7be525] transition-colors shadow-lg"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                Create Account
                              </motion.button>
                            </Link>

                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleSendMessage} className="p-6 border-t border-[#333333]/50 bg-[#0a0a0a]/80">
                          <div className="flex gap-3">
                            {/* Show date picker when backend requests it */}
                            {showDatePicker ? (
                              <input
                                type="date"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                                className="flex-1 bg-[#222222]/80 border border-[#333333] rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8dff2d] focus:border-transparent text-white placeholder-gray-400 font-medium"
                                aria-label="Select accident date"
                              />
                            ) : (
                              <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask about your injury claim..."
                                className="flex-1 bg-[#222222]/80 border border-[#333333] rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8dff2d] focus:border-transparent text-white placeholder-gray-400 font-medium"
                                aria-label="Chat input"
                              />
                            )}
                            <motion.button
                              type="submit"
                              className="p-3 rounded-full bg-[#8dff2d] text-black hover:bg-[#7be525] transition-colors shadow-lg"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              aria-label="Send message"
                            >
                              <SendIcon className="h-5 w-5" />
                            </motion.button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Circular Progress Section */}
        <section className="py-24 border-t border-[#222222] bg-gradient-to-b from-[#111111] to-[#0a0a0a]">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <CircularProgress />
            </motion.div>
          </div>
        </section>

        {/* Settlement Calculator Section */}
        <SettlementCalculator />

        {/* Value Proposition */}
        <section className="py-24 border-t border-[#222222]">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-white">
                  Why pay <span className="text-red-400">33-40%</span> to lawyers?
                </h2>
                <p className="text-xl text-gray-300 font-normal">Keep your entire settlement with AI-driven guidance</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Traditional Lawyers */}
                <motion.div
                  className="text-center group"
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-red-400/30 bg-red-400/5 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-3xl">⚖️</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-red-400">Traditional Lawyers</h3>
                  <ul className="space-y-3 text-gray-300 font-medium">
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full" />
                      33-40% fees
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full" />
                      Limited control
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full" />
                      Slow processes
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full" />
                      High overhead costs
                    </li>
                  </ul>
                </motion.div>

                {/* VS */}
                <div className="flex items-center justify-center">
                  <motion.div
                    className="text-4xl font-medium text-gray-500"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    vs
                  </motion.div>
                </div>

                {/* DocuPilot */}
                <motion.div
                  className="text-center group"
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-[#8dff2d]/30 bg-[#8dff2d]/10 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-3xl">🤖</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-[#8dff2d]">DocuPilot AI</h3>
                  <ul className="space-y-3 text-gray-200 font-medium">
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-[#8dff2d] rounded-full" />
                      Keep 100% of settlement
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-[#8dff2d] rounded-full" />
                      Full case control
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-[#8dff2d] rounded-full" />
                      Instant AI guidance
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-[#8dff2d] rounded-full" />
                      Transparent pricing
                    </li>
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 border-t border-[#222222]">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-6xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-white">How it works</h2>
                <p className="text-xl text-gray-300 font-normal"> Unlock the full potential of your accident claim - With AI, you'll know exactly how to maximize your settlement faster and smarter than ever before</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  {
                    number: "01",
                    title: "Assessment",
                    description: "AI evaluates your claim value instantly using advanced algorithms",
                    icon: <img src="/output-onlinepngtools.png" alt="Injured person" className="h-10 w-10" />
                  },
                  {
                    number: "02",
                    title: "Strategy",
                    description: "Get personalized approach tailored to your specific case",
                    icon: <BotIcon className="h-10 w-10" />
                  },
                  {
                    number: "03",
                    title: "Documents",
                    description: "Auto-generate professional documents with AI assistance",
                    icon: <FileTextIcon className="h-10 w-10" />
                  },
                  {
                    number: "04",
                    title: "Settlement",
                    description: "Track progress and maximize your final outcome",
                    icon: <DollarSignIcon className="h-10 w-10" />
                  }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    className="group relative"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    {/* Connection Line */}
                    {index < 3 && (
                      <div className="hidden md:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-[#333333] via-[#8dff2d]/20 to-transparent z-0" />
                    )}

                    <div className="text-center relative z-10">
                      <motion.div
                        className="w-20 h-20 mx-auto mb-6 rounded-full border border-[#333333] bg-[#111111]/80 backdrop-blur-sm flex items-center justify-center group-hover:border-[#8dff2d] transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="text-[#8dff2d]">{step.icon}</div>
                      </motion.div>

                      <div className="text-3xl font-medium text-gray-500 mb-2">{step.number}</div>
                      <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
                      <p className="text-gray-300 font-normal leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-24 border-t border-[#222222]">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-5xl mx-auto text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="mb-16">
                <motion.div
                  className="text-6xl font-semibold text-white mb-4"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  $73B
                </motion.div>
                <p className="text-gray-300 font-normal text-lg">Personal injury market cap annually in the US</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {[
                  { value: "39M", label: "Accidents Per Year", icon: <TrendingUpIcon className="h-6 w-6" /> },
                  { value: "$73B", label: "Market Cap Annually", icon: <DollarSignIcon className="h-6 w-6" /> },
                  { value: "$52K", label: "Average Settlement", icon: <BarChart3Icon className="h-6 w-6" /> },
                  { value: "98%", label: "Our Success Rate", icon: <CheckIcon className="h-6 w-6" /> }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="text-[#8dff2d]">{stat.icon}</div>
                      <div className="text-3xl font-semibold text-[#8dff2d]">{stat.value}</div>
                    </div>
                    <p className="text-gray-300 font-normal">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Testimonial */}
              <motion.div
                className="p-8 rounded-3xl border border-[#222222] bg-gradient-to-br from-[#111111]/80 to-[#0a0a0a]/80 backdrop-blur-sm"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <StarIcon className="h-5 w-5 text-[#8dff2d] fill-current" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-lg text-gray-200 mb-8 font-normal italic leading-relaxed">
                  "DocuPilot's AI guidance helped me secure a $62,000 settlement for my workplace injury.
                  I saved over $20,000 in legal fees and had complete control over my case."
                </p>
                <div className="text-gray-300 font-medium">
                  <div className="text-white font-semibold">Jennifer L.</div>
                  <div className="text-sm text-gray-400">Workplace Injury Case</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 border-t border-[#222222]">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-white">
                Ready to maximize your settlement?
              </h2>
              <p className="text-xl text-gray-300 mb-12 font-normal leading-relaxed">
                Join thousands who've successfully handled their claims with AI guidance
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/signup"
                    className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-[#8dff2d] text-black font-semibold text-base sm:text-lg hover:bg-[#7be525] transition-all duration-300 shadow-lg hover:shadow-[#8dff2d]/20 w-full sm:w-auto sm:min-w-[200px] md:min-w-[220px]"
                  >
                    {hasActiveSubscription ? "Go to Dashboard" : "Start Free Trial"}
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRightIcon className="h-5 w-5" />
                    </motion.div>
                  </Link>
                </motion.div>
                {!hasActiveSubscription && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/pricing"
                      className="border-[#8dff2d] inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-[#333333] text-white font-semibold text-base sm:text-lg hover:border-[#8dff2d] hover:bg-[#8dff2d]/5 transition-all duration-300 w-full sm:w-auto sm:min-w-[200px] md:min-w-[220px]"
                    >
                      View Pricing
                    </Link>
                  </motion.div>
                )}
              </div>

              <p className="text-sm text-gray-400 font-normal">
                {hasActiveSubscription
                  ? "You have an active subscription"
                  : "No credit card required • 7-day free trial • Cancel anytime"
                }
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;