import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircleIcon } from 'lucide-react';
import FloatingChatbot from './FloatingChatbot';

const FloatingChatButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [hasShownAutoPopup, setHasShownAutoPopup] = useState(false);

  useEffect(() => {
    // Show the button after 5-8 seconds of page activity
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, Math.random() * 3000 + 5000); // Random delay between 5-8 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-popup the chatbot after 2-3 seconds of button being visible
    if (isVisible && !hasShownAutoPopup) {
      const autoPopupTimer = setTimeout(() => {
        setShowChatbot(true);
        setHasShownAutoPopup(true);
      }, Math.random() * 1000 + 2000); // Random delay between 2-3 seconds

      return () => clearTimeout(autoPopupTimer);
    }
  }, [isVisible, hasShownAutoPopup]);

  const handleChatButtonClick = () => {
    setShowChatbot(true);
  };

  // Expose global trigger function
  useEffect(() => {
    (window as any).triggerChatbot = () => {
      setShowChatbot(true);
    };
  }, []);

  const handleCloseChatbot = () => {
    setShowChatbot(false);
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && !showChatbot && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-40"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#8dff2d]/30 to-[#7be525]/30 rounded-full blur-lg" />
            
            {/* Chat Button */}
            <motion.button
              onClick={handleChatButtonClick}
              className="relative w-16 h-16 bg-gradient-to-r from-[#8dff2d] to-[#7be525] rounded-full shadow-2xl hover:shadow-[#8dff2d]/30 transition-all duration-300 flex items-center justify-center group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(141, 255, 45, 0.4)",
                  "0 0 0 10px rgba(141, 255, 45, 0)",
                  "0 0 0 0 rgba(141, 255, 45, 0)"
                ]
              }}
              transition={{
                boxShadow: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }
              }}
            >
              <MessageCircleIcon className="h-8 w-8 text-black group-hover:scale-110 transition-transform duration-200" />
              
              {/* Notification Badge */}
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                <span className="text-xs text-white font-bold">!</span>
              </motion.div>
            </motion.button>

            {/* Help Text */}
            <motion.div
              initial={{ opacity: 0, x: 10, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-16 right-8 bg-[#0a0a0a]/95 backdrop-blur-xl border border-[#333333]/50 rounded-2xl px-4 py-3 shadow-2xl whitespace-nowrap"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#8dff2d] rounded-full animate-pulse" />
                <div>
                  <p className="text-white font-semibold text-sm">Need help</p>
                </div>
              </div>
              
              {/* Arrow pointing to bottom-right (button) */}
              <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-3/4">
                <div className="w-0 h-0 border-t-[8px] border-t-[#333333]/50 border-l-[8px] border-l-[#333333]/50 border-r-[8px] border-r-transparent border-b-[8px] border-b-transparent" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chatbot */}
      <FloatingChatbot isVisible={showChatbot} onClose={handleCloseChatbot} />
    </>
  );
};

export default FloatingChatButton;
