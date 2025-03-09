'use client';
import Loader from '@/components/Loader';
import { Vortex } from '@/components/ui/vortex';
import { useNavbar } from '@/contexts/NavContext';
import { useTimeRestriction } from '@/contexts/TimeRestrictionContext';
import { getNextAvailableTime } from '@/utils/timeUtils';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiClock, FiMessageSquare, FiShield, FiUsers } from 'react-icons/fi';

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
  
  useEffect(() => {
    setShowNav(false);
    
    // Only fetch auth URL if time is allowed
    if (isTimeAllowed) {
      const fetch_auth_url = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/google/auth_url/`);
          const data = await response.json();
          setAuthURL(data.url);
        } catch (error) {
          console.error("Failed to fetch auth URL:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetch_auth_url();
    } else {
      setIsLoading(false);
    }
    
    return () => {
      setShowNav(true);
    };
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
      {/* Enhanced background elements */}
      <div className='absolute top-0 -right-20 w-[500px] h-[500px] rounded-full bg-linear-to-r from-purple-500 to-indigo-500 blur-[120px] opacity-20' />
      <div className='absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-linear-to-r from-indigo-500 to-purple-500 blur-[120px] opacity-20' />

      <Vortex
        backgroundColor='transparent'
        rangeY={800}
        particleCount={100}
        baseHue={240}
        className='relative z-10 flex items-center justify-center min-h-screen w-full px-6 md:px-10'
      >
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='flex flex-col items-center max-w-4xl w-full py-8'
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className='flex flex-col items-center text-center mb-12'>
            <h1 className='text-4xl md:text-7xl font-bold mb-6 bg-linear-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent'>
              Welcome to Caelium
            </h1>
            
            {isTimeAllowed ? (
              <>
                <p className='text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl'>
                  Meet new people from your college with just one click. Simple, fun, and made for Marianites.
                </p>

                {authURL && (
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='flex items-center justify-center px-8 py-4 gap-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300'
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
                
                {/* Timer badge */}
                <div className="mt-8 bg-indigo-600/20 py-2 px-4 rounded-lg inline-flex items-center gap-2">
                  <FiClock className="text-indigo-400" />
                  <span className="text-indigo-200 text-sm">
                    Session ends in: <span className="font-medium">{timeRemainingFormatted}</span>
                  </span>
                </div>
              </>
            ) : (
              <motion.div 
                variants={itemVariants}
                className="max-w-md w-full bg-slate-800/50 p-6 rounded-xl backdrop-blur-sm border border-indigo-500/20"
              >
                <div className="flex flex-col items-center gap-4">
                  <FiClock className="text-3xl text-indigo-400" />
                  
                  <h2 className="text-xl font-bold text-center text-white">
                    We'll be back soon!
                  </h2>
                  
                  <div className="text-center bg-indigo-600/20 py-2 px-4 rounded-lg w-full">
                    <p className="font-medium text-indigo-300">
                      {isUntilSessionEnd ? 'Closing in' : 'Next session in'}:
                      <span className="ml-2 font-bold text-white">{timeRemainingFormatted}</span>
                    </p>
                  </div>
                  
                  <p className="text-slate-300 text-center text-sm">
                    Caelium is available daily from {getNextAvailableTime()}
                  </p>
                  
                  <p className="text-slate-400 text-xs text-center mt-2">
                    Limited hours help ensure everyone's online at the same time, creating better connections.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Features Section */}
          <motion.div variants={itemVariants} className='grid md:grid-cols-3 max-md:hidden gap-6 mb-12 w-full'>
            <FeatureCard
              icon={<FiUsers className='w-6 h-6' />}
              title='College Only'
              description='Chat with students from your own college.'
            />
            <FeatureCard
              icon={<FiMessageSquare className='w-6 h-6' />}
              title='Random Chats'
              description='Connect with someone new each time.'
            />
            <FeatureCard
              icon={<FiShield className='w-6 h-6' />}
              title='No Pressure'
              description='No profiles to set up. Just chat and have fun.'
            />
          </motion.div>

          {/* Footer Links */}
          <motion.div variants={itemVariants} className='flex flex-col items-center gap-6'>
            <p className='text-sm bg-linear-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent font-medium'>
              Made by Marianites, for Marianites ✨
            </p>
            <div className='flex gap-6'>
              <a href='/privacy-policy' className='text-sm text-slate-400 hover:text-slate-200 transition-colors'>
                Privacy Policy
              </a>
              <a href='/terms-and-conditions' className='text-sm text-slate-400 hover:text-slate-200 transition-colors'>
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
    whileHover={{ scale: 1.05 }}
    className='p-6 rounded-xl bg-linear-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 hover:border-indigo-500/30 transition-all duration-300'
  >
    <div className='text-indigo-400 mb-4'>{icon}</div>
    <h3 className='text-xl font-semibold text-white mb-2'>{title}</h3>
    <p className='text-slate-300'>{description}</p>
  </motion.div>
);

export default Page;
