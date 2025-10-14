'use client';
import Loader from '@/components/layout/Loader';
import { Vortex } from '@/components/ui/vortex';
import AuthContext from '@/contexts/AuthContext';
import { useNavbar } from '@/contexts/NavContext';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import { FiMessageSquare, FiShield, FiUsers } from 'react-icons/fi';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Page: React.FC = () => {
  const [authURL, setAuthURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setShowNav } = useNavbar();
  const { authTokens } = useContext(AuthContext);
  const router = useRouter();

  // Ref to prevent duplicate API calls
  const hasCalledApiRef = useRef(false);

  // Check if user is logged in
  useEffect(() => {
    // If we have auth tokens, redirect to homepage
    if (authTokens) {
      router.replace('/');
      return;
    }
  }, [authTokens, router]);

  // Manage navbar visibility
  useEffect(() => {
    setShowNav(false);
    return () => setShowNav(true);
  }, [setShowNav]);

  // Fetch auth URL when component mounts
  useEffect(() => {
    if (!hasCalledApiRef.current && !authTokens) {
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
    }
  }, [authTokens]);

  // If we're redirecting, show loader
  if (authTokens) {
    return <Loader fullScreen />;
  }

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
    <div className='relative min-h-screen w-full overflow-hidden bg-zinc-950'>
      {/* Subtle gradient background */}
      <div className='absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-zinc-800/10 via-purple-900/5 to-transparent blur-[120px]' />

      <Vortex
        backgroundColor='transparent'
        rangeY={1000}
        particleCount={50}
        baseHue={220}
        className='relative z-10 flex items-center justify-center min-h-screen w-full px-5 sm:px-8'
      >
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='flex flex-col items-center max-w-2xl w-full py-12 sm:py-16 space-y-16'
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className='flex flex-col items-center text-center space-y-8 w-full'>
            <div className='space-y-4'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-100'>
                  Welcome to <span className='text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-400'>Caelium</span>
                </h1>
              </motion.div>
              <p className='text-lg text-zinc-400 max-w-md mx-auto leading-relaxed'>
                Your gateway to a seamless digital experience. Simple, powerful, and designed for the future.
              </p>
            </div>

            {authURL && (
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02, backgroundColor: 'rgb(39 39 42)' }}
                whileTap={{ scale: 0.98 }}
                className='flex items-center justify-center px-8 py-4 gap-3 bg-zinc-900 rounded-lg text-zinc-100 shadow-lg transition-all duration-300 border border-zinc-800 hover:border-zinc-700'
                onClick={() => {
                  window.location.href = authURL as string;
                }}
              >
                <img
                  loading='lazy'
                  height='20'
                  width='20'
                  id='provider-logo'
                  src='https://authjs.dev/img/providers/google.svg'
                  className='filter brightness-0 invert opacity-90'
                />
                <span className='font-medium'>Continue with Google</span>
              </motion.button>
            )}
          </motion.div>

          {/* Feature Cards */}
          <motion.div variants={itemVariants} className='grid grid-cols-1 md:grid-cols-3 max-md:hidden gap-4 mb-8 w-full'>
            <FeatureCard
              icon={<FiUsers className='w-5 h-5' />}
              title='Universal Platform'
              description='One app for everyone, connecting all aspects of your digital life.'
            />
            <FeatureCard
              icon={<FiMessageSquare className='w-5 h-5' />}
              title='Dynamic Encounters'
              description='Every interaction brings someone new into your digital orbit.'
            />
            <FeatureCard
              icon={<FiShield className='w-5 h-5' />}
              title='Expanding Universe'
              description='Growing beyond messaging into your all-in-one digital ecosystem.'
            />
          </motion.div>

          {/* Simplified Footer Links */}
          <motion.div
            variants={itemVariants}
            className='flex flex-col items-center gap-3 mt-auto pt-6 border-t border-indigo-500/10 w-full'
          >
            <p className='text-sm bg-linear-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent font-medium'>
              Building tomorrow&apos;s digital universe today ✨
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
    whileHover={{ scale: 1.02 }}
    className='p-6 rounded-lg bg-zinc-900/50 border border-zinc-800/50 
               hover:border-zinc-700/50 transition-all duration-300'
  >
    <div className='text-zinc-400 mb-3'>{icon}</div>
    <h3 className='text-base font-medium text-zinc-200 mb-2'>{title}</h3>
    <p className='text-zinc-400 text-sm leading-relaxed'>{description}</p>
  </motion.div>
);

// Add animations for other components
const style = document.createElement('style');
style.innerHTML = `
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
