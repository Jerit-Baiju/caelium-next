'use client';
import CustomSelect from '@/components/home/CustomSelect';
import SpeedDial from '@/components/home/SpeedDial';
import EventWidget from '@/components/home/widgets/EventWidget';
import TaskWidget from '@/components/home/widgets/TaskWidget';
import AuthContext from '@/contexts/AuthContext';
import { useContext } from 'react';
import Wrapper from './Wrapper';

const spaceOptions = [
  { value: 'Personal', label: 'Personal', icon: 'user' },
  { value: 'Partner', label: 'Partner', icon: 'heart' },
  { value: 'Family', label: 'Family', icon: 'people-group' },
  { value: 'Work', label: 'Work', icon: 'building' },
];

export default function Home() {
  let { user } = useContext(AuthContext);
  const handleSelect = (value: string) => {
    console.log('Selected Version:', value);
  };

  return (
    <Wrapper>
      <div className='w-full dark:text-white'>
        <div className='p-4'>
          <CustomSelect options={spaceOptions} onSelect={handleSelect} defaultOption='Personal' />
        </div>
        <div className='max-sm:mx-4 mx-4 h-min flex rounded-xl p-8 max-sm:p-5 bg-neutral-200 dark:bg-neutral-900'>
          <div className='w-full'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='flex flex-col justify-center h-28'>
                <span className='text-3xl font-extrabold text-neutral-900 dark:text-white md:text-5xl lg:text-6xl'>
                  <span>Welcome, {user?.name}</span>
                </span>
                <p className='text-lg font-normal text-neutral-500 lg:text-xl dark:text-neutral-400'>
                  Unveil Your World, Connect Your Dreams - Where Privacy Meets Possibility.
                </p>
              </div>
              <div className='bg-neutral-800 rounded-lg' />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-8 md:pt-8'>
              <TaskWidget />
              <EventWidget />
            </div>
          </div>
        </div>
      </div>
      <SpeedDial />
    </Wrapper>
  );
}
