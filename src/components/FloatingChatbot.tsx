import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendIcon, SparklesIcon, CheckIcon, DownloadIcon, XIcon, MessageCircleIcon } from 'lucide-react';
import { apiClient, LeadCaptureRequest } from '../lib/api';
import { useNavigate } from 'react-router-dom';

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
  claimType: string;
  accidentDate: string;
  hasInjuries: boolean;
  needsMedicalAttention: boolean;
  leadInfo: {
    name: string;
    email: string;
    phone: string;
  };
  questionIndex: number;
  answers: Record<string, string>;
  totalQuestions: number;
  sessionId: string;
}

interface FloatingChatbotProps {
  isVisible: boolean;
  onClose: () => void;
}

const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ isVisible, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [botState, setBotState] = useState<ChatBotState>({
    step: 0,
    claimType: '',
    accidentDate: '',
    hasInjuries: false,
    needsMedicalAttention: false,
    leadInfo: { name: '', email: '', phone: '' },
    questionIndex: 0,
    answers: {},
    totalQuestions: 0,
    sessionId: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isVisible && !hasInitialized.current) {
      hasInitialized.current = true;
      const getInitialGreeting = async () => {
        try {
          const response = await apiClient.homePageChat({
            message: "INIT",
            context: { step: 0 }
          });
          
          handleAddBotMessage(
            response.response || "Hi there! Were you recently injured and want to start a personal injury claim?",
            [
              { label: "Yes ✅", value: "yes" },
              { label: "Not yet ❌", value: "no" }
            ]
          );
        } catch (error) {
          console.error('Error getting initial greeting:', error);
          handleAddBotMessage(
            "Hi there! Were you recently injured and want to start a personal injury claim?",
            [
              { label: "Yes ✅", value: "yes" },
              { label: "Not yet ❌", value: "no" }
            ]
          );
        }
      };

      setTimeout(() => {
        getInitialGreeting();
      }, 500);
    }
  }, [isVisible]);

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
    setIsTyping(true);
    
    try {
      if (botState.step === 0) {
        if (value === "yes") {
          const response = await apiClient.homePageChat({
            message: label,
            context: { step: 0, action: "yes" }
          });
          
          setBotState(prev => ({ ...prev, step: 1 }));
          setIsTyping(false);
          
          handleAddBotMessage(
            response.response || "I can help you with different types of claims. What happened?",
            [
              { label: "Auto Accident 🚗", value: "auto" },
              { label: "Slip & Fall 🏢", value: "slip-fall" },
              { label: "Workplace Injury 🏭", value: "workplace" },
              { label: "Other 💡", value: "other" }
            ]
          );
        } else {
          const response = await apiClient.homePageChat({
            message: label,
            context: { step: 0, action: "no" }
          });
          
          setIsTyping(false);
          handleAddBotMessage(
            response.response || "No problem! Feel free to explore our FAQ and resources. I'm here when you're ready!",
            []
          );
        }
      } else if (botState.step === 1) {
        const response = await apiClient.homePageChat({
          message: label,
          context: { step: 1, claim_type: value }
        });
        
        setBotState(prev => ({ ...prev, claimType: value, step: 2 }));
        setIsTyping(false);
        
        handleAddBotMessage(
          response.response || "Thanks! I'll guide you through what you need. Can you tell me the date of your accident?",
          [],
          { showDatePicker: true }
        );
      } else if (botState.step === 3) {
        const needsAttention = value === "yes";
        const response = await apiClient.homePageChat({
          message: label,
          context: { step: 3, has_injuries: needsAttention, claim_type: botState.claimType }
        });
        
        setBotState(prev => ({ ...prev, needsMedicalAttention: needsAttention, step: 4 }));
        setIsTyping(false);
        
        if (needsAttention) {
          handleAddBotMessage(
            response.response || "I see. Could you briefly describe the injuries and treatment you received?",
            [],
            { showInput: true }
          );
        } else {
          handleStep4Evidence();
        }
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsTyping(false);
      
      if (botState.step === 0 && value === "yes") {
        setBotState(prev => ({ ...prev, step: 1 }));
        handleAddBotMessage(
          "I can help you with different types of claims. What happened?",
          [
            { label: "Auto Accident 🚗", value: "auto" },
            { label: "Slip & Fall 🏢", value: "slip-fall" },
            { label: "Workplace Injury 🏭", value: "workplace" },
            { label: "Other 💡", value: "other" }
          ]
        );
      }
    }
  };

  const handleDateSubmit = async (date: string) => {
    handleAddUserMessage(`Accident date: ${date}`);
    setBotState(prev => ({ ...prev, accidentDate: date, step: 3 }));
    setIsTyping(true);
    
    try {
      const response = await apiClient.homePageChat({
        message: `The accident date was ${date}`,
        context: { step: 2, claim_type: botState.claimType, accident_date: date }
      });
      
      setIsTyping(false);
      handleAddBotMessage(
        response.response || "Great! Were there any injuries requiring medical attention?",
        [
          { label: "Yes ✅", value: "yes" },
          { label: "No ❌", value: "no" }
        ]
      );
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsTyping(false);
      handleAddBotMessage(
        "Great! Were there any injuries requiring medical attention?",
        [
          { label: "Yes ✅", value: "yes" },
          { label: "No ❌", value: "no" }
        ]
      );
    }
  };

  const handleStep4Evidence = async () => {
    setBotState(prev => ({ ...prev, step: 4 }));
    setIsTyping(true);
    
    try {
      const response = await apiClient.homePageChat({
        message: "What documents do I need?",
        context: { 
          step: 4, 
          claim_type: botState.claimType,
          has_injuries: botState.needsMedicalAttention 
        }
      });
      
      setIsTyping(false);
      handleAddBotMessage(
        response.response || `To strengthen your claim, you'll need:

📸 Photos of the accident/injury
📋 Police or incident reports
💊 Medical bills and receipts
👥 Witness information

Don't worry—I'll help you organize this into a document you can submit yourself.`,
        [],
        { showInput: false }
      );
      
      setTimeout(() => {
        handleAddBotMessage(
          "Ready to start your free claim?",
          [
            { label: "Start Your Free Claim", value: "start-claim" }
          ]
        );
      }, 2000);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsTyping(false);
      handleAddBotMessage(
        `To strengthen your claim, you'll need:

📸 Photos of the accident/injury
📋 Police or incident reports
💊 Medical bills and receipts
👥 Witness information

Don't worry—I'll help you organize this into a document you can submit yourself.`,
        [],
        { showInput: false }
      );
      
      setTimeout(() => {
        handleAddBotMessage(
          "Ready to start your free claim?",
          [
            { label: "Start Your Free Claim", value: "start-claim" }
          ]
        );
      }, 2000);
    }
  };

  const handleStartClaim = async () => {
    handleAddUserMessage("Start Your Free Claim");
    setBotState(prev => ({ ...prev, step: 5 }));
    setIsTyping(true);
    
    try {
      const response = await apiClient.homePageChat({
        message: "Start Your Free Claim",
        context: { 
          step: 5,
          claim_type: botState.claimType,
          accident_date: botState.accidentDate,
          has_injuries: botState.needsMedicalAttention
        }
      });
      
      setIsTyping(false);
      handleAddBotMessage(
        response.response || "Before we create your claim documents, I need a few details to save your progress. You'll receive a downloadable claim packet and step-by-step guidance immediately.",
        [],
        { showForm: true }
      );
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsTyping(false);
      handleAddBotMessage(
        "Before we create your claim documents, I need a few details to save your progress. You'll receive a downloadable claim packet and step-by-step guidance immediately.",
        [],
        { showForm: true }
      );
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = botState.leadInfo;
    
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all fields');
      return;
    }

    handleAddUserMessage(`Name: ${formData.name}, Email: ${formData.email}, Phone: ${formData.phone}`);
    
    setIsTyping(true);

    try {
      const leadRequest: LeadCaptureRequest = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        claim_type: botState.claimType,
        accident_date: botState.accidentDate,
        has_injuries: botState.needsMedicalAttention,
        injury_description: botState.needsMedicalAttention ? 'User reported injuries' : undefined
      };

      const response = await apiClient.captureLead(leadRequest);
      
      setBotState(prev => ({ ...prev, step: 6, sessionId: response.lead_id || prev.sessionId }));
      setIsTyping(false);

      handleAddBotMessage(
        `Thank you, ${formData.name}! Your information has been saved.`
      );

      setTimeout(() => {
        startDetailedQuestions();
      }, 1500);
    } catch (error) {
      console.error('Error capturing lead:', error);
      setIsTyping(false);
      
      setBotState(prev => ({ ...prev, step: 6 }));
      handleAddBotMessage(
        `All set, ${formData.name}! Your information has been saved. We'll send your claim packet to your email shortly.

Need help with anything else?`,
        [
          { label: "Yes", value: "yes-help" },
          { label: "No", value: "no-help" }
        ]
      );
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userInput = inputValue;
    handleAddUserMessage(userInput);
    setInputValue('');

    if (botState.step >= 6 && botState.claimType) {
      await handleDetailedQuestionAnswer(userInput);
      return;
    }

    setIsTyping(true);

    try {
      const response = await apiClient.homePageChat({
        message: userInput,
        context: { 
          step: botState.step,
          claim_type: botState.claimType,
          accident_date: botState.accidentDate,
          has_injuries: botState.needsMedicalAttention
        }
      });

      setIsTyping(false);

      if (botState.step === 4) {
        handleAddBotMessage(response.response);
        setTimeout(() => {
          handleStep4Evidence();
        }, 1000);
      } else {
        handleAddBotMessage(response.response);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsTyping(false);
      handleAddBotMessage("Thank you for sharing that. Let me help you with the next steps.");
      
      if (botState.step === 4) {
        setTimeout(() => {
          handleStep4Evidence();
        }, 1000);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setBotState(prev => ({
      ...prev,
      leadInfo: { ...prev.leadInfo, [field]: value }
    }));
  };

  const startDetailedQuestions = async () => {
    setIsTyping(true);
    
    try {
      const initialAnswers = {
        full_name: botState.leadInfo.name,
        email: botState.leadInfo.email,
        phone_number: botState.leadInfo.phone,
        accident_date: botState.accidentDate
      };

      const response = await apiClient.homePageChat({
        message: "START_DETAILED_QUESTIONS",
        session_id: botState.sessionId,
        context: {
          step: 6,
          claim_type: botState.claimType,
          accident_date: botState.accidentDate,
          has_injuries: botState.needsMedicalAttention,
          question_index: 0,
          answers: initialAnswers,
          lead_info: botState.leadInfo,
          conversation_history: messages.map(m => ({ text: m.text, isUser: m.isUser }))
        }
      });

      setIsTyping(false);
      
      setBotState(prev => ({
        ...prev,
        questionIndex: response.question_index || 1,
        totalQuestions: response.total_questions || 0,
        sessionId: response.session_id,
        answers: initialAnswers
      }));

      handleAddBotMessage(response.response);
    } catch (error) {
      console.error('Error starting detailed questions:', error);
      setIsTyping(false);
      handleAddBotMessage(
        "I'm ready to ask you detailed questions about your claim. Let's start with your personal information."
      );
    }
  };

  const handleDetailedQuestionAnswer = async (answer: string) => {
    setIsTyping(true);
    
    try {
      const response = await apiClient.homePageChat({
        message: answer,
        session_id: botState.sessionId,
        context: {
          step: 6,
          claim_type: botState.claimType,
          accident_date: botState.accidentDate,
          has_injuries: botState.needsMedicalAttention,
          question_index: botState.questionIndex,
          answers: botState.answers,
          lead_info: botState.leadInfo,
          conversation_history: messages.slice(-10).map(m => ({ text: m.text, isUser: m.isUser }))
        }
      });

      setIsTyping(false);

      setBotState(prev => ({
        ...prev,
        questionIndex: response.question_index || prev.questionIndex + 1,
        answers: response.answers || prev.answers,
        sessionId: response.session_id
      }));

      if (response.completed) {
        // Show subscription requirement instead of direct download
        handleAddBotMessage(
          "🎉 Excellent! I've gathered all the information needed for your claim. To access your personalized claim packet and continue with your case, you'll need to subscribe to our service.",
          [
            { label: "Subscribe to Get Started", value: "subscribe" },
            { label: "Learn More About Pricing", value: "pricing" }
          ]
        );
      } else {
        handleAddBotMessage(response.response);
      }
    } catch (error) {
      console.error('Error handling detailed question:', error);
      setIsTyping(false);
      handleAddBotMessage("Thank you for that information. Let me ask you the next question.");
    }
  };

  const handleSubscriptionRedirect = (action: string) => {
    if (action === "subscribe") {
      navigate('/signup');
    } else if (action === "pricing") {
      navigate('/pricing');
    }
  };

  const handleSkipQuestions = async () => {
    setIsTyping(true);
    
    try {
      const response = await apiClient.homePageChat({
        message: "SKIP_QUESTIONS",
        session_id: botState.sessionId,
        context: {
          step: 6,
          claim_type: botState.claimType,
          accident_date: botState.accidentDate,
          has_injuries: botState.needsMedicalAttention,
          question_index: botState.questionIndex,
          answers: botState.answers,
          lead_info: botState.leadInfo,
          conversation_history: messages.slice(-10).map(m => ({ text: m.text, isUser: m.isUser })),
          skip_to_completion: true
        }
      });

      setIsTyping(false);

      handleAddBotMessage(
        response.response || "No problem! I've generated your basic claim packet with the information you've provided. To access your claim packet and continue with your case, you'll need to subscribe to our service.",
        [
          { label: "Subscribe to Get Started", value: "subscribe" },
          { label: "Learn More About Pricing", value: "pricing" }
        ]
      );

      setBotState(prev => ({
        ...prev,
        step: 7,
        questionIndex: prev.totalQuestions
      }));
    } catch (error) {
      console.error('Error skipping questions:', error);
      setIsTyping(false);
      handleAddBotMessage(
        "Got it! I'll generate your claim packet with the information you've already provided. To access your claim packet and continue with your case, you'll need to subscribe to our service.",
        [
          { label: "Subscribe to Get Started", value: "subscribe" },
          { label: "Learn More About Pricing", value: "pricing" }
        ]
      );
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 right-6 w-96 h-[600px] z-50"
        >
          <div className="relative h-full">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#8dff2d]/20 to-[#7be525]/20 rounded-3xl blur-xl" />

            {/* Chatbot Container */}
            <div className="relative bg-[#0a0a0a]/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#333333]/50 overflow-hidden h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-[#333333]/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8dff2d] to-[#7be525] flex items-center justify-center">
                    <SparklesIcon className="h-4 w-4 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">DocuPilot AI</h3>
                    <p className="text-xs text-gray-400">Personal Injury Expert</p>
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
                  <button
                    onClick={onClose}
                    className="ml-2 p-1 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <XIcon className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Progress Bar for Detailed Questions */}
              {botState.step >= 6 && botState.totalQuestions > 0 && (
                <div className="p-3 border-b border-[#333333]/50 bg-[#0a0a0a]/80">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-medium">
                        Question {botState.questionIndex} of {botState.totalQuestions}
                      </span>
                      <span className="text-xs text-[#8dff2d] font-semibold">
                        {Math.round((botState.questionIndex / botState.totalQuestions) * 100)}% Complete
                      </span>
                    </div>
                    <motion.button
                      onClick={handleSkipQuestions}
                      className="text-xs px-2 py-1 bg-[#333333] hover:bg-[#444444] text-gray-300 rounded-full transition-colors font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Skip & Subscribe
                    </motion.button>
                  </div>
                  <div className="w-full h-1.5 bg-[#222222] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#8dff2d] to-[#7be525]"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${(botState.questionIndex / botState.totalQuestions) * 100}%` 
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gradient-to-b from-[#0a0a0a]/50 to-[#111111]/50">
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
                          <div className="flex flex-wrap gap-2 mt-2">
                            {message.buttons.map((button, idx) => (
                              <motion.button
                                key={idx}
                                onClick={() => {
                                  if (button.value === "start-claim") {
                                    handleStartClaim();
                                  } else if (button.value === "subscribe" || button.value === "pricing") {
                                    handleSubscriptionRedirect(button.value);
                                  } else {
                                    handleButtonClick(button.value, button.label);
                                  }
                                }}
                                className="px-3 py-2 bg-[#8dff2d] text-black rounded-full hover:bg-[#7be525] transition-colors font-medium text-xs shadow-lg"
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
                          <div className="mt-2">
                            <input
                              type="date"
                              onChange={(e) => handleDateSubmit(e.target.value)}
                              className="w-full px-3 py-2 bg-[#222222]/80 border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8dff2d] text-white text-sm"
                            />
                          </div>
                        )}

                        {/* Lead Capture Form */}
                        {message.showForm && (
                          <form onSubmit={handleFormSubmit} className="mt-2 space-y-2">
                            <input
                              type="text"
                              placeholder="Full Name"
                              value={botState.leadInfo.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              className="w-full px-3 py-2 bg-[#222222]/80 border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8dff2d] text-white placeholder-gray-400 text-sm"
                              required
                            />
                            <input
                              type="email"
                              placeholder="Email Address"
                              value={botState.leadInfo.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="w-full px-3 py-2 bg-[#222222]/80 border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8dff2d] text-white placeholder-gray-400 text-sm"
                              required
                            />
                            <input
                              type="tel"
                              placeholder="Phone Number"
                              value={botState.leadInfo.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className="w-full px-3 py-2 bg-[#222222]/80 border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8dff2d] text-white placeholder-gray-400 text-sm"
                              required
                            />
                            <motion.button
                              type="submit"
                              className="w-full px-4 py-2 bg-[#8dff2d] text-black rounded-xl hover:bg-[#7be525] transition-colors font-semibold shadow-lg text-sm"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Submit & Get Your Claim Packet
                            </motion.button>
                          </form>
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
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingChatbot;
