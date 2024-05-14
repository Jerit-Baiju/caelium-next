'use client';

import { Task } from '@/helpers/props';
import useAxios from '@/helpers/useAxios';
import { FormEvent, useEffect, useState } from 'react';
import Wrapper from '../Wrapper';

const page = () => {
  let [newTask, setNewTask] = useState('');
  let [tasks, setTasks] = useState<Task[]>([]);
  let api = useAxios();

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

  const createTask = async (e: FormEvent) => {
    e.preventDefault();
    if (newTask || newTask != '') {
      const response = await api.post('/api/tasks/', { name: newTask });
      setTasks([...tasks, response.data]);
      setNewTask('');
    }
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
      <div className='flex flex-col flex-grow items-center justify-center md:h-[calc(100dvh-5rem)] h-[calc(100dvh-9rem)]'>
        <div className='flex flex-col flex-grow md:my-10 justify-between max-sm:w-full md:w-1/3 bg-neutral-800 md:rounded-lg'>
          <p className='text-3xl text-center border-b mt-4 mx-4'>Tasks</p>
          <div className='flex-grow h-[calc(100dvh-20rem)] overflow-auto'>
            {tasks.length != 0 ? (
              tasks.map((task: Task, i) => (
                <div key={i} className='flex flex-grow justify-between items-center dark:bg-neutral-900 m-4 p-4 rounded-lg'>
                  {task.name}
                  <div className='flex gap-4'>
                    <i
                      onClick={() => completeTask(task.id)}
                      className='fa-solid fa-check text-green-500 text-xl bg-neutral-800 p-2 rounded-sm cursor-pointer'
                    ></i>
                  </div>
                </div>
              ))
            ) : (
              <div className='flex flex-col h-full items-center justify-center'>
                <p className='text-2xl text-neutral-400'>No Pending Tasks</p>
              </div>
            )}
          </div>
          <form onSubmit={(e) => createTask(e)}>
            <div className='flex items-center mx-4 mb-4'>
              <div className='flex flex-grow gap-2 w-full'>
                <input
                  type='text'
                  value={newTask}
                  placeholder='Add Task'
                  className='input input-bordered w-full border-none bg-neutral-700 focus:outline-none'
                  autoFocus
                  onChange={(e) => setNewTask(e.target.value)}
                  required
                />
                <button type='submit' className='btn dark:bg-blue-700 w-12 h-12 border-none hover:dark:bg-blue-600'>
                  <i className='fa-solid fa-plus text-xl'></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Wrapper>
  );
};

export default page;
