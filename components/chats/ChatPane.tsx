import AuthContext from '@/contexts/AuthContext';
import axios from 'axios';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';

export interface Item {
  chat: Chat;
}

export interface Chat {
  avatar: string;
  name: string;
}

interface SideBarProps {
  chat?: boolean;
}

const SideBar: React.FC<SideBarProps> = ({ chat = false }) => {
  let { authTokens } = useContext(AuthContext);
  let [chats, setChats] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: 'GET',
        url: process.env.NEXT_PUBLIC_API_HOST + '/api/chats/',
        headers: {
          Authorization: 'Bearer ' + authTokens.access,
          'content-type': 'application/json',
        },
      };

      try {
        const { data } = await axios.request(options);
        setChats(await data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={`w-full ${chat ? 'max-sm:hidden' : null} p-4 md:w-1/4 flex-grow-0 md:pr-4 md:border-r border-gray-200 dark:border-gray-700`}>
      <form className='mt-1 mb-2'>
        <label htmlFor='default-search' className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'>
          Search
        </label>
        <div className='relative'>
          <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
            <span className='material-symbols-outlined text-gray-500 dark:text-gray-400'>search</span>
          </div>
          <input
            type='text'
            id='default-search'
            className='block w-full p-1 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            placeholder='Search'
            required
            autoComplete='false'
          />
        </div>
      </form>
      <ul role='list' className='max-w-sm divide-y divide-gray-200 dark:divide-gray-700'>
        {chats.map((item: Item, id) => (
          <Link key={id} href={`/chats/${id}`}>
            <li className='p-2 sm:py-4 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md'>
              <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                <div className='flex-shrink-0 relative'>
                  <img className='w-10 h-10 rounded-full' src={item.chat.avatar} alt='Neil image' />
                  <span className='bottom-0 left-7 absolute  w-3.5 h-3.5 bg-blue-400 border-2 border-white dark:border-gray-800 rounded-full'></span>
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold text-gray-900 truncate dark:text-white'>{item.chat.name}</p>
                </div>
                <span className='inline-flex items-center bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300'>
                  1
                </span>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
