'use client';
import AuthContext from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';

interface Option {
  name: string;
  url: string;
  icon: string;
}

export const options: Option[] = [
  { name: 'Home', url: '/', icon: 'house' },
  { name: 'Gallery', url: '/gallery', icon: 'mountain-sun' },
  { name: 'Chats', url: '/chats', icon: 'message' },
];

const SideBar = () => {
  const route = usePathname();
  let { logoutUser } = useContext(AuthContext);
  if (!['/accounts/login', '/accounts/register'].includes(route)) {
    return (
      <>
        <aside
          id='logo-sidebar'
          className='fixed top-0 left-0 z-40 w-64 h-screen max-sm:hidden transition-transform -translate-x-full sm:translate-x-0 '
          aria-label='Sidebar'>
          <div className='h-full px-3 pb-4 overflow-y-auto bg-primary'>
            <Link href='/' className='flex flex-col items-center justify-center'>
              <Image className='mt-2 pointer-events-none' src={'/logos/written.png'} alt='caelium' width={200} height={0} />
            </Link>
            <ul className='space-y-2 font-medium pt-3'>
              {options.map((option: Option, id) => (
                <li key={id}>
                  <Link href={option.url} className='flex items-center text-lg p-2 rounded-lg text-white hover:bg-secondary hover:text-gray-700'>
                    <i className={`fa-solid fa-${option.icon}`}></i>
                    <span className='flex-1 ms-3 whitespace-nowrap'>{option.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <a
                  data-modal-target='logout-modal'
                  data-modal-toggle='logout-modal'
                  className='flex items-center p-2 text-lg rounded-lg text-white hover:bg-secondary hover:text-gray-700'
                  type='button'>
                  <i className={`fa-solid fa-right-from-bracket`}></i>
                  <span className='flex-1 ms-3 whitespace-nowrap'>Logout</span>
                </a>
              </li>
            </ul>
          </div>
        </aside>
        <div
          id='logout-modal'
          tabIndex={-1}
          className='hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full'>
          <div className='relative p-4 w-full max-w-md max-h-full'>
            <div className='relative text-primary bg-secondary rounded-lg shadow'>
              <button
                type='button'
                className='absolute top-3 end-2.5 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-700 dark:hover:text-white'
                data-modal-hide='logout-modal'>
                <i className='fa-solid fa-xmark'></i>
                <span className='sr-only'>Close modal</span>
              </button>
              <div className='p-4 md:p-5 text-center'>
                <svg className='mx-auto mb-4 w-12 h-12' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'>
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                  />
                </svg>
                <h3 className='mb-5 text-lg font-normal'>Are you sure you want to Logout?</h3>
                <button
                  onClick={logoutUser}
                  data-modal-hide='logout-modal'
                  type='button'
                  className='bg-primary text-white hover:bg-gray-700 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2'>
                  Yes, I&apos;m sure
                </button>
                <button
                  data-modal-hide='logout-modal'
                  type='button'
                  className='bg-accent text-black hover:bg-neutral rounded-lg font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10'>
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default SideBar;
