'use client';
import AuthContext from '@/contexts/AuthContext';
import { getUrl } from '@/helpers/api';
import { UserProps } from '@/helpers/props';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  let router = useRouter();
  let { user } = useContext(AuthContext);
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
    console.log(recipient_id);
    console.log(user.id);

    try {
      const response = await axios.request(
        getUrl({ url: '/api/chats/create/', data: { participants: [recipient_id, user.id] }, token: authTokens.access, method: 'POST' })
      );
      console.log(response.data);
      router.push(`/chats/${response.data.id}`);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.request(getUrl({ url: '/api/chats/', token: authTokens?.access }));
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='w-full bg-secondary max-sm:h-screen overflow-x-hidden overflow-y-auto'>
      <form onSubmit={(e) => fetchUsers(e)} className='m-3'>
        <label htmlFor='default-search' className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'>
          Search
        </label>
        <div className='relative'>
          <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
            <i className='text-white fa-solid fa-magnifying-glass'></i>
          </div>
          <input
            type='text'
            id='default-search'
            className='block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            placeholder='Search'
            required
          />
        </div>
      </form>
      <ul className={`${!showChats && 'max-sm:hidden'}`} role='list'>
        {chats.map((item: JSONSchema) => (
          <Link key={item.chat.id} href={`/chats/${item.chat.id}`}>
            <li className='px-3 py-2 m-1 rounded-md hover:bg-neutral-900'>
              <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                <div className='flex-shrink-0 dark:bg-white bg-black rounded-full p-1'>
                  <img className='w-12 h-12 rounded-full' src={item.chat.avatar} alt={item.chat.name} />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold text-gray-900 truncate dark:text-white'>{item.chat.name}</p>
                  <p className='text-sm text-gray-500 truncate dark:text-gray-400'>email@flowbite.com</p>
                </div>
                {/* <span className='inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-900 dark:text-gray-300'>
                  1
                </span> */}
              </div>
            </li>
          </Link>
        ))}
      </ul>
      <ul className={`${showChats && 'max-sm:hidden'}`} role='list'>
        {users.map((user: UserProps) => (
          <li onClick={() => createChat(user.id)} key={user.id} className='px-3 py-3 m-1 rounded-md hover:bg-gray-700'>
            <div className='flex items-center space-x-3 rtl:space-x-reverse'>
              <div className='flex-shrink-0'>
                <img className='w-12 h-12 rounded-full dark:bg-white' src={user.avatar} alt={user.name} />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-semibold text-gray-900 truncate dark:text-white'>{user.name}</p>
                <p className='text-sm text-gray-500 truncate dark:text-gray-400'>{user.username}</p>
              </div>
              {/* <span className='inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-900 dark:text-gray-300'>
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
