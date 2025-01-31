'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { BsLightningChargeFill } from 'react-icons/bs';
import { FaUsers } from 'react-icons/fa';
import { FiMessageSquare, FiVideo, FiX } from 'react-icons/fi';

export const ChatSelection = () => {
  const [showModal, setShowModal] = useState(false);

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: {
      scale: 1.03,
      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.4)',
      transition: { duration: 0.2 },
    },
  };

  const decorativeCircleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 0.1, transition: { duration: 1 } },
  };

  return (
    <div className='relative min-h-dvh w-full overflow-hidden'>
      {/* Decorative elements */}
      <motion.div
        initial='initial'
        animate='animate'
        variants={decorativeCircleVariants}
        className='absolute top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 blur-3xl'
      />
      <motion.div
        initial='initial'
        animate='animate'
        variants={decorativeCircleVariants}
        className='absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 blur-3xl'
      />

      <motion.div
        initial='hidden'
        animate='visible'
        variants={containerVariants}
        className='relative z-10 min-h-dvh w-full p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/30 shadow-2xl flex flex-col items-center justify-center gap-8'
      >
        {/* Header Section */}
        <motion.div variants={cardVariants} className='text-center flex flex-col items-center justify-center'>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent'>
            Connect with Your Tribe
          </h2>
          <p className='text-sm sm:text-base text-slate-400 max-w-2xl mx-auto'>
            Join 500+ Marianites already networking and collaborating on our exclusive platform
          </p>
          <motion.div variants={cardVariants} className='flex items-center justify-center gap-2 mt-4 text-slate-300'>
            <FaUsers className='text-indigo-400' />
            <span className='text-sm'>120+ online now</span>
          </motion.div>
        </motion.div>

        {/* Cards Section */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8'>
          <motion.button
            variants={cardVariants}
            whileHover='hover'
            whileTap={{ scale: 0.98 }}
            className='group relative flex flex-col items-center gap-4 p-8 rounded-2xl bg-gradient-to-br from-purple-600/20 to-purple-700/20 border border-purple-500/30 hover:border-purple-500/50 text-white transition-all duration-300'
          >
            <div className='p-4 rounded-full bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors'>
              <FiMessageSquare className='text-3xl sm:text-4xl text-purple-400' />
            </div>
            <span className='text-xl sm:text-2xl font-medium'>Chat Connect</span>
            <p className='text-sm text-slate-300 text-center'>Instant messaging with smart matching</p>
            <span className='mt-4 px-4 py-2 rounded-full bg-purple-500/20 text-xs font-medium'>⚡ Quick Connect</span>
          </motion.button>
          <motion.button
            variants={cardVariants}
            whileHover='hover'
            whileTap={{ scale: 0.98 }}
            className='group relative flex flex-col items-center gap-4 p-8 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-indigo-700/20 border border-indigo-500/30 hover:border-indigo-500/50 text-white transition-all duration-300'
          >
            <div className='absolute top-4 right-4'>
              <BsLightningChargeFill className='text-yellow-400 animate-pulse' />
            </div>
            <div className='p-4 rounded-full bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors'>
              <FiVideo className='text-3xl sm:text-4xl text-indigo-400' />
            </div>
            <span className='text-xl sm:text-2xl font-medium'>Video Meet</span>
            <p className='text-sm text-slate-300 text-center'>Face-to-face networking with your peers</p>
            <span className='mt-4 px-4 py-2 rounded-full bg-indigo-500/20 text-xs font-medium'>🔥 Most Popular</span>
          </motion.button>
        </div>

        {/* Footer Section */}
        <motion.div variants={cardVariants} className='text-center'>
          <p className='text-sm text-slate-400'>
            Built with ❤️ by Marianites |
            <a href='/terms-and-conditions' className='text-indigo-400 hover:text-indigo-300'>
              Terms
            </a>
            &
            <a href='/privacy-policy' className='text-indigo-400 hover:text-indigo-300'>
              Privacy
            </a>
          </p>
        </motion.div>

        {/* Modal - keeping existing modal code but updating styles */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className='bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl w-full max-w-md border border-slate-700/50'
              >
                <div className='flex justify-between items-center mb-4 sm:mb-6'>
                  <h3 className='text-lg sm:text-xl font-semibold text-white'>Filter Preferences</h3>
                  <button onClick={() => setShowModal(false)} className='text-slate-400 hover:text-white transition-colors p-1'>
                    <FiX size={20} />
                  </button>
                </div>

                <div className='space-y-3 sm:space-y-4'>
                  <select className='w-full p-2.5 rounded-lg bg-slate-700 text-white border-none text-sm sm:text-base'>
                    <option>Select Batch</option>
                    <option>2020</option>
                    <option>2021</option>
                    <option>2022</option>
                  </select>

                  <select className='w-full p-2.5 rounded-lg bg-slate-700 text-white border-none text-sm sm:text-base'>
                    <option>Select Year</option>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>

                  <select className='w-full p-2.5 rounded-lg bg-slate-700 text-white border-none text-sm sm:text-base'>
                    <option>Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <motion.button
                  variants={buttonVariants}
                  whileHover='hover'
                  whileTap='tap'
                  onClick={() => setShowModal(false)}
                  className='w-full mt-4 sm:mt-6 p-2.5 sm:p-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base font-medium transition-colors'
                >
                  Apply Filters
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
