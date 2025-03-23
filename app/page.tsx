'use client';
import { ChatSelection } from '@/components/home/ChatSelection';
import Personal from '@/components/home/spaces/personal';
import Loader from '@/components/layout/Loader';
import { TimeRestrictedPage } from '@/components/TimeRestrictedPage';
import AuthContext from '@/contexts/AuthContext';
import { useNavbar } from '@/contexts/NavContext';
import { useTimeRestriction } from '@/contexts/TimeRestrictionContext';
import { isSpecialUser } from '@/helpers/utils';
import { useContext, useEffect } from 'react';

export default function Home() {
  const { user } = useContext(AuthContext);
  const { setShowNav } = useNavbar();
  const { isTimeAllowed } = useTimeRestriction();
  const showPersonalInterface = user && isSpecialUser(user);

  useEffect(() => {
    // Only hide navigation for chat selection screen, not for personal interface
    setShowNav(showPersonalInterface);
    return () => setShowNav(true);
  }, [showPersonalInterface, setShowNav]);

  if (!user) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader />
      </div>
    );
  }

  // Show Personal interface for special users
  if (showPersonalInterface) {
    return <Personal />;
  }

  // Show regular ChatSelection interface for non-special users
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
