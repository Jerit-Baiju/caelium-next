'use client';
import AuthContext from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';

interface Option {
  name: string;
  url: string;
}

const options: Option[] = [
  { name: 'Dashboard', url: '/dashboard' },
  { name: 'Settings', url: '/dash' },
];

const NavBar = () => {
  const route = usePathname();
  let { user } = useContext(AuthContext);
  if (!['/accounts/login', '/accounts/register'].includes(route)) {
    return (
      <nav className={`fixed sm:hidden top-0 z-50 w-full border-b bg-black`}>
        <div className='px-3 py-3 lg:px-5 lg:pl-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center justify-start rtl:justify-end'>
              <Link href='/' className='flex md:me-24'>
                <Image className='p-0 m-0 pointer-events-none' src={'/logos/written.png'} alt='caelium' width={150} height={0} />
              </Link>
            </div>
            <div className='flex items-center'>
              <div className='flex items-center ms-3'>
                <div>
                  <button
                    type='button'
                    className='flex text-sm bg-neutral-800 rounded-full focus:ring-4 focus:ring-neutral-300 dark:focus:ring-neutral-600'
                    aria-expanded='false'
                    data-dropdown-toggle='dropdown-user'>
                    <span className='sr-only'>Open user menu</span>
                    <img className='h-14 w-14 max-sm:h-12 max-sm:w-12 rounded-full' src={user?.avatar} alt='user photo' width={100} height={100} />
                  </button>
                </div>
                <div
                  className='z-50 hidden my-4 text-base list-none bg-white divide-y divide-neutral-100 rounded shadow dark:bg-neutral-700 dark:divide-neutral-600'
                  id='dropdown-user'>
                  <div className='px-4 py-3' role='none'>
                    <p className='text-sm text-neutral-900 dark:text-white' role='none'>
                      {user?.name}
                    </p>
                  </div>
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
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
};
export default NavBar;
