'use client';

import AuthContext from '@/contexts/AuthContext';
import { useContext } from 'react';
import Wrapper from './Wrapper';

export default function Home() {
  let { user } = useContext(AuthContext);
  return (
    <Wrapper>
      <div className='container mx-auto p-4'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-semibold dark:text-white'>Welcome, {user.name}</h1>
        </div>
      </div>
    </Wrapper>
  );
}
