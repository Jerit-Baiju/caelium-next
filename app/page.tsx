'use client';
import Calendar from '@/components/home/Calendar';
import CustomSelect from '@/components/home/CustomSelect';
import SpeedDial from '@/components/home/SpeedDial';
import AuthContext from '@/contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import Wrapper from './Wrapper';

const spaceOptions = [
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
          <CustomSelect options={spaceOptions} onSelect={handleSelect} defaultOption='Personal' />
        </div>
        <div className='max-sm:mx-4 mx-4 h-min flex rounded-xl p-10 max-sm:p-5 bg-neutral-200 dark:bg-neutral-900'>
          <div className='md:w-2/3'>
            <span className='mb-4 text-3xl font-extrabold text-neutral-900 dark:text-white md:text-5xl lg:text-6xl'>
              <span>Welcome, {user?.name}</span>
            </span>
            <p className='text-lg m-2 font-normal text-neutral-500 lg:text-xl dark:text-neutral-400'>
              Unveil Your World, Connect Your Dreams - Where Privacy Meets Possibility.
            </p>
            {/* <div className='flex items-center m-4 p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800'>
              <i className='fa-solid fa-clock text-3xl'></i>
              <div className='ml-3'>
                <p className='font-semibold'>12/03/2004</p>
                <p>Happy Birthday to you!</p>
              </div>
            </div> */}
          </div>
          <div className='w-fit max-sm:hidden'>
            <Calendar onSelectDate={handleSelectDate} />
          </div>
        </div>
      </div>
      <SpeedDial />
    </Wrapper>
  );
}
