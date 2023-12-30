'use client';
import AuthContext from '@/contexts/AuthContext';
import axios from 'axios';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';

export interface JSONSchema {
  chat: Chat;
}

export interface Chat {
  id: number;
  avatar: string;
  name: string;
}

const ChatsPane = () => {
  let { authTokens } = useContext(AuthContext);
  let [chats, setChats] = useState([]);
  const options = {
    method: 'GET',
    url: process.env.NEXT_PUBLIC_API_HOST + '/api/chats/',
    headers: {
      Authorization: 'Bearer ' + authTokens.access,
      'content-type': 'application/json',
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.request(options);
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='w-full bg-gray-800 h-full overflow-x-hidden overflow-y-auto'>
      <form className='m-3 sm:hidden'>
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
            className='block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            placeholder='Search'
            required
          />
        </div>
      </form>
      <ul role='list'>
        {chats.map((item: JSONSchema) => (
          <Link key={item.chat.id} href={`/chats/${item.chat.id}`}>
            <li className='px-3 py-3 m-1 rounded-md hover:bg-gray-700'>
              <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                <div className='flex-shrink-0'>
                  <img className='w-12 h-12 rounded-full' src={item.chat.avatar} alt={item.chat.name} />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold text-gray-900 truncate dark:text-white'>{item.chat.name}</p>
                  <p className='text-sm text-gray-500 truncate dark:text-gray-400'>email@flowbite.com</p>
                </div>
                <span className='inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-900 dark:text-gray-300'>
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

export default ChatsPane;
