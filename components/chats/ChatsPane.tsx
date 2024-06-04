'use client';
import { Chat } from '@/helpers/props';
import { getTime, truncate } from '@/helpers/support';
import useAxios from '@/helpers/useAxios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';

const ChatsPane = () => {
  let [chats, setChats] = useState([]);
  let [search_query, setSearch_query] = useState('');
  let api = useAxios();
  let session = useSession()

  const searchChats = async (e: any) => {
    e.preventDefault();
    try {
      const response = await api.get(`/api/chats/?search=${search_query}`);
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchChats = async () => {
    try {
      const response = await api.get('/api/chats/');
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [session.data?.accessToken]);

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && e.target.value != '') {
      searchChats(e);
    }
  };

  return (
    <div className='flex flex-col h-[calc(100dvh-5rem)] w-full flex-grow max-sm:h-min overflow-x-hidden overflow-y-auto'>
      <div className='flex w-full max-sm:w-screen sticky top-0 z-10 flex-col'>
        <form onSubmit={(e) => searchChats(e)} className='m-3'>
          <label htmlFor='default-search' className='mb-2 text-sm font-medium text-neutral-900 sr-only dark:text-white'>
            Search
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
              <i className='fa-solid fa-magnifying-glass'></i>
            </div>
            <input
              type='text'
              id='chat-search'
              className='block w-full p-2 ps-10 pe-10 text-sm text-neutral-900 border border-neutral-300 rounded-lg bg-neutral-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-900 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='Search'
              value={search_query}
              onChange={(e) => {
                e.target.value == '' ? fetchChats() : null;
                setSearch_query(e.target.value);
              }}
              onKeyDown={(e) => handleKeyDown(e)}
              autoComplete='off'
              required
            />
            {search_query && (
              <button
                onClick={() => {
                  setSearch_query('');
                  fetchChats();
                }}
                className='absolute inset-y-0 end-0 flex items-center w-fit pe-3'
              >
                <i className='fa-solid fa-xmark'></i>
              </button>
            )}
          </div>
        </form>
      </div>
      <ul role='list'>
        {chats.map((chat: Chat) => (
          <Link key={chat.id} href={`/chats/${chat.id}`}>
            <li className='px-3 py-2 m-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-900'>
              <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                <div className='flex-shrink-0 dark:bg-white rounded-full'>
                  <img
                    className='w-12 h-12 rounded-full border dark:border-neutral-500 border-neutral-200 object-cover'
                    src={chat.other_participant.avatar}
                    alt={chat.other_participant.name}
                  />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold text-neutral-900 truncate dark:text-white'>{chat.other_participant.name}</p>
                  <span className='text-sm text-neutral-500 dark:text-neutral-400'>
                    {truncate({ chars: chat.last_message_content, length: 45 })}
                  </span>
                </div>
                {chat.updated_time && (
                  <span className='inline-flex items-end bg-neutral-300 text-neutral-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-neutral-900 dark:text-neutral-300'>
                    {getTime(chat.updated_time)}
                  </span>
                )}
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default ChatsPane;
