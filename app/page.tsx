'use client';

import AuthContext from '@/contexts/AuthContext';
import { useContext } from 'react';
import Wrapper from './Wrapper';

export default function Home() {
  let { user } = useContext(AuthContext);
  return (
    <Wrapper>
      <div className='container mx-auto p-4'>
          <span className='mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl'>
            <span className='text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400'>Welcome, {user.name}</span>
          </span>
          <p className='text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400'>
            Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.
          </p>
      </div>
    </Wrapper>
  );
}
