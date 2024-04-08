'use client';
import AuthContext from '@/contexts/AuthContext';
import { Chat, User } from '@/helpers/props';
import { getMedia, getTime, getUrl, truncate } from '@/helpers/support';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

const ChatsPane = () => {
  const router = useRouter();
  let { authTokens } = useContext(AuthContext);
  let [chats, setChats] = useState([]);
  let [users, setUsers] = useState([]);
  let [showChats, setShowChats] = useState(true);

  const fetchUsers = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.request(getUrl({ url: '/api/auth/accounts/', token: authTokens?.access }));
      setUsers(response.data);
      console.log(response.data);
      setShowChats(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const createChat = async (recipient_id: number) => {
    try {
      const response = await axios.request(
        getUrl({
          url: '/api/chats/',
          data: { participant: recipient_id },
          token: authTokens.access,
          method: 'POST',
        }),
      );
      console.log(response.data);
      router.push(`/chats/${response.data.id}`);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.request(getUrl({ url: '/api/chats/', token: authTokens?.access }));
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchChats();
  }, [authTokens?.access]);

  return (
    <div className='flex flex-col h-[calc(100dvh-5rem)] w-full flex-grow max-sm:h-min overflow-x-hidden overflow-y-auto'>
      <div className='flex w-full sticky top-0 z-10 flex-col'>
        <form onSubmit={(e) => fetchUsers(e)} className='m-3'>
          <label htmlFor='default-search' className='mb-2 text-sm font-medium text-neutral-900 sr-only dark:text-white'>
            Search
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
              <i className='text-white fa-solid fa-magnifying-glass'></i>
            </div>
            <input
              type='text'
              id='default-search'
              className='block w-full p-2 ps-10 text-sm text-neutral-900 border border-neutral-300 rounded-lg bg-neutral-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-900 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='Search'
              required
            />
          </div>
        </form>
      </div>
      <ul className={`${!showChats && 'max-sm:hidden'}`} role='list'>
        {chats.map((chat: Chat) => (
          <Link key={chat.id} href={`/chats/${chat.id}`}>
            <li className='px-3 py-2 m-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-900'>
              <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                <div className='flex-shrink-0 dark:bg-white rounded-full'>
                  <img
                    className='w-12 h-12 rounded-full'
                    src={getMedia(chat.other_participant.avatar)}
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
                  <span className='inline-flex items-end bg-neutral-200 text-neutral-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-neutral-900 dark:text-neutral-300'>
                    {getTime(chat.updated_time)}
                  </span>
                )}
              </div>
            </li>
          </Link>
        ))}
      </ul>
      <ul className={`${showChats && 'max-sm:hidden'}`} role='list'>
        {users.map((user: User) => (
          <li onClick={() => createChat(user.id)} key={user.id} className='px-3 py-3 m-1 rounded-md hover:bg-neutral-700'>
            <div className='flex items-center space-x-3 rtl:space-x-reverse'>
              <div className='flex-shrink-0'>
                <img className='w-12 h-12 rounded-full dark:bg-white' src={user.avatar} alt={user.name} />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-semibold text-neutral-900 truncate dark:text-white'>{user.name}</p>
                <p className='text-sm text-neutral-500 truncate dark:text-neutral-400'>{user.username}</p>
              </div>
              {/* <span className='inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-neutral-900 dark:text-neutral-300'>
                  1
                </span> */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatsPane;
