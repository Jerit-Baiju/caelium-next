'use client';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

interface Option {
  name: string;
  url: string;
  icon: string;
}

export const options: Option[] = [
  { name: 'Home', url: '/', icon: 'house' },
  { name: 'Gallery', url: '/gallery', icon: 'mountain-sun' },
  { name: 'Chats', url: '/chats', icon: 'message' },
  { name: 'Crafts', url: '/crafts', icon: 'feather' },
  { name: 'Profile', url: '/accounts/profile', icon: 'user' },
];

const SideBar = () => {

    return (
      <>
        <aside
          id='logo-sidebar'
          className='fixed top-20 left-0 z-40 w-64 border-r border-gray-200 dark:border-gray-600 h-screen max-sm:hidden transition-transform -translate-x-full sm:translate-x-0 '
          aria-label='Sidebar'
        >
          <div className='h-full flex flex-col justify-start pt-20 w-full px-3 pb-4 overflow-y-auto'>
            {/* <Link href='/' className='flex flex-col items-center justify-center'>
              <Image className='mt-2 pointer-events-none' src={'/logos/written.png'} alt='caelium' width={200} height={0} />
            </Link> */}
            <ul className='space-y-2 font-medium pt-3'>
              {options.map((option: Option, id) => (
                <li key={id}>
                  <Link
                    href={option.url}
                    className='flex items-center text-lg p-2 rounded-lg dark:text-white hover:dark:bg-neutral-900'
                  >
                    <i className={`fa-solid fa-${option.icon} m-1`}></i>
                    <span className='flex-1 ms-3 whitespace-nowrap'>{option.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <a
                  data-modal-target='logout-modal'
                  data-modal-toggle='logout-modal'
                  className='flex items-center p-2 text-lg rounded-lg dark:text-white hover:dark:bg-neutral-900'
                  type='button'
                >
                  <i className={`fa-solid fa-right-from-bracket m-1`}></i>
                  <span className='flex-1 ms-3 whitespace-nowrap'>Logout</span>
                </a>
              </li>
            </ul>
          </div>
        </aside>
        <div
          id='logout-modal'
          tabIndex={-1}
          className='hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full'
        >
          <div className='relative p-4 w-full max-w-md max-h-full'>
            <div className='relative dark:bg-neutral-700 bg-neutral-300 rounded-lg shadow'>
              <button
                type='button'
                className='absolute top-3 end-2.5 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-neutral-300'
                data-modal-hide='logout-modal'
              >
                <i className='fa-solid fa-xmark'></i>
                <span className='sr-only'>Close modal</span>
              </button>
              <div className='p-4 md:p-5 text-center'>
                <i className='fa-solid fa-circle-exclamation fa-fade text-yellow-500 dark:text-yellow-300 text-6xl my-4'></i>
                <h3 className='mb-5 text-lg font-normal'>Are you sure you want to Logout?</h3>
                <button
                  onClick={()=>signOut()}
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

export default SideBar;
