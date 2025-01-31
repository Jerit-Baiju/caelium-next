'use client';
import { ChatSelection } from '@/components/home/ChatSelection';
// import Personal from '@/components/home/spaces/personal';
// import SpeedDial from '@/components/home/SpeedDial';
import Loader from '@/components/Loader';
import AuthContext from '@/contexts/AuthContext';
import { useNavbar } from '@/contexts/NavContext';
import { useContext, useEffect } from 'react';

export default function Home() {
  const { user } = useContext(AuthContext);
  const { setShowNav } = useNavbar();

  useEffect(() => {
    setShowNav(false);
  }, []);

  return user ? (
    <div className='w-full dark:text-white'>
      <ChatSelection />
    </div>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <Loader />
    </div>
  );
}
