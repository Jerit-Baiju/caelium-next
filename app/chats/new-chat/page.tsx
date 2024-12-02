'use client';
import useChatUtils from '@/helpers/chats';
import { User } from '@/helpers/props';
import Link from 'next/link';
import { useEffect } from 'react';

const NewChat = () => {
  const { createChat, fetchNewChats, newChats } = useChatUtils();
  useEffect(() => {
    fetchNewChats();
  }, []);

  return (
    <div className='flex-grow bg-opacity-50 overflow-y-auto overflow-x-hidden top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0'>
      <div className='relative sm:p-4 w-full'>
        <div className='relative bg-white rounded-lg shadow dark:bg-neutral-900 h-screen'>
          <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-neutral-600'>
            <h3 className='text-xl font-semibold text-neutral-900 dark:text-white'>New Chat</h3>
            <Link
              href={'/chats'}
              className='end-2.5 text-neutral-400 bg-transparent hover:bg-neutral-200 hover:text-neutral-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-neutral-600 dark:hover:text-white'
              data-modal-hide='new-chat-modal'
            >
              <i className='fa-solid fa-xmark'></i>
              <span className='sr-only'>Close modal</span>
            </Link>
          </div>
          <div className='p-4 md:p-5'>
              <div>
                <input
                  type='text'
                  name='name'
                  id='name'
                  className='bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-800 dark:border-neutral-500 dark:placeholder-neutral-400 dark:text-white'
                  placeholder='search'
                  required
                />
              </div>
              <ul className='h-[calc(100dvh-10rem)] w-full overflow-y-scroll'>
                {newChats.map((recipient: User) => (
                  <li
                    onClick={() => createChat(recipient.id)}
                    key={recipient.id}
                    className='px-3 py-3 m-1 rounded-md hover:bg-neutral-800'
                  >
                    <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                      <div className='flex-shrink-0'>
                        <img
                          className='w-12 h-12 rounded-full dark:bg-white object-cover'
                          src={recipient.avatar}
                          alt={recipient.name}
                        />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-semibold text-neutral-900 truncate dark:text-white'>{recipient.name}</p>
                        <p className='text-sm text-neutral-500 truncate dark:text-neutral-400'>{recipient.email}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChat;
