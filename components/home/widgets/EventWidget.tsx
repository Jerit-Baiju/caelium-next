import { Event } from '@/helpers/props';
import useAxios from '@/helpers/useAxios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const EventWidget = () => {
  let api = useAxios();
  const router = useRouter();
  let [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/api/events/');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div
      className='dark:bg-neutral-800 h-72 rounded-lg cursor-pointer'
      onClick={() => {
        router.push('/calendar');
      }}
    >
      <p className='text-3xl text-center border-b my-4 mx-4'>Events</p>
      <div className='overflow-auto h-56'>
        {events.length != 0 ? (
          events.map((event: Event, i) => (
            <div key={i} className='flex flex-grow justify-between items-center dark:bg-neutral-900 mb-4 mx-4 px-4 py-2 rounded-lg'>
              {event.name}
            </div>
          ))
        ) : (
          <div className='flex flex-col items-center justify-center h-full'>
            <i className='fa-solid fa-circle-plus text-7xl text-center text-neutral-500' />
            <p className='p-2 text-neutral-400 text-xl'>Add Event</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventWidget;
