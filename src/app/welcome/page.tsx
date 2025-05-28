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
    <div className='relative min-h-screen w-full overflow-hidden bg-slate-900'>
      {/* Simplified background elements */}
      <div className='absolute top-0 -right-20 w-[500px] h-[500px] rounded-full bg-linear-to-r from-purple-500 to-indigo-500 blur-[180px] opacity-20' />
      <div className='absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-linear-to-r from-indigo-500 to-purple-500 blur-[180px] opacity-20' />

      <Vortex
        backgroundColor='transparent'
        rangeY={800}
        particleCount={80}
        baseHue={240}
        className='relative z-10 flex items-center justify-center min-h-screen w-full px-5 sm:px-8'
      >
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='flex flex-col items-center max-w-3xl w-full py-8 sm:py-10'
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className='flex flex-col items-center text-center mb-10 w-full'>
            <div className='flex flex-col items-center mb-5'>
              <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(139,92,246,0.25)]'>
                Welcome to Caelium
              </h1>
            </div>

            <p className='text-lg text-slate-200 mb-6 max-w-lg mx-auto'>
              <span className='font-medium text-indigo-300'>Right now</span>, the future of all-in-one digital experience is evolving.
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
                <span className='font-medium'>Sign in with Google</span>
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
    whileHover={{ scale: 1.03, y: -2 }}
    className='p-4 rounded-lg bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 
               hover:border-indigo-500/40 transition-all duration-300 shadow-sm'
  >
    <div className='text-indigo-400 mb-2'>{icon}</div>
    <h3 className='text-base font-semibold text-white mb-1'>{title}</h3>
    <p className='text-slate-300 text-xs'>{description}</p>
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
