import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  percentage: number;
  onSkip: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, percentage, onSkip }) => {
  return (
    <div className="p-4 border-b border-[#333333]/50 bg-[#0a0a0a]/80">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">
            Question {current} of {total}
          </span>
          <span className="text-xs text-[#8dff2d] font-semibold">
            {percentage}% Complete
          </span>
        </div>
        <motion.button
          onClick={onSkip}
          className="text-xs px-3 py-1 bg-[#333333] hover:bg-[#444444] text-gray-300 rounded-full transition-colors font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Skip & Get Claim Packet
        </motion.button>
      </div>
      <div className="w-full h-2 bg-[#222222] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#8dff2d] to-[#7be525]"
          initial={{ width: 0 }}
          animate={{ 
            width: `${percentage}%` 
          }}
          transition={{ 
            duration: 0.5,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
