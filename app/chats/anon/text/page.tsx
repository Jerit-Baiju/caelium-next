'use client';
import Loader from '@/components/Loader';
import { useNavbar } from '@/contexts/NavContext';
import { useEffect, useState } from 'react';

const Page = () => {
  const { setShowNav } = useNavbar();
  const [currentTipIndex, setCurrentTipIndex] = useState(Math.floor(Math.random() * 5));
  const [isVisible, setIsVisible] = useState(true);

  const tips = [
    'Be respectful and kind to others',
    'Keep conversations friendly and light',
    "Feel free to skip if you're uncomfortable",
    'Report any inappropriate behavior',
    'Have fun and be yourself!',
  ];

  useEffect(() => {
    setShowNav(false);
    return () => {
      setShowNav(true);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false); // Start fade out
      setTimeout(() => {
        // Ensure we don't show the same tip twice in a row
        setCurrentTipIndex((prev) => {
          let next = Math.floor(Math.random() * tips.length);
          while (next === prev) {
            next = Math.floor(Math.random() * tips.length);
          }
          return next;
        });
        setIsVisible(true); // Start fade in
      }, 200); // Wait for fade out to complete
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className='flex grow md:p-6 md:gap-6 h-dvh md:mx-96'>
      <div className='flex flex-col w-full h-full items-center justify-center gap-6'>
        <Loader />
        <div className='flex flex-col items-center gap-2 text-center'>
          <h2 className='text-xl font-semibold'>Looking for someone to chat with...</h2>
          <p className='text-gray-500'>Please wait while we connect you with a random person</p>
          <p
            className={`text-sm text-gray-400 mt-2 px-5 italic transition-opacity duration-200 ease-in-out ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {tips[currentTipIndex]}
          </p>
        </div>
      </div>
    </main>
  );
};

export default Page;
