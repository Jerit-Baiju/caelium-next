'use client';

import { useTimeRestriction } from '@/contexts/TimeRestrictionContext';
import { getNextAvailableTime } from '@/utils/timeUtils';
import { motion } from 'framer-motion';
import { FiClock } from 'react-icons/fi';

interface TimeRestrictedPageProps {
  children: React.ReactNode;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const TimeRestrictedPage = ({ children }: TimeRestrictedPageProps) => {
  const { isTimeAllowed, timeRemainingFormatted, isUntilSessionEnd } = useTimeRestriction();

  // If time is allowed, render the children
  if (isTimeAllowed) {
    return (
      <div className="relative">
        {children}
        
        {/* Floating timer showing time remaining in session */}
        <div className="fixed bottom-4 right-4 bg-indigo-900/80 text-white px-4 py-2 rounded-full backdrop-blur-sm shadow-lg z-50 flex items-center gap-2">
          <FiClock size={16} />
          <span className="text-sm font-medium">{timeRemainingFormatted}</span>
        </div>
      </div>
    );
  }

  // If time is not allowed, show restricted access message
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full bg-slate-800/50 p-8 rounded-2xl backdrop-blur-md border border-indigo-500/20"
      >
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-4">
          <FiClock className="text-4xl text-indigo-400" />
          
          <h1 className="text-2xl font-bold text-center text-white">
            Be Back Soon
          </h1>
          
          <div className="text-center bg-indigo-600/20 py-3 px-5 rounded-lg w-full">
            <p className="font-medium text-indigo-300">
              {isUntilSessionEnd ? 'Closing in' : 'Next session in'}
              <span className="ml-2 font-bold text-lg text-white">{timeRemainingFormatted}</span>
            </p>
          </div>
          
          <p className="text-slate-300 text-center">
            Available daily from {getNextAvailableTime()}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
