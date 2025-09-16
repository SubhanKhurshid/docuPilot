import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  SparklesIcon, 
  LockIcon, 
  EyeIcon,
  DatabaseIcon,
  UserIcon,
  CookieIcon,
  MailIcon
} from 'lucide-react';

const PrivacyPolicy = () => {
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
      title: "1. Information We Collect",
      icon: <DatabaseIcon className="h-5 w-5" />,
      content: [
        "Personal information you provide voluntarily (e.g., name, email, contact form submissions).",
        "Usage data (e.g., cookies, analytics, and browsing activity).",
        "Medical information related to your personal injury claim (stored with HIPAA compliance).",
        "Case details and documentation you upload to our platform."
      ]
    },
    {
      title: "2. How We Use Your Information",
      icon: <UserIcon className="h-5 w-5" />,
      content: [
        "To provide and improve our AI-powered legal assistance services.",
        "To personalize your experience and case recommendations on our site.",
        "To analyze traffic, usage patterns, and website performance.",
        "To generate customized legal documents and case strategies.",
        "To communicate with you about your case progress and platform updates."
      ]
    },
    {
      title: "3. Cookies and Tracking",
      icon: <CookieIcon className="h-5 w-5" />,
      content: [
        "We use cookies and similar technologies to enhance functionality and analyze usage.",
        "Essential cookies are required for the platform to function properly.",
        "Analytics cookies help us understand how users interact with our services.",
        "You can control cookies through your browser settings, though this may limit functionality."
      ]
    },
    {
      title: "4. Sharing of Information",
      icon: <EyeIcon className="h-5 w-5" />,
      content: [
        "We do not sell or rent your personal information to third parties.",
        "We may share limited data with trusted service providers (e.g., analytics tools, cloud storage) who assist in running our site.",
        "All service providers are bound by strict confidentiality agreements.",
        "We may disclose information if required by law or to protect our legal rights."
      ]
    },
    {
      title: "5. Security Measures",
      icon: <LockIcon className="h-5 w-5" />,
      content: [
        "We implement industry-standard encryption to protect your personal and legal information.",
        "All data transmission is secured using SSL/TLS encryption protocols.",
        "We comply with HIPAA standards for any medical information you share.",
        "Regular security audits and updates are performed to maintain data protection.",
        "However, no system is 100% secure, and you use the site at your own risk."
      ]
    },
    {
      title: "6. Third-Party Links",
      icon: <EyeIcon className="h-5 w-5" />,
      content: [
        "Our website may contain links to third-party sites and services.",
        "We are not responsible for the privacy practices or content of external sites.",
        "We recommend reviewing the privacy policies of any third-party sites you visit.",
        "Third-party integrations are carefully vetted for security and privacy compliance."
      ]
    },
    {
      title: "7. Your Privacy Rights",
      icon: <ShieldCheckIcon className="h-5 w-5" />,
      content: [
        "Depending on your location, you may have rights to access, update, or delete your personal information.",
        "You can request a copy of all data we have collected about you.",
        "You may request correction of inaccurate or incomplete information.",
        "You can request deletion of your account and associated data.",
        "Contact us at privacy@docupilot.com for any privacy-related requests."
      ]
    },
    {
      title: "8. Data Retention",
      icon: <DatabaseIcon className="h-5 w-5" />,
      content: [
        "We retain your information only as long as necessary to provide our services.",
        "Case information is typically retained for 7 years after case completion for legal compliance.",
        "Account information is deleted within 30 days of account closure request.",
        "Anonymized usage data may be retained indefinitely for service improvement."
      ]
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
                <span className="text-sm text-gray-300 font-medium">Privacy & Security</span>
                <SparklesIcon className="h-4 w-4 text-[#8dff2d]" />
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-5xl font-semibold mb-6 text-white"
                variants={itemVariants}
              >
                Privacy Policy
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-300 font-normal max-w-3xl mx-auto leading-relaxed"
                variants={itemVariants}
              >
                At DocuPilot, we value your privacy and are committed to protecting your personal information. 
                This Privacy Policy explains how we collect, use, and safeguard your data.
              </motion.p>
            </motion.div>

            {/* Security Promise */}
            <motion.div 
              className="mb-12 p-6 rounded-2xl border border-[#8dff2d]/20 bg-[#8dff2d]/5 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#8dff2d]/10 border border-[#8dff2d]/20 flex items-center justify-center text-[#8dff2d] flex-shrink-0 mt-1">
                  <ShieldCheckIcon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Your Data is Protected</h3>
                  <p className="text-gray-300 font-normal leading-relaxed">
                    We use <strong className="text-[#8dff2d]">bank-level encryption</strong> and comply with 
                    <strong className="text-[#8dff2d]"> HIPAA standards</strong> to ensure your personal and medical information 
                    remains completely secure. Your privacy is our top priority.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Privacy Sections */}
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
                      <ul className="space-y-3">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-[#8dff2d] rounded-full flex-shrink-0 mt-2" />
                            <span className="text-gray-300 font-normal leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Information */}
            

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

export default PrivacyPolicy;