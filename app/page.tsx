'use client';
import Personal from '@/components/home/spaces/personal';
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
  return <Personal />;
}
