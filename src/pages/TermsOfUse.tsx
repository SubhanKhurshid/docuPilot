import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  SparklesIcon, 
  AlertTriangleIcon, 
  FileTextIcon,
  ScaleIcon,
  UserCheckIcon,
} from 'lucide-react';

const TermsOfUse = () => {
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

  const sections = [
    {
      title: "1. No Legal Advice",
      icon: <ScaleIcon className="h-5 w-5" />,
      content: "This website provides self-help tools, organizational forms, and information powered by artificial intelligence for individuals handling personal injury claims on their own. We are not lawyers, and we do not provide legal advice, representation, or attorney referrals."
    },
    {
      title: "2. No Attorney-Client Relationship",
      icon: <UserCheckIcon className="h-5 w-5" />,
      content: "Using this site does not create an attorney-client relationship. Any decisions you make about your claim are your own responsibility. If you need legal advice, you should consult a licensed attorney in your jurisdiction."
    },
    {
      title: "3. Accuracy of Information",
      icon: <FileTextIcon className="h-5 w-5" />,
      content: "We strive to provide accurate and helpful information, but we make no guarantee regarding the completeness, reliability, or outcome of using our tools. The content is provided \"as is\" and without warranties of any kind."
    },
    {
      title: "4. User Responsibility",
      icon: <AlertTriangleIcon className="h-5 w-5" />,
      content: "You are responsible for how you use the information and resources provided. We are not liable for any loss, damage, or claim resulting from your reliance on our website."
    },
    {
      title: "5. Intellectual Property",
      icon: <ShieldCheckIcon className="h-5 w-5" />,
      content: "All content, tools, and materials provided on this website are owned by DocuPilot and protected by copyright and other intellectual property laws. You may not copy, distribute, or modify our content without permission."
    },
    {
      title: "6. Changes to Terms",
      icon: <FileTextIcon className="h-5 w-5" />,
      content: "We may update these Terms of Use at any time. Your continued use of the site constitutes acceptance of any changes."
    }
  ];

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
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-transparent to-[#111111]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">

            {/* Header */}
            <motion.div 
              className="text-center mb-16"
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
                <span className="text-sm text-gray-300 font-medium">Legal Documentation</span>
                <SparklesIcon className="h-4 w-4 text-[#8dff2d]" />
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-5xl font-semibold mb-6 text-white"
                variants={itemVariants}
              >
                Terms of Use
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-300 font-normal max-w-3xl mx-auto leading-relaxed"
                variants={itemVariants}
              >
                Welcome to DocuPilot. By accessing or using our website, you agree to be bound by the following Terms of Use. 
                Please read them carefully. If you do not agree, you should not use our website.
              </motion.p>
            </motion.div>

            {/* Important Notice */}
            <motion.div 
              className="mb-12 p-6 rounded-2xl border border-red-400/20 bg-red-400/5 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center text-red-400 flex-shrink-0 mt-1">
                  <AlertTriangleIcon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Important Legal Notice</h3>
                  <p className="text-gray-300 font-normal leading-relaxed">
                    <strong className="text-red-400">DocuPilot is not a law firm</strong> and does not provide legal advice. 
                    We use AI tools to supply self-help information and organizational forms for personal injury claims. 
                    Using this site does not create an attorney-client relationship. For legal advice or representation, 
                    consult a licensed attorney.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Terms Sections */}
            <div className="space-y-8 mb-16">
              {sections.map((section, index) => (
                <motion.div 
                  key={index}
                  className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-[#333333]/50 rounded-2xl p-8 hover:border-[#333333] transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#8dff2d]/10 border border-[#8dff2d]/20 flex items-center justify-center text-[#8dff2d] flex-shrink-0">
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-4 text-[#8dff2d]">{section.title}</h2>
                      <p className="text-gray-300 font-normal leading-relaxed">{section.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

      
            {/* Footer */}
            <motion.div 
              className="mt-12 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-sm text-gray-400 font-normal mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/privacy"
                  className="inline-flex items-center px-6 py-3 rounded-full border border-[#333333] text-white font-medium hover:border-[#8dff2d] hover:bg-[#8dff2d]/5 transition-all duration-300"
                >
                  Privacy Policy
                </Link>
                <Link 
                  to="/disclaimer"
                  className="inline-flex items-center px-6 py-3 rounded-full border border-[#333333] text-white font-medium hover:border-[#8dff2d] hover:bg-[#8dff2d]/5 transition-all duration-300"
                >
                  Disclaimer
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;