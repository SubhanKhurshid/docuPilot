import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import PaymentModal from '../components/PaymentModal';
import {
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ClockIcon,
  FileTextIcon,
  BarChart3Icon,
  UsersIcon,
  TrendingUpIcon,
  MessageCircleIcon,
  StarIcon
} from 'lucide-react';

const Pricing = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { hasActiveSubscription, isLoading } = useSubscription();

  // Redirect users with active subscription to dashboard
  useEffect(() => {
    if (isAuthenticated && !isLoading && hasActiveSubscription) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, hasActiveSubscription, isLoading, navigate]);

  const toggleFaq = (index: number) => {
    setOpenFaq(prev =>
      prev.includes(index)
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }
    if (hasActiveSubscription) {
      navigate('/dashboard');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    navigate('/dashboard');
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
  };


  const features = [
    {
      icon: <BarChart3Icon className="h-5 w-5" />,
      text: 'AI-powered claim evaluation'
    },
    {
      icon: <FileTextIcon className="h-5 w-5" />,
      text: 'Customizable legal documents'
    },
    {
      icon: <TrendingUpIcon className="h-5 w-5" />,
      text: 'Step-by-step case guidance'
    },
    {
      icon: <ClockIcon className="h-5 w-5" />,
      text: 'Progress tracking & deadlines'
    },
    {
      icon: <UsersIcon className="h-5 w-5" />,
      text: 'Expert negotiation strategies'
    },
    {
      icon: <ShieldCheckIcon className="h-5 w-5" />,
      text: 'HIPAA-compliant security'
    },
    {
      icon: <FileTextIcon className="h-5 w-5" />,
      text: 'Document generation tools'
    },
    {
      icon: <TrendingUpIcon className="h-5 w-5" />,
      text: 'Settlement maximization tips'
    },
    {
      icon: <MessageCircleIcon className="h-5 w-5" />,
      text: '24/7 AI assistant support'
    }
  ];

  const faqItems = [
    {
      question: "How can this platform help me with my personal injury claim?",
      answer: "Our AI-powered platform provides step-by-step guidance, personalized claim strategies, and access to crucial tools that help you maximize your settlement without the need for an expensive lawyer. We give you everything you need—from customizable legal documents to expert tips—so you can navigate the process confidently."
    },
    {
      question: "Why should I choose this platform instead of hiring a lawyer?",
      answer: "Lawyers typically charge 33-40% of your final settlement, which can significantly reduce the amount you receive. With our platform, you can keep 100% of your settlement while still getting expert guidance, personalized strategies, and all the tools you need to handle your case from start to finish."
    },
    {
      question: "What tools are included with my membership?",
      answer: "As a member, you'll get: Claim Evaluation Tool to assess the value of your claim right away, Customizable Documents to create demand letters and medical release forms, Expert Guidance with step-by-step strategies and tips for negotiating with insurance companies, and a Progress Tracker to stay on top of important deadlines and monitor your case's progress."
    },
    {
      question: "How does the AI work?",
      answer: "Our AI analyzes your case details and provides personalized recommendations tailored to your unique situation. It helps you build a strong case by suggesting key steps, documents, and strategies that align with best practices in personal injury claims. The AI also updates its advice as your case progresses."
    },
    {
      question: "Is my personal information safe on this platform?",
      answer: "Yes, your privacy and security are our top priority. We use state-of-the-art encryption to protect your personal and legal information. All your data is stored securely, and we comply with legal standards such as HIPAA for any medical information you may share."
    },
    {
      question: "How much does it cost to use this platform?",
      answer: "We offer various membership plans to suit your needs. Our basic plan includes access to essential tools and resources at a low monthly fee, and we offer premium plans for those who need advanced features like customized claim strategies and real-time legal support. We also provide a 7-day free trial so you can try out the platform risk-free."
    },
    {
      question: "What happens if I need help during the claims process?",
      answer: "If you need assistance, our live chat support is available to answer questions and guide you through the process. You can also access our network of legal experts for additional support, ensuring you always have access to the help you need."
    },
    {
      question: "Can this platform handle all types of personal injury claims?",
      answer: "Yes, our platform is designed to assist with a wide range of personal injury cases, including car accidents, slip and falls, workplace injuries, medical malpractice, and more. Regardless of the type of injury, our AI will provide tailored guidance to maximize your claim."
    },
    {
      question: "What is the difference between using this platform and hiring a lawyer?",
      answer: "The key difference is cost. Lawyers typically take 33-40% of your settlement as their fee. With our platform, you keep 100% of your settlement. You'll still receive expert guidance, personalized strategies, and all the necessary tools, but at a fraction of the cost. Plus, you have full control over your case without needing to rely on a lawyer."
    },
    {
      question: "How long does it take to see results?",
      answer: "The timeline depends on the specifics of your case and how actively you use the tools provided. On average, users start seeing progress within a few weeks of using the platform. Our claim tracker will keep you informed of milestones and deadlines, so you always know where you stand."
    },
    {
      question: "Do I need any legal experience to use this platform?",
      answer: "No legal experience is required! Our platform is designed to be user-friendly, and our AI will guide you through each step of the process. We break down complex legal terms and provide easy-to-follow instructions, so anyone can navigate their claim with confidence."
    },
    {
      question: "How do I get started?",
      answer: "Simply sign up for a free trial to access our tools and resources. From there, you can start assessing your claim, generating documents, and using our AI to build your case. If you decide to continue, you can select the membership plan that fits your needs."
    }
  ];

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


  return (
    <div className="relative min-h-screen bg-[#111111] overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 opacity-[0.02]"
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
          className="absolute top-32 left-20 w-2 h-2 bg-[#8dff2d] rounded-full"
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
          className="absolute top-64 right-32 w-1 h-1 bg-[#8dff2d] rounded-full"
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
          className="absolute bottom-64 left-40 w-1.5 h-1.5 bg-[#8dff2d] rounded-full"
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

      {/* Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
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
                <span className="text-sm text-gray-300 font-medium">Simple, Transparent Pricing</span>
                <SparklesIcon className="h-4 w-4 text-[#8dff2d]" />
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl font-semibold mb-6 leading-tight"
                variants={itemVariants}
              >
                <span className="text-white">One plan.</span>
                <br />
                <span className="text-[#8dff2d]">Everything included.</span>
              </motion.h1>

              <motion.p
                className="text-xl text-gray-300 font-normal leading-relaxed max-w-3xl mx-auto"
                variants={itemVariants}
              >
                Get full access to AI-powered claim management, document generation,
                and expert guidance for one simple annual fee.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Card Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-lg mx-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#8dff2d]/20 to-[#7be525]/20 rounded-3xl blur-xl"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                <div className="relative bg-[#0a0a0a]/90 backdrop-blur-xl border border-[#333333]/50 rounded-3xl p-10 shadow-2xl">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-[#8dff2d]/10 border border-[#8dff2d]/20">
                      <StarIcon className="h-4 w-4 text-[#8dff2d] fill-current" />
                      <span className="text-sm text-[#8dff2d] font-medium">Most Popular</span>
                    </div>
                    <h2 className="text-2xl font-semibold mb-2 text-white">Professional Plan</h2>
                    <p className="text-gray-300 font-normal">Complete personal injury claim solution</p>
                  </div>

                  <div className="text-center mb-8">
                    <motion.div
                      className="text-6xl font-semibold text-white mb-2"
                      initial={{ scale: 0.5 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      $167
                    </motion.div>
                    <div className="text-gray-300 font-normal">per year</div>
                    <div className="text-sm text-[#8dff2d] mt-2 font-medium">Save 67% vs. lawyer fees</div>
                  </div>

                  <div className="space-y-4 mb-10">
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        viewport={{ once: true }}
                      >
                        <div className="w-8 h-8 rounded-full bg-[#8dff2d]/10 border border-[#8dff2d]/20 flex items-center justify-center text-[#8dff2d] flex-shrink-0">
                          {feature.icon}
                        </div>
                        <span className="text-gray-200 font-normal">{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={handleGetStarted}
                      className="group block w-full text-center px-8 py-4 rounded-full bg-[#8dff2d] text-black font-semibold text-lg hover:bg-[#7be525] transition-all duration-300 shadow-lg hover:shadow-[#8dff2d]/20"
                    >
                      {hasActiveSubscription ? 'Go to Dashboard' : 'Start Free Trial'}
                      <motion.div
                        className="ml-2 inline-block"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRightIcon className="h-5 w-5 inline" />
                      </motion.div>
                    </button>
                  </motion.div>

                  <p className="text-center text-sm text-gray-400 mt-6 font-normal">
                    {hasActiveSubscription 
                      ? 'You already have an active subscription' 
                      : '7-day free trial • No credit card required • Cancel anytime'
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24" id="faq">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-white">
                  Frequently asked questions
                </h2>
                <p className="text-xl text-gray-300 font-normal">
                  Everything you need to know about DocuPilot
                </p>
              </div>

              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className="border border-[#222222] rounded-2xl overflow-hidden bg-[#0a0a0a]/50 backdrop-blur-sm hover:border-[#333333] transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -2 }}
                  >
                    <motion.button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-[#111111]/50 transition-colors"
                      whileTap={{ scale: 0.995 }}
                    >
                      <h3 className="text-lg font-medium text-white pr-4">{item.question}</h3>
                      <motion.div
                        animate={{ rotate: openFaq.includes(index) ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {openFaq.includes(index) ? (
                          <ChevronUpIcon className="h-5 w-5 text-[#8dff2d] flex-shrink-0" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-[#8dff2d] flex-shrink-0" />
                        )}
                      </motion.div>
                    </motion.button>

                    <motion.div
                      initial={false}
                      animate={{
                        height: openFaq.includes(index) ? "auto" : 0,
                        opacity: openFaq.includes(index) ? 1 : 0
                      }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="px-8 pb-6">
                        <p className="text-gray-300 font-normal leading-relaxed">{item.answer}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16 border-t border-[#222222]">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center p-8 border border-[#222222] rounded-3xl bg-[#0a0a0a]/50 backdrop-blur-sm">
                <div className="inline-flex items-center gap-2 mb-6">
                  <ShieldCheckIcon className="h-6 w-6 text-[#8dff2d]" />
                  <h3 className="text-xl font-semibold text-white">Need personalized guidance?</h3>
                </div>
                <div className="text-gray-200 font-normal space-y-1">
                  <p><strong className="text-white font-semibold">Dr. Jared Rose DC</strong></p>
                  <p>Chiropractic Physician</p>
                  <p>Sobe Health Center</p>
                  <p>16585 NW 2 Avenue, Suite #300</p>
                  <p>Miami, FL 33169</p>
                  <motion.p
                    className="text-[#8dff2d] font-medium text-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    (305) 834-7900
                  </motion.p>
                </div>
              </div>
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
                Join thousands who have successfully handled their personal injury claims with DocuPilot's AI guidance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {hasActiveSubscription ? (
                    <Link
                      to="/dashboard"
                      className="group inline-flex items-center px-8 py-4 rounded-full bg-[#8dff2d] text-black font-semibold text-lg hover:bg-[#7be525] transition-all duration-300 shadow-lg hover:shadow-[#8dff2d]/20"
                    >
                      Go to Dashboard
                      <motion.div
                        className="ml-2"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRightIcon className="h-5 w-5" />
                      </motion.div>
                    </Link>
                  ) : (
                    <Link
                      to="/signup"
                      className="group inline-flex items-center px-8 py-4 rounded-full bg-[#8dff2d] text-black font-semibold text-lg hover:bg-[#7be525] transition-all duration-300 shadow-lg hover:shadow-[#8dff2d]/20"
                    >
                      Start Your Free Trial
                      <motion.div
                        className="ml-2"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRightIcon className="h-5 w-5" />
                      </motion.div>
                    </Link>
                  )}
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link 
                    to="/"
                    className="inline-flex items-center px-8 py-4 rounded-full border border-[#333333] text-white font-semibold text-lg hover:border-[#8dff2d] hover:bg-[#8dff2d]/5 transition-all duration-300"
                  >
                    Learn More
                  </Link>
                </motion.div>
              </div>

              <p className="text-sm text-gray-400 font-normal">
                {hasActiveSubscription 
                  ? 'You already have an active subscription' 
                  : ' • 7-day free trial • Cancel anytime'
                }
              </p>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handlePaymentCancel}
        onSuccess={handlePaymentSuccess}
        userEmail={user?.email || ''}
        userId={user?.id || ''}
      />
    </div>
  );
};

export default Pricing;