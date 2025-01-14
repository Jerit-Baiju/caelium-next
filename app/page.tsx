'use client';
import Personal from '@/components/home/spaces/personal';
// import SpeedDial from '@/components/home/SpeedDial';
import Loader from '@/components/Loader';
import AuthContext from '@/contexts/AuthContext';
import { useContext } from 'react';
import Wrapper from './Wrapper';

/**
 * Home component temporarily blocks the homepage and redirects to the '/chats' route.
 * It manages the selected space state and persists it in localStorage.
 * Depending on the selected space, it renders different content.
 * If the user is not authenticated, it shows a loader.
 */

export default function Home() {
  const { user } = useContext(AuthContext);

  return user ? (
    <Wrapper>
      <div className='w-full dark:text-white'>
        <Personal />
      </div>
      {/* <SpeedDial /> */}
    </Wrapper>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <Loader />
    </div>
  );
}
