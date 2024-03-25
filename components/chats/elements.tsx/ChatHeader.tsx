import AuthContext from '@/contexts/AuthContext';
import { User } from '@/helpers/props';
import { getMedia, getUrl } from '@/helpers/support';
import axios from 'axios';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';

const ChatHeader = ({ chatId }: { chatId: Number }) => {
  let { authTokens } = useContext(AuthContext);
  let [recipient, setRecipient] = useState<User | null>(null);

  interface Option {
    name: string;
    url: string;
  }

  const options: Option[] = [
    { name: 'Dashboard', url: '/dashboard' },
    { name: 'Settings', url: '/dash' },
  ];

  useEffect(() => {
    const fetchRecipient = async () => {
      try {
        const response = await axios.request(getUrl({ url: `/api/chats/${chatId}/`, token: authTokens?.access }));
        setRecipient(response.data['other_participant']);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchRecipient();
  }, []);

  return (
    <>
      <div className='flex sticky top-0 z-10 flex-row h-16 bg-neutral-900 dark:text-white'>
        <Link className='flex flex-col my-auto self-start p-3 h-min justify-center rounded-full' href='/chats'>
          <i className='fa-solid fa-arrow-left'></i>
        </Link>
        <div className='flex items-center'>
          <img
            className='h-12 my-2 w-12 max-sm:h-12 max-sm:w-12 rounded-full dark:bg-white'
            src={getMedia(recipient?.avatar||'')}
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
            className='fa-solid fa-ellipsis-vertical p-3 me-4'></button>
        </div>
      </div>
      <div
        className='z-50 hidden my-4 text-base list-none bg-white divide-y divide-neutral-100 rounded shadow dark:bg-neutral-700 dark:divide-neutral-600'
        id='dropdown-chat'>
        <ul className='py-1' role='none'>
          {options.map((option: Option, id) => (
            <li key={id}>
              <Link
                href={option.url} // Use the 'to' prop for the correct URL
                className='block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-600 dark:hover:text-white'
                role='menuitem'>
                {option.name}
              </Link>
            </li>
          ))}
          <li>
            <a
              data-modal-target='logout-modal'
              data-modal-toggle='logout-modal'
              className='block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-600 dark:hover:text-white'
              type='button'>
              Sign out
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ChatHeader;
