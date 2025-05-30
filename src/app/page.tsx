'use client';
import HomePageLayout from '@/components/home/HomePage';
import Loader from '@/components/layout/Loader';
import AuthContext from '@/contexts/AuthContext';
import { useContext } from 'react';

export default function Home() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader />
      </div>
    );
  }
  return (
    <main className='flex grow mt-6 md:px-6 md:gap-6 md:h-[calc(100vh-8rem)] overflow-scroll'>
      <HomePageLayout />
    </main>
  );
}
