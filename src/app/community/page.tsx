'use client';

import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { LuKeyRound, LuLock, LuMail } from 'react-icons/lu';

// Define the step type for the maps
type StepKey = 1 | 2 | 3;

const stepVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 100 : -100,
    y: 0,
  }),
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.4, type: 'spring' as const, bounce: 0.2 },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -100 : 100,
    y: 0,
    transition: { duration: 0.3 },
  }),
};

const CommunityPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [direction, setDirection] = useState(1); // 1 for next, -1 for back

  const iconMap: Record<StepKey, React.ReactNode> = {
    1: <LuLock className='text-5xl text-white' />,
    2: <LuMail className='text-5xl text-white' />,
    3: <LuKeyRound className='text-5xl' />,
  };

  const headingMap: Record<StepKey, React.ReactNode> = {
    1: <>Your Caelium Community is Locked</>,
    2: <>Enter Your Organization Email</>,
    3: <>Enter Verification Code</>,
  };

  const descriptionMap: Record<StepKey, React.ReactNode> = {
    1: (
      <>
        You&apos;re missing out on the hottest conversations, exclusive events, and anonymous confessions happening at your community
        right now.
        <span className='font-semibold text-purple-600 dark:text-purple-400'> Your mates are already inside.</span>
      </>
    ),
    2: (
      <>
        To unlock your Caelium community, please enter your official email address. We&apos;ll send you a verification code to confirm
        your identity.
      </>
    ),
    3: (
      <>
        We&apos;ve sent a 6-digit code to{' '}
        <span className='font-semibold text-purple-600 dark:text-purple-400'>{email || 'your email'}</span>. Enter it below to join
        your campus community.
      </>
    ),
  };

  return (
    <main className='flex grow mt-6 md:px-6 md:gap-6 md:h-[calc(100vh-8rem)] overflow-scroll'>
      <div className='w-full max-w-4xl mx-auto px-4 py-8'>
        <AnimatePresence mode='wait' custom={direction}>
          <motion.div
            key={`step-${step}`}
            variants={stepVariants}
            custom={direction}
            initial='initial'
            animate='animate'
            exit='exit'
            className='flex flex-col items-center w-full'>
            {/* Icon and heading always in the same position */}
            <div className='text-center mt-16 mb-8 flex flex-col items-center'>
              <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6'>
                {iconMap[step as StepKey]}
              </div>
              <h1 className='text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4'>{headingMap[step as StepKey]}</h1>
              <p className='text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto'>{descriptionMap[step as StepKey]}</p>
            </div>
            {/* Step-specific content below icon/heading */}
            {step === 1 && (
              <button
                type='button'
                className='w-full max-w-md px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-pink-600 transition-colors duration-200'
                onClick={() => {
                  setDirection(1);
                  setStep(2);
                }}>
                Get Started
              </button>
            )}
            {step === 2 && (
              <>
                <Input
                  id='community-email'
                  type='email'
                  placeholder='yourname@community.org'
                  className='w-full max-w-md mb-4 py-6 px-4 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type='button'
                  className='w-full max-w-md px-4 py-3 mb-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-pink-600 transition-colors duration-200'
                  onClick={() => {
                    setDirection(1);
                    setStep(3);
                  }}
                  disabled={!email}>
                  Send Verification Code
                </button>
                <button
                  type='button'
                  className='w-full max-w-md px-4 py-3 border border-purple-500 text-purple-600 dark:text-purple-400 font-semibold rounded-lg shadow-sm hover:bg-purple-50 dark:hover:bg-neutral-900 transition-colors duration-200'
                  onClick={() => {
                    setDirection(-1);
                    setStep(1);
                  }}
                  aria-label='Back'>
                  <IoIosArrowBack className='w-5 h-5 mr-1 inline' />
                  Back
                </button>
              </>
            )}
            {step === 3 && (
              <>
                {/* Redesigned 6-digit PIN input */}
                <div className='flex gap-3 mb-4'>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <input
                      key={i}
                      type='text'
                      inputMode='numeric'
                      maxLength={1}
                      className='w-14 h-16 text-4xl text-center border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-transparent'
                      value={code[i] || ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        const newCode = code.split('');
                        newCode[i] = val;
                        setCode(newCode.join('').slice(0, 6));
                        if (val) {
                          // Move focus to next input
                          const next = document.getElementById(`pin-input-${i + 1}`);
                          if (next) (next as HTMLInputElement).focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace') {
                          if (code[i]) {
                            // Clear current input
                            const newCode = code.split('');
                            newCode[i] = '';
                            setCode(newCode.join(''));
                          } else if (i > 0) {
                            // Move to previous input and clear it
                            const prev = document.getElementById(`pin-input-${i - 1}`);
                            if (prev) (prev as HTMLInputElement).focus();
                            const newCode = code.split('');
                            newCode[i - 1] = '';
                            setCode(newCode.join(''));
                          }
                          // Prevent default to avoid browser navigation
                          e.preventDefault();
                        }
                      }}
                      id={`pin-input-${i}`}
                      autoComplete='one-time-code'
                    />
                  ))}
                </div>
                <button
                  type='button'
                  className='w-full max-w-md px-4 py-3 mb-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-pink-600 transition-colors duration-200'
                  disabled={code.length !== 6}>
                  Verify & Join Community
                </button>
                <button
                  type='button'
                  className='w-full max-w-md px-4 py-3 border border-purple-500 text-purple-600 dark:text-purple-400 font-semibold rounded-lg shadow-sm hover:bg-purple-50 dark:hover:bg-neutral-900 transition-colors duration-200'
                  onClick={() => {
                    setDirection(-1);
                    setStep(2);
                  }}
                  aria-label='Back'>
                  <IoIosArrowBack className='w-5 h-5 mr-1 inline' />
                  Back
                </button>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
};

export default CommunityPage;
