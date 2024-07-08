import AuthContext from '@/contexts/AuthContext';
import { useContext } from 'react';
import EventWidget from '../widgets/EventWidget';
import TaskWidget from '../widgets/TaskWidget';

const Personal = () => {
  let { user } = useContext(AuthContext);

  return (
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
          <div className='dark:bg-neutral-800 bg-neutral-100 rounded-lg' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 md:pt-8'>
          <TaskWidget />
          <EventWidget />
        </div>
      </div>
    </div>
  );
};

export default Personal;
