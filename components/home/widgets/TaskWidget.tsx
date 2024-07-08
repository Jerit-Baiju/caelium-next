import { Task } from '@/helpers/props';
import useAxios from '@/helpers/useAxios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const TaskWidget = () => {
  let api = useAxios();
  const router = useRouter();
  let [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/api/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchTasks();
  }, []);

  const completeTask = async (id: number) => {
    try {
      api.patch(`/api/tasks/${id}/`, { completed: true });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className='dark:bg-neutral-800 bg-neutral-100 h-72 rounded-lg cursor-pointer'
      onClick={() => {
        router.push('/tasks');
      }}
    >
      <p className='text-3xl text-center border-b my-4 mx-4'>Tasks</p>
      <div className='overflow-auto h-56'>
        {tasks.length != 0 ? (
          tasks.map((task: Task, i) => (
            <div key={i} className='flex flex-grow justify-between items-center dark:bg-neutral-900 bg-neutral-300 mb-4 mx-4 px-4 py-2 rounded-lg'>
              {task.name}
              <div className='flex gap-4'>
                <i
                  onClick={() => completeTask(task.id)}
                  className='fa-solid fa-check text-green-500 text-lg dark:bg-neutral-800 bg-neutral-200 p-1 my-0.5 rounded-sm cursor-pointer'
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
  );
};

export default TaskWidget;
