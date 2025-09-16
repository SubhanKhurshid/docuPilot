import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  SparklesIcon, 
  AlertTriangleIcon, 
  ScaleIcon,
  MapIcon,
  UserIcon,
  BookOpenIcon,
  PhoneIcon
} from 'lucide-react';

const Disclaimer = () => {
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
      title: "Nature of Our Service",
      icon: <BookOpenIcon className="h-5 w-5" />,
      content: "DocuPilot provides AI-powered tools and resources designed to help individuals organize and manage their personal injury claims independently. We offer educational content, document templates, and guidance tools, but we do not provide legal advice or representation."
    },
    {
      title: "No Attorney-Client Relationship",
      icon: <UserIcon className="h-5 w-5" />,
      content: "Use of this website and its tools does not establish an attorney-client relationship between you and DocuPilot or any affiliated parties. We are not your lawyers, and any information you provide through our platform is not protected by attorney-client privilege."
    },
    {
      title: "Limitation of Liability",
      icon: <ShieldCheckIcon className="h-5 w-5" />,
      content: "While we strive to provide accurate and helpful information, we make no warranties about the completeness, reliability, or suitability of our tools and content for your specific situation. You use our services at your own risk, and we are not liable for any outcomes resulting from your use of our platform."
    },
    {
      title: "Professional Legal Advice Recommended",
      icon: <ScaleIcon className="h-5 w-5" />,
      content: "Personal injury law can be complex, and every case is unique. While our tools can help you organize your claim, we strongly recommend consulting with a qualified attorney for legal advice tailored to your specific circumstances, especially for complex or high-value claims."
    },
    {
      title: "State Law Variations",
      icon: <MapIcon className="h-5 w-5" />,
      content: "Laws vary significantly from state to state. Our tools and information are general in nature and may not reflect the specific laws in your jurisdiction. Always verify local laws and regulations that may apply to your case."
    },
    {
      title: "Results Not Guaranteed",
      icon: <AlertTriangleIcon className="h-5 w-5" />,
      content: "Past results do not guarantee future outcomes. Every personal injury case is unique, and settlement amounts depend on numerous factors specific to your situation. Our AI estimates and guidance are for informational purposes only and should not be considered as guaranteed results."
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
                <span className="text-sm text-gray-300 font-medium">Important Legal Notice</span>
                <SparklesIcon className="h-4 w-4 text-[#8dff2d]" />
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-5xl font-semibold mb-6 text-white"
                variants={itemVariants}
              >
                Disclaimer
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-300 font-normal max-w-3xl mx-auto leading-relaxed"
                variants={itemVariants}
              >
                Please read this disclaimer carefully before using DocuPilot's services. 
                This information is crucial for understanding the scope and limitations of our platform.
              </motion.p>
            </motion.div>

            {/* Critical Notice */}
            <motion.div 
              className="mb-12 p-8 rounded-2xl border border-red-400/30 bg-red-400/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-400/20 border border-red-400/30 flex items-center justify-center text-red-400 flex-shrink-0 mt-1">
                  <AlertTriangleIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Critical Legal Notice</h3>
                  <div className="space-y-3 text-gray-200 font-normal leading-relaxed">
                    <p>
                      <strong className="text-red-400">This website is not a law firm</strong> and does not provide legal advice. 
                      We use AI tools to supply self-help information and organizational forms for personal injury claims.
                    </p>
                    <p>
                      <strong className="text-red-400">Using this site does not create an attorney-client relationship.</strong> 
                      For legal advice or representation, consult a licensed attorney.
                    </p>
                    <p>
                      <strong className="text-yellow-400">Your case results may vary.</strong> 
                      Past performance does not guarantee future outcomes. Every personal injury case is unique.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Disclaimer Sections */}
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

            {/* When to Consult an Attorney */}
            <motion.div 
              className="mb-12 p-8 rounded-2xl border border-[#8dff2d]/20 bg-[#8dff2d]/5 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#8dff2d]/20 border border-[#8dff2d]/30 flex items-center justify-center text-[#8dff2d] flex-shrink-0 mt-1">
                  <ScaleIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">When You Should Consult an Attorney</h3>
                  <div className="space-y-3 text-gray-300 font-normal">
                    <p>• <strong>Complex cases:</strong> Multiple parties, disputed liability, or severe injuries</p>
                    <p>• <strong>High-value claims:</strong> Significant medical expenses or long-term disabilities</p>
                    <p>• <strong>Legal disputes:</strong> Insurance company denial or bad faith practices</p>
                    <p>• <strong>Court proceedings:</strong> If litigation becomes necessary</p>
                    <p>• <strong>Uncertain liability:</strong> When fault is disputed or unclear</p>
                  </div>
                </div>
              </div>
            </motion.div>

           

            {/* Footer */}
            <motion.div 
              className="text-center"
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
                  to="/terms"
                  className="inline-flex items-center px-6 py-3 rounded-full border border-[#333333] text-white font-medium hover:border-[#8dff2d] hover:bg-[#8dff2d]/5 transition-all duration-300"
                >
                  Terms of Use
                </Link>
                <Link 
                  to="/privacy"
                  className="inline-flex items-center px-6 py-3 rounded-full border border-[#333333] text-white font-medium hover:border-[#8dff2d] hover:bg-[#8dff2d]/5 transition-all duration-300"
                >
                  Privacy Policy
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;