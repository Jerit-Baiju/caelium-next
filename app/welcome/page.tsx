'use client';
import Loader from '@/components/Loader';
import { Vortex } from '@/components/ui/vortex';
import { useNavbar } from '@/contexts/NavContext';
import { useTimeRestriction } from '@/contexts/TimeRestrictionContext';
import { getNextAvailableTime } from '@/utils/timeUtils';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FiCalendar, FiClock, FiMessageSquare, FiShield, FiUsers } from 'react-icons/fi';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Page: React.FC = () => {
  const [authURL, setAuthURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isTimeAllowed, timeRemainingFormatted, isUntilSessionEnd } = useTimeRestriction();
  const { setShowNav } = useNavbar();

  // Ref to prevent duplicate API calls
  const hasCalledApiRef = useRef(false);

  // Manage navbar visibility
  useEffect(() => {
    setShowNav(false);
    return () => setShowNav(true);
  }, []);

  // Fetch auth URL when component mounts or time becomes allowed
  useEffect(() => {
    if (isTimeAllowed && !hasCalledApiRef.current) {
      hasCalledApiRef.current = true;

      const fetch_auth_url = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/google/auth_url/`);
          const data = await response.json();
          setAuthURL(data.url);
        } catch (error) {
          console.error('Failed to fetch auth URL:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetch_auth_url();
    } else if (!isTimeAllowed) {
      setIsLoading(false);
    }
  }, [isTimeAllowed]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return !isLoading ? (
    <div className='relative min-h-screen w-full overflow-hidden bg-slate-900'>
      {/* Simplified background elements */}
      <div className='absolute top-0 -right-20 w-[500px] h-[500px] rounded-full bg-linear-to-r from-purple-500 to-indigo-500 blur-[180px] opacity-20' />
      <div className='absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-linear-to-r from-indigo-500 to-purple-500 blur-[180px] opacity-20' />

      <Vortex
        backgroundColor='transparent'
        rangeY={800}
        particleCount={80} // Reduced particle count
        baseHue={240}
        className='relative z-10 flex items-center justify-center min-h-screen w-full px-5 sm:px-8'
      >
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='flex flex-col items-center max-w-3xl w-full py-8 sm:py-10' // Reduced max width
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className='flex flex-col items-center text-center mb-10 w-full'>
            <div className='flex flex-col items-center mb-5'>
              <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(139,92,246,0.25)]'>
                Welcome to Caelium
              </h1>
            </div>

            {isTimeAllowed ? (
              <>
                <p className='text-lg text-slate-200 mb-6 max-w-lg mx-auto'>
                  <span className='font-medium text-indigo-300'>Right now</span>, hundreds of Marianites are connecting.
                </p>

                {authURL && (
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='flex items-center justify-center px-7 py-3.5 gap-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white shadow-lg transition-all duration-300'
                    onClick={() => {
                      window.location.href = authURL as string;
                    }}
                  >
                    <img
                      loading='lazy'
                      height='24'
                      width='24'
                      id='provider-logo'
                      src='https://authjs.dev/img/providers/google.svg'
                      className='filter brightness-0 invert'
                    />
                    <span className='font-medium'>Sign in with College Email</span>
                  </motion.button>
                )}
              </>
            ) : (
              <motion.div variants={itemVariants} className='max-w-md w-full px-4 sm:px-0'>
                {/* Streamlined timer section */}
                <div
                  className='mb-6 px-5 py-3 rounded-lg bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm border border-indigo-500/30 
                               shadow-[0_0_15px_rgba(99,102,241,0.2)] mx-auto inline-flex items-center gap-3'
                >
                  <div className='relative'>
                    <FiClock className='text-indigo-300 text-xl animate-pulse-slow' />
                  </div>
                  <div className='flex flex-col items-start'>
                    <span className='text-xs text-indigo-300 font-medium'>
                      {isUntilSessionEnd ? 'SESSION CLOSING IN' : 'NEXT SESSION STARTS IN'}
                    </span>
                    <span className='font-bold text-white text-lg leading-tight countdown-text'>{timeRemainingFormatted}</span>

                    {/* Simpler progress bar */}
                    <div className='w-full bg-indigo-900/50 rounded-full h-1 mt-1.5'>
                      <div className='bg-gradient-to-r from-indigo-400 to-purple-400 h-1 rounded-full' style={{ width: '35%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Simplified "Why We Have Set Hours" section */}
                <div className='p-6 rounded-xl bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 shadow-md mb-6'>
                  <p className='text-slate-200 text-sm mb-4 text-center'>
                    Caelium thrives when we connect together! Scheduled sessions create:
                  </p>

                  <div className='grid grid-cols-3 gap-2 text-slate-200'>
                    <div className='flex flex-col items-center p-3 rounded-lg bg-indigo-600/10 border border-transparent hover:border-indigo-500/30 group'>
                      <FiUsers className='text-indigo-300 text-lg mb-2' />
                      <span className='text-center text-xs font-medium text-white'>More Users</span>
                    </div>
                    <div className='flex flex-col items-center p-3 rounded-lg bg-indigo-600/10 border border-transparent hover:border-indigo-500/30 group'>
                      <FiMessageSquare className='text-indigo-300 text-lg mb-2' />
                      <span className='text-center text-xs font-medium text-white'>Better Matches</span>
                    </div>
                    <div className='flex flex-col items-center p-3 rounded-lg bg-indigo-600/10 border border-transparent hover:border-indigo-500/30 group'>
                      <FiShield className='text-indigo-300 text-lg mb-2' />
                      <span className='text-center text-xs font-medium text-white'>Safer Space</span>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col items-center gap-4'>
                  <div className='flex items-center gap-2 text-slate-200 text-sm'>
                    <FiCalendar className='text-indigo-300' />
                    <p>
                      Available: <span className='font-semibold text-white'>{getNextAvailableTime()}</span>
                    </p>
                  </div>

                  {/* Simplified reminder button */}
                  {/* <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 py-2.5 px-5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-200 hover:bg-indigo-600/30 transition-all"
                  >
                    <FiBell className="text-indigo-300" /> 
                    <span>Notify Me</span>
                  </motion.button> */}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Feature Cards - simplified and only showing when time is allowed */}
          {isTimeAllowed && (
            <motion.div variants={itemVariants} className='grid grid-cols-1 md:grid-cols-3 max-md:hidden gap-4 mb-8 w-full'>
              <FeatureCard
                icon={<FiUsers className='w-5 h-5' />}
                title='College Only'
                description='Chat with students from your own college.'
              />
              <FeatureCard
                icon={<FiMessageSquare className='w-5 h-5' />}
                title='Random Chats'
                description='Connect with someone new each time.'
              />
              <FeatureCard
                icon={<FiShield className='w-5 h-5' />}
                title='No Pressure'
                description='No profiles to set up. Just chat and have fun.'
              />
            </motion.div>
          )}

          {/* Simplified Footer Links */}
          <motion.div
            variants={itemVariants}
            className='flex flex-col items-center gap-3 mt-auto pt-6 border-t border-indigo-500/10 w-full'
          >
            <p className='text-sm bg-linear-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent font-medium'>
              Made by Marianites, for Marianites ✨
            </p>
            <div className='flex gap-6'>
              <a href='/privacy-policy' className='text-xs text-slate-400 hover:text-slate-200 transition-colors'>
                Privacy Policy
              </a>
              <a href='/terms-and-conditions' className='text-xs text-slate-400 hover:text-slate-200 transition-colors'>
                Terms and Conditions
              </a>
            </div>
          </motion.div>
        </motion.div>
      </Vortex>
    </div>
  ) : (
    <Loader fullScreen />
  );
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -2 }}
    className='p-4 rounded-lg bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 
               hover:border-indigo-500/40 transition-all duration-300 shadow-sm'
  >
    <div className='text-indigo-400 mb-2'>{icon}</div>
    <h3 className='text-base font-semibold text-white mb-1'>{title}</h3>
    <p className='text-slate-300 text-xs'>{description}</p>
  </motion.div>
);

// Add this style to your global CSS or at the top of the component for the countdown animation
const style = document.createElement('style');
style.innerHTML = `
  @keyframes countdownPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  .countdown-text {
    animation: countdownPulse 1.5s infinite ease-in-out;
    text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
  }
  @keyframes pulseSubtle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  .animate-pulse-subtle {
    animation: pulseSubtle 2s infinite ease-in-out;
  }
  .animate-pulse-slow {
    animation: pulseSubtle 3s infinite ease-in-out;
  }
`;
document.head.appendChild(style);

export default Page;
