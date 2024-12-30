import ChatContext from '@/contexts/ChatContext';
import { NavLink } from '@/helpers/props';
import Link from 'next/link';
import { useContext } from 'react';

const ChatHeader = () => {
  let { recipient, clearChat } = useContext(ChatContext);

  const options: NavLink[] = [
    { name: 'Dashboard', url: '/dashboard' },
    { name: 'Settings', url: '/dash' },
  ];

  return (
    <>
      <div className='flex sticky top-0 z-10 flex-row h-16 bg-neutral-300 dark:bg-neutral-900 dark:text-white'>
        <Link className='flex flex-col my-auto self-start p-3 h-min justify-center rounded-full' href='/chats'>
          <i className='fa-solid fa-arrow-left'></i>
        </Link>
        <div className='flex items-center'>
          <img
            className='h-12 my-2 w-12 max-sm:h-12 max-sm:w-12 rounded-full dark:bg-white object-cover'
            src={recipient?.avatar || ''}
            alt='user photo'
            width={100}
            height={100}
          />
          <p className='text-2xl ps-2'>{recipient?.name}</p>
        </div>
        <div className='flex items-center flex-grow justify-end'>
          <button
            type='button'
            aria-expanded='false'
            data-dropdown-toggle='dropdown-chat'
            id='dropdownDefaultButton'
            className='fa-solid fa-ellipsis-vertical p-3 me-4'
          ></button>
        </div>
      </div>
      <div
        className='z-50 hidden my-4 text-base list-none bg-white divide-y divide-neutral-100 rounded shadow dark:bg-neutral-700 dark:divide-neutral-600'
        id='dropdown-chat'
      >
        <ul className='py-1' role='none'>
          {options.map((option: NavLink, id) => (
            <li key={id}>
              <Link
                href={option.url}
                className='block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-600 dark:hover:text-white'
                role='menuitem'
              >
                {option.name}
              </Link>
            </li>
          ))}
          <li>
            <a
              data-modal-target='clear-chat-modal'
              data-modal-toggle='clear-chat-modal'
              className='block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-600 dark:hover:text-white'
              type='button'
            >
              Clear Chat
            </a>
          </li>
        </ul>
      </div>
      <div
        id='clear-chat-modal'
        tabIndex={-1}
        className='hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full'
      >
        <div className='relative p-4 w-full max-w-md max-h-full'>
          <div className='relative dark:bg-neutral-700 bg-neutral-300 rounded-lg shadow'>
            <button
              type='button'
              className='absolute top-3 end-2.5 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-neutral-300'
              data-modal-hide='clear-chat-modal'
            >
              <i className='fa-solid fa-xmark'></i>
              <span className='sr-only'>Close modal</span>
            </button>
            <div className='p-4 md:p-5 text-center'>
              <i className='fa-solid fa-circle-exclamation fa-fade text-yellow-500 dark:text-yellow-300 text-6xl my-4'></i>
              <h3 className='mb-5 text-lg font-normal'>Are you sure you want to clear ?</h3>
              <button
                onClick={clearChat}
                data-modal-hide='logout-modal'
                type='button'
                className='bg-red-500 text-white dark:hover:bg-red-800 hover:bg-red-600 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2'
              >
                Yes, I&apos;m sure
              </button>
              <button
                data-modal-hide='logout-modal'
                type='button'
                className='dark:bg-neutral-800 bg-neutral-500 text-white rounded-lg font-medium px-5 py-2.5 hover:bg-neutral-700'
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatHeader;
