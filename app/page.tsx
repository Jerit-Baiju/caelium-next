'use client';
import { ChatSelection } from '@/components/home/ChatSelection';
import Loader from '@/components/Loader';
import { TimeRestrictedPage } from '@/components/TimeRestrictedPage';
import AuthContext from '@/contexts/AuthContext';
import { useNavbar } from '@/contexts/NavContext';
import { useTimeRestriction } from '@/contexts/TimeRestrictionContext';
import { useContext, useEffect } from 'react';

export default function Home() {
  const { user } = useContext(AuthContext);
  const { setShowNav } = useNavbar();
  const { isTimeAllowed } = useTimeRestriction();

  useEffect(() => {
    setShowNav(false);
    return () => setShowNav(true);
  }, []);

  if (!user) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader />
      </div>
    );
  }

  return isTimeAllowed ? (
    <div className='w-full dark:text-white'>
      <ChatSelection />
    </div>
  ) : (
    <TimeRestrictedPage>
      <ChatSelection />
    </TimeRestrictedPage>
  );
}
