'use client';

import AuthContext from '@/contexts/AuthContext';
import { useContext } from 'react';
import Wrapper from './Wrapper';

export default function Home() {
  let { user } = useContext(AuthContext);
  return (
    <Wrapper>
      <div className='w-full'>
        <form className='max-w-fit m-4'>
          <select
            id='countries'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
            <option selected>Personal</option>
            <option value='US'>Couple</option>
            <option value='CA'>Family</option>
            <option value='FR'>Work</option>
          </select>
        </form>
        <div className='max-sm:m-5 mx-4 h-min rounded-xl border p-10 border-solid'>
          <span className='mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl'>
            <span>Welcome, {user?.name}</span>
          </span>
          <p className='text-lg m-2 font-normal text-gray-500 lg:text-xl dark:text-gray-400'>
            Unveil Your World, Connect Your Dreams - Where Privacy Meets Possibility.
          </p>
        </div>
      </div>
    </Wrapper>
  );
}
