'use client';

import Loader from '@/components/layout/Loader';
import { useNavbar } from '@/contexts/NavContext';
import { serverManager } from '@/lib/serverManager';
import { Variants, motion } from 'framer-motion';
import { ServerCrash, Wifi } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.08, 1],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
  },
};

export default function ServerOffline() {
  const { setShowNav } = useNavbar();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setShowNav(false);
    setLoading(false);
    return () => {
      setShowNav(true);
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(async () => {
      try {
        await serverManager.forceRefresh();
        const server = await serverManager.selectServer();
        if (server) {
          router.back();
        }
      } catch {
        // still down, keep retrying
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  return !loading ? (
    <div className='min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4'>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        {/* Icon card */}
        <div className='flex justify-center mb-8'>
          <div className='relative'>
            <motion.div
              variants={pulseVariants}
              animate='animate'
              className='absolute inset-0 rounded-full bg-violet-500/20 blur-xl'
            />
            <div className='relative h-28 w-28 rounded-full bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 dark:border-violet-500/30 flex items-center justify-center'>
              <ServerCrash className='w-12 h-12 text-violet-500' strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className='text-center mb-6'>
          <h1 className='text-4xl font-bold bg-gradient-to-br from-violet-500 to-purple-500 bg-clip-text text-transparent mb-3'>
            Server Offline
          </h1>
          <p className='text-neutral-500 dark:text-neutral-400 text-base leading-relaxed'>
            Our servers are currently unreachable.
            <br />
            Reconnecting automatically — hang tight.
          </p>
        </div>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className='text-center text-xs text-neutral-400 dark:text-neutral-600 mt-6 flex items-center justify-center gap-1.5'
        >
          <Wifi className='w-3 h-3' />
          You&apos;ll be redirected automatically once the server is back
        </motion.p>
      </motion.div>
    </div>
  ) : (
    <Loader fullScreen />
  );
}
