'use client';
import Wrapper from '@/app/Wrapper';
import SideBar from '@/components/chats/ChatPane';
import Header from '@/components/chats/Header';
import AuthContext from '@/contexts/AuthContext';
import { useContext } from 'react';

const page = ({ params }: { params: { slug: string } }) => {
  let { user } = useContext(AuthContext);
  return (
    <Wrapper navSM={false}>
      <div className='text-white flex flex-grow'>
        <SideBar chat />
        <div className='flex flex-grow flex-col'>
          <Header />
          <div>
            <div className='flex items-start gap-2.5 p-4'>
              <img className='w-8 h-8 rounded-full' src={user.avatar} alt={user.name} />
              <div className='flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700'>
                <div className='flex items-center space-x-2 rtl:space-x-reverse'>
                  <span className='text-sm font-semibold text-gray-900 dark:text-white'>Bonnie Green {params.slug}</span>
                  <span className='text-sm font-normal text-gray-500 dark:text-gray-400'>11:46</span>
                </div>
                <p className='text-sm font-normal py-2.5 text-gray-900 dark:text-white'>
                  That&apos;s awesome. I think our users will really appreciate the improvements.
                </p>
                <span className='text-sm font-normal text-gray-500 dark:text-gray-400'>Delivered</span>
              </div>
              <button
                id='dropdownMenuIconButton'
                data-dropdown-toggle='dropdownDots'
                data-dropdown-placement='bottom-start'
                className='inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600'
                type='button'>
                <span className='material-symbols-outlined text-gray-500 dark:text-gray-400'>more_vert</span>
              </button>
              <div
                id='dropdownDots'
                className='z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600'>
                <ul className='py-2 text-sm text-gray-700 dark:text-gray-200' aria-labelledby='dropdownMenuIconButton'>
                  <li>
                    <a href='#' className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
                      Reply
                    </a>
                  </li>
                  <li>
                    <a href='#' className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
                      Forward
                    </a>
                  </li>
                  <li>
                    <a href='#' className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
                      Copy
                    </a>
                  </li>
                  <li>
                    <a href='#' className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
                      Report
                    </a>
                  </li>
                  <li>
                    <a href='#' className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default page;
