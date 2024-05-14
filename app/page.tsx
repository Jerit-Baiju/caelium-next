'use client';
import CustomSelect from '@/components/home/CustomSelect';
import SpeedDial from '@/components/home/SpeedDial';
import AuthContext from '@/contexts/AuthContext';
import { Task } from '@/helpers/props';
import useAxios from '@/helpers/useAxios';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import Wrapper from './Wrapper';

const spaceOptions = [
  { value: 'Personal', label: 'Personal', icon: 'user' },
  { value: 'Partner', label: 'Partner', icon: 'heart' },
  { value: 'Family', label: 'Family', icon: 'people-group' },
  { value: 'Work', label: 'Work', icon: 'building' },
];

export default function Home() {
  let api = useAxios();
  const router = useRouter();
  let { user } = useContext(AuthContext);
  let [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/api/tasks');
        setTasks(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchTasks();
  }, []);

  const handleSelect = (value: string) => {
    console.log('Selected Version:', value);
  };

  const completeTask = async (id: number) => {
    try {
      api.patch(`/api/tasks/${id}/`, { completed: true });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.log(error);
    }
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
            <div className='grid grid-cols-1 md:grid-cols-4 gap-8 pt-8'>
              <div
                className='dark:bg-neutral-800 h-72 rounded-lg cursor-pointer'
                onClick={() => {
                  router.push('/tasks');
                }}
              >
                <p className='text-3xl text-center border-b my-4 mx-4'>Tasks</p>
                <div className='overflow-auto h-56'>
                  {tasks.length != 0 ? (
                    tasks.map((task: Task, i) => (
                      <div
                        key={i}
                        className='flex flex-grow justify-between items-center dark:bg-neutral-900 mb-4 mx-4 px-4 py-2 rounded-lg'
                      >
                        {task.name}
                        <div className='flex gap-4'>
                          <i
                            onClick={() => completeTask(task.id)}
                            className='fa-solid fa-check text-green-500 text-lg bg-neutral-800 p-1 my-0.5 rounded-sm cursor-pointer'
                          ></i>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='flex flex-col items-center justify-center h-full'>
                      <i className='fa-solid fa-circle-plus text-7xl text-center text-neutral-500' />
                      <p className='p-2 text-neutral-400 text-xl'>Add Task</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SpeedDial />
    </Wrapper>
  );
}
