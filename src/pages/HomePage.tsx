import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  CheckIcon,
  ShieldCheckIcon,
  ClockIcon,
  FileTextIcon,
  BarChart3Icon,
  StarIcon,
  PlayIcon,
  SendIcon,
  SparklesIcon,
  TrendingUpIcon,
  UsersIcon
} from 'lucide-react';
import ChatBubble from '../components/ChatBubble';

const HomePage = () => {
  const [messages, setMessages] = useState([{
    id: 1,
    text: "Hello! I'm DocuPilot AI. I can help you maximize your personal injury settlement.",
    isUser: false
  }, {
    id: 2,
    text: 'Would you like to learn how our AI-powered platform works?',
    isUser: false
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    setMessages([...messages, {
      id: Date.now(),
      text: inputValue,
      isUser: true
    }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Great! I can help you assess your claim value, generate legal documents, and guide you through the entire process. Let's get started with a free claim evaluation!",
        isUser: false
      }]);
      setIsTyping(false);
    }, 1500);
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
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
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
        <section className="min-h-screen flex items-center">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-7xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left Side - Content */}
                <div className="text-left">
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
                    <span className="text-sm text-gray-300 font-medium">AI-Powered Legal Solutions</span>
                    <SparklesIcon className="h-4 w-4 text-[#8dff2d]" />
                  </motion.div>

                  <motion.h1
                    className="text-5xl md:text-7xl font-semibold mb-8 leading-tight tracking-tight"
                    variants={itemVariants}
                  >
                    <span className="text-white">Your case,</span>
                    <br />
                    <span className="text-white">your settlement—</span>
                    <br />
                    <span className="text-[#8dff2d] font-medium">AI powered</span>
                  </motion.h1>

                  <motion.p
                    className="text-xl text-gray-300 mb-12 leading-relaxed font-normal max-w-2xl"
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
                        className="group inline-flex items-center px-8 py-4 rounded-full bg-[#8dff2d] text-black font-semibold text-lg hover:bg-[#7be525] transition-all duration-300 shadow-lg hover:shadow-[#8dff2d]/20"
                      >
                        Start Free Assessment
                        <motion.div
                          className="ml-2"
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRightIcon className="h-5 w-5" />
                        </motion.div>
                      </Link>
                    </motion.div>

                    <motion.button
                      className="group inline-flex items-center px-8 py-4 rounded-full border border-[#333333] text-white font-semibold text-lg hover:border-[#8dff2d] hover:bg-[#8dff2d]/5 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <PlayIcon className="mr-2 h-5 w-5" />
                      Watch Demo
                    </motion.button>
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

                {/* Right Side - Chatbot Interface */}
                <motion.div
                  className="relative"
                  variants={itemVariants}
                  {...floatingVariants}
                >
                  <div className="relative">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8dff2d]/20 to-[#7be525]/20 rounded-3xl blur-xl" />

                    {/* Chatbot Container */}
                    <div className="relative bg-[#0a0a0a]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#333333]/50 overflow-hidden">
                      <div className="p-6 border-b border-[#333333]/50 flex items-center justify-between">
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

                      <div className="h-80 overflow-y-auto p-6 flex flex-col gap-4 bg-gradient-to-b from-[#0a0a0a]/50 to-[#111111]/50">
                        {messages.map(message => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChatBubble message={message.text} isUser={message.isUser} />
                          </motion.div>
                        ))}
                        {isTyping && (
                          <motion.div
                            className="flex items-center gap-2 text-gray-400 ml-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <div className="typing-indicator">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                            <span className="text-sm font-medium">DocuPilot is analyzing...</span>
                          </motion.div>
                        )}
                      </div>

                      <form onSubmit={handleSendMessage} className="p-6 border-t border-[#333333]/50 bg-[#0a0a0a]/80">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            placeholder="Ask about your injury claim..."
                            className="flex-1 bg-[#222222]/80 border border-[#333333] rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8dff2d] focus:border-transparent text-white placeholder-gray-400 font-medium"
                          />
                          <motion.button
                            type="submit"
                            className="p-3 rounded-full bg-[#8dff2d] text-black hover:bg-[#7be525] transition-colors shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <SendIcon className="h-5 w-5" />
                          </motion.button>
                        </div>
                      </form>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

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
                <p className="text-xl text-gray-300 font-normal">Four simple steps to maximize your settlement</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  {
                    number: "01",
                    title: "Assessment",
                    description: "AI evaluates your claim value instantly using advanced algorithms",
                    icon: <BarChart3Icon className="h-8 w-8" />
                  },
                  {
                    number: "02",
                    title: "Strategy",
                    description: "Get personalized approach tailored to your specific case",
                    icon: <FileTextIcon className="h-8 w-8" />
                  },
                  {
                    number: "03",
                    title: "Documents",
                    description: "Generate professional legal documents with AI assistance",
                    icon: <FileTextIcon className="h-8 w-8" />
                  },
                  {
                    number: "04",
                    title: "Settlement",
                    description: "Track progress and maximize your final outcome",
                    icon: <TrendingUpIcon className="h-8 w-8" />
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
                  $2.3M+
                </motion.div>
                <p className="text-gray-300 font-normal text-lg">Total settlements secured for our users</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                {[
                  { value: "98%", label: "Success Rate", icon: <TrendingUpIcon className="h-6 w-6" /> },
                  { value: "45 Days", label: "Average Settlement Time", icon: <ClockIcon className="h-6 w-6" /> },
                  { value: "$47K", label: "Average Settlement", icon: <UsersIcon className="h-6 w-6" /> }
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
                    className="group inline-flex items-center px-8 py-4 rounded-full bg-[#8dff2d] text-black font-semibold text-lg hover:bg-[#7be525] transition-all duration-300 shadow-lg hover:shadow-[#8dff2d]/20"
                  >
                    Start Free Trial
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRightIcon className="h-5 w-5" />
                    </motion.div>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/pricing"
                    className="inline-flex items-center px-8 py-4 rounded-full border border-[#333333] text-white font-semibold text-lg hover:border-[#8dff2d] hover:bg-[#8dff2d]/5 transition-all duration-300"
                  >
                    View Pricing
                  </Link>
                </motion.div>
              </div>

              <p className="text-sm text-gray-400 font-normal">
                No credit card required • 7-day free trial • Cancel anytime
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;