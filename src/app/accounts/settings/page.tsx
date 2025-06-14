'use client';

import LogoutDialog from '@/components/chats/dialogs/LogoutDialog';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

const SettingsPage = () => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  return (
    <>
      <div className='flex flex-col grow mt-6 md:px-6 md:gap-6 md:h-[calc(100vh-8rem)] overflow-scroll'>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='container mx-auto px-4 py-8 max-w-5xl'>
          <h1 className='text-2xl font-bold mb-6'>Settings</h1>

          {/* Appearance Section */}
          <div className='bg-white dark:bg-neutral-900 shadow-sm rounded-lg p-6 mb-6'>
            <h2 className='text-xl font-medium mb-4'>Appearance</h2>
            <div className='grid gap-6'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <p className='text-sm font-medium'>Theme</p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>Customize how Caelium looks on your device</p>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Account Section */}
          <div className='bg-white dark:bg-neutral-900 shadow-sm rounded-lg p-6 mb-6'>
            <h2 className='text-xl font-medium mb-4'>Account</h2>
            <div className='grid gap-6'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <p className='text-sm font-medium'>Sign out of your account</p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>You&apos;ll need to sign in again to access your account</p>
                </div>
                <Button
                  variant='destructive' 
                  className='flex items-center gap-2'
                  onClick={() => setIsLogoutDialogOpen(true)}
                >
                  <LogOut className='h-4 w-4' />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <LogoutDialog 
        isOpen={isLogoutDialogOpen} 
        onClose={() => setIsLogoutDialogOpen(false)} 
      />
    </>
  );
};

export default SettingsPage;
