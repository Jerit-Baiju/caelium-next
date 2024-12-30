'use client';
import AuthContext from '@/contexts/AuthContext';
import { Chat } from '@/helpers/props';
import { getTime, truncate } from '@/helpers/support';
import useAxios from '@/hooks/useAxios';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import Loader from '../Loader';

const ChatsPane = () => {
  const { authTokens } = useContext(AuthContext);
  const [chats, setChats] = useState<Chat[]>([]);
  const [search_query, setSearch_query] = useState('');
  const api = useAxios();
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [authTokens?.access]);

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && e.target.value !== '') {
      searchChats(e);
    }
  };

  return (
    <div className='flex flex-col max-md:h-[calc(100dvh-10rem)] h-[calc(100dvh-5rem)] w-full flex-grow overflow-hidden overflow-x-hidden'>
      <div className='flex w-full sticky top-0 z-10 flex-col'>
        <form onSubmit={searchChats} className='m-3'>
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
                setSearch_query(e.target.value);
                if (e.target.value === '') fetchChats(); // Fetch chats when search is cleared
              }}
              onKeyDown={handleKeyDown}
              autoComplete='off'
              required
            />
            {search_query && (
              <button
                type='button'
                onClick={() => {
                  setSearch_query('');
                  fetchChats();
                }}
                className='absolute inset-y-0 end-0 flex items-center w-fit pe-3'
              >
                <i className='fa-solid fa-times'></i>
              </button>
            )}
          </div>
        </form>
      </div>
      {isLoading ? (
        <div className='flex flex-grow items-center justify-center'>
          <Loader />
        </div>
      ) : (
        <ul role='list' className='flex flex-col overflow-y-auto'>
          {chats.map((chat: Chat) => (
            <Link key={chat.id} href={`/chats/${chat.id}`}>
              <li className='flex items-center justify-between px-3 py-2 m-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-900'>
                <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                  <div className='flex-shrink-0 dark:bg-white rounded-full'>
                    {!chat?.is_group ? (
                      <img
                        className='w-12 h-12 rounded-full border dark:border-neutral-500 border-neutral-200 object-cover'
                        src={chat.other_participant.avatar}
                        alt={chat.other_participant.name}
                      />
                    ) : chat.group_icon ? (
                      <img
                        className='w-12 h-12 rounded-full border dark:border-neutral-500 border-neutral-200 object-cover'
                        src={chat.group_icon || ''}
                        alt='user photo'
                        width={100}
                        height={100}
                      />
                    ) : (
                      <div className='flex items-center justify-center dark:text-black w-12 h-12 rounded-full border dark:border-neutral-500 border-neutral-200 object-cover'>
                        <i className='fa-solid fa-people-group text-2xl'></i>
                      </div>
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-semibold text-neutral-900 truncate dark:text-white'>
                      {chat.is_group ? chat.name : chat.other_participant.name}
                    </p>
                    <span className='text-sm text-neutral-500 dark:text-neutral-400'>
                      {truncate({ chars: chat.last_message_content, length: 45 })}
                    </span>
                  </div>
                </div>
                {chat.updated_time && (
                  <span className='inline-flex items-end bg-neutral-300 text-neutral-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-neutral-900 dark:text-neutral-300 whitespace-nowrap'>
                    {getTime(chat.updated_time)}
                  </span>
                )}
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatsPane;
