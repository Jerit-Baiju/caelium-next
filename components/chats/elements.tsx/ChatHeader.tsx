import AuthContext from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';

const ChatHeader = () => {
  let { user } = useContext(AuthContext);

  interface Option {
    name: string;
    url: string;
  }

  const options: Option[] = [
    { name: 'Dashboard', url: '/dashboard' },
    { name: 'Settings', url: '/dash' },
  ];

  return (
    <>
      <div className='flex sticky top-0 z-10 flex-row h-16 bg-gray-700 dark:text-white'>
        <Link className='flex flex-col my-auto self-start p-3 h-min justify-center rounded-full' href='/chats'>
          <span className='material-symbols-outlined'>chevron_left</span>
        </Link>
        <div className='flex items-center'>
          <Image className='h-12 my-2 w-12 max-sm:h-12 max-sm:w-12 rounded-full' src={user?.avatar} alt='user photo' width={100} height={100} />
          <p className='text-2xl ps-2'>{user.name}</p>
        </div>
        <div className='flex items-center flex-grow justify-end'>
          <button
            type='button'
            aria-expanded='false'
            data-dropdown-toggle='dropdown-chat'
            id='dropdownDefaultButton'
            className='material-symbols-outlined p-3'>
            more_vert
          </button>
        </div>
      </div>
      <div
        className='z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600'
        id='dropdown-chat'>
        <div className='px-4 py-3' role='none'>
          <p className='text-sm text-gray-900 dark:text-white' role='none'>
            {user?.name}
          </p>
        </div>
        <ul className='py-1' role='none'>
          {options.map((option: Option, id) => (
            <li key={id}>
              <Link
                href={option.url} // Use the 'to' prop for the correct URL
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                role='menuitem'>
                {option.name}
              </Link>
            </li>
          ))}
          <li>
            <a
              data-modal-target='logout-modal'
              data-modal-toggle='logout-modal'
              className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
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