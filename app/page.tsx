'use client';

import Calendar from '@/components/home/Calendar';
import CustomSelect from '@/components/home/CustomSelect';
import AuthContext from '@/contexts/AuthContext';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import Wrapper from './Wrapper';
import SpeedDial from '@/components/home/SpeedDial';

const options = [
  { value: 'Personal', label: 'Personal', icon: 'user' },
  { value: 'Partner', label: 'Partner', icon: 'heart' },
  { value: 'Family', label: 'Family', icon: 'people-group' },
  { value: 'Work', label: 'Work', icon: 'building' },
];

export default function Home() {
  let { user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSelect = (value: string) => {
    console.log('Selected Version:', value);
  };
  useEffect(() => {
    console.log('Selected date changed:', selectedDate);
  }, [selectedDate]);

  return (
    <Wrapper>
      <div className='w-full dark:text-white'>
        <div className='p-4'>
          <CustomSelect options={options} onSelect={handleSelect} defaultOption='Personal' />
        </div>
        <div className='max-sm:m-5 mx-4 h-min flex rounded-xl border p-10 max-sm:p-5 border-solid'>
          <div className='md:w-2/3'>
            <span className='mb-4 text-3xl font-extrabold text-neutral-900 dark:text-white md:text-5xl lg:text-6xl'>
              <span>Welcome, {user?.name}</span>
            </span>
            <p className='text-lg m-2 font-normal text-neutral-500 lg:text-xl dark:text-neutral-400'>
              Unveil Your World, Connect Your Dreams - Where Privacy Meets Possibility.
            </p>
            <div className='flex items-center m-4 p-4 rounded-lg bg-neutral-800'>
              <i className='fa-solid fa-clock text-3xl'></i>
              <div className='ml-3'>
                <p className='font-semibold'>12/03/2004</p>
                <p>Happy Birthday to you!</p>
              </div>
            </div>
            <Link href={'/crafts/create'}>
              <button
                type='button'
                className='text-white bg-neutral-800 hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300 font-medium rounded-lg text-lg px-5 py-2.5 me-2 mb-2 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:ring-neutral-700 dark:border-neutral-700'
              >
                Craft <i className='fa-solid fa-feather ms-1'></i>
              </button>
            </Link>
          </div>
          <div className='w-fit max-sm:hidden'>
            <Calendar onSelectDate={handleSelectDate} />
          </div>
        </div>
      </div>
      <SpeedDial/>
    </Wrapper>
  );
}
