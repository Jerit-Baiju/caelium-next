'use client';

import ChatsPane from '@/components/chats/ChatsPane';
import SpeedDial from '@/components/chats/elements.tsx/SpeedDial';
import AuthContext from '@/contexts/AuthContext';
import { User } from '@/helpers/props';
import { getUrl } from '@/helpers/support';
import axios from 'axios';
import { Comforter } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import Wrapper from '../Wrapper';
import { handleeFont } from '../font';

const comforter = Comforter({ weight: '400', subsets: ['cyrillic'] });

const Page = () => {
  const router = useRouter();
  let { user, authTokens } = useContext(AuthContext);
  let [users, setUsers] = useState([]);

  const createChat = async (recipient_id: number) => {
    console.log(recipient_id);
    console.log(user.id);

    try {
      const response = await axios.request(
        getUrl({ url: '/api/chats/create_chat/', data: { participants: [recipient_id, user.id] }, token: authTokens.access, method: 'POST' })
      );
      console.log(response.data);
      router.push(`/chats/${response.data.id}`);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.request(getUrl({ url: '/api/auth/accounts/', token: authTokens.access }));
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  return (
    <Wrapper>
      <div className='flex flex-grow divide-x divide-dashed divide-gray-500'>
        <div className='flex flex-grow flex-none sm:w-1/4'>
          <ChatsPane />
        </div>
        <div className='flex max-sm:hidden flex-none flex-grow sm:w-3/4'>
          <div className='flex flex-col h-full flex-grow items-center justify-center'>
            <div
              className={`mb-20 text-center font-bold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400  ${comforter.className}`}>
              <p className='text-9xl m-3'>Caelium</p>
              <p className='text-6xl m-3'>Elevating your Chat Experience</p>
            </div>
            <button
              onClick={fetchUsers}
              type='button'
              data-modal-target='authentication-modal'
              data-modal-toggle='authentication-modal'
              className={`${handleeFont.className} m-0 text-white bg-gradient-to-br from-sky-400 to-emerald-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2`}>
              Start New
            </button>
          </div>
        </div>
      </div>
      <div
        id='authentication-modal'
        tabIndex={-1}
        aria-hidden={true}
        className='hidden bg-black h-screen bg-opacity-50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full'>
        <div className='relative p-4 w-full max-w-xl max-h-full'>
          <div className='relative bg-white rounded-lg shadow dark:bg-neutral-900'>
            <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-neutral-600'>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>New Chat</h3>
              <button
                type='button'
                className='end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
                data-modal-hide='authentication-modal'>
                <i className='fa-solid fa-xmark'></i>
                <span className='sr-only'>Close modal</span>
              </button>
            </div>
            <div className='p-4 md:p-5'>
              <form className='space-y-4' action='#'>
                <div>
                  <input
                    type='email'
                    name='email'
                    id='email'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-800 dark:border-neutral-500 dark:placeholder-gray-400 dark:text-white'
                    placeholder='search'
                    required
                  />
                </div>
                <ul className='sm:max-h-[calc(100dvh-25rem)] overflow-y-scroll'>
                  {users.map((recipient: User) => (
                    <li onClick={() => createChat(recipient.id)} key={recipient.id} className='px-3 py-3 m-1 rounded-md hover:bg-gray-800'>
                      <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                        <div className='flex-shrink-0'>
                          <img className='w-12 h-12 rounded-full dark:bg-white' src={recipient.avatar} alt={recipient.name} />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-semibold text-gray-900 truncate dark:text-white'>{recipient.username}</p>
                          <p className='text-sm text-gray-500 truncate dark:text-gray-400'>{recipient.name}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </form>
            </div>
          </div>
        </div>
      </div>
      <SpeedDial />
    </Wrapper>
  );
};

export default Page;
