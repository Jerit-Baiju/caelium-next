'use client';

import AuthContext from '@/contexts/AuthContext';
import { useContext } from 'react';
import Wrapper from './Wrapper';

export default function Home() {
  let { user } = useContext(AuthContext);
  return (
    <Wrapper>
      <div className='m-10 h-min rounded-xl border p-10 w-full border-solid'>
        <span className='mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl'>
          <span>Welcome, {user?.name}</span>
        </span>
        <p className='text-lg m-2 font-normal text-gray-500 lg:text-xl dark:text-gray-400'>
          Unveil Your World, Connect Your Dreams – Where Privacy Meets Possibility.
        </p>
      </div>
    </Wrapper>
  );
}