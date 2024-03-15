'use client';

import Calendar from '@/components/home/Calendar';
import CustomSelect from '@/components/home/CustomSelect';
import Spotify from '@/components/home/spotify';
import AuthContext from '@/contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import Wrapper from './Wrapper';

const options = [
  { value: 'Personal', label: 'Personal', icon: 'user'},
  { value: 'Partner', label: 'Partner', icon: 'heart' },
  { value: 'Family', label: 'Family', icon: 'people-group' },
  { value: 'Work', label: 'Work', icon: 'building'},
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
      <div className='w-full'>
        <div className='p-4'>
          <CustomSelect options={options} onSelect={handleSelect} defaultOption='Personal' />
        </div>
        <div className='max-sm:m-5 mx-4 h-min flex rounded-xl border p-10 border-solid'>
          <div className='w-2/3'>
            <span className='mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl'>
              <span>Welcome, {user?.name}</span>
            </span>
            <p className='text-lg m-2 font-normal text-gray-500 lg:text-xl dark:text-gray-400'>
              Unveil Your World, Connect Your Dreams - Where Privacy Meets Possibility.
            </p>
          </div>
          <div className='w-1/3 dark:text-white'>
            <Spotify />
          </div>
        </div>
        <div className='w-fit'>
          <Calendar onSelectDate={handleSelectDate} />
        </div>
      </div>
    </Wrapper>
  );
}
