'use client';
import AuthContext from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';

interface NavBarProps {
  navSM?: boolean;
}
interface Option {
  name: string;
  url: string;
}

const options: Option[] = [
  { name: 'Dashboard', url: '/dashboard' },
  { name: 'Settings', url: '/dash' },
];


const NavBar: React.FC<NavBarProps> = ({ navSM = true }) => {
  const route = usePathname();
  let { user } = useContext(AuthContext);
  if (!['/accounts/login', '/accounts/register'].includes(route)) {
    return (
      <nav
        className={`fixed ${
          !navSM ? 'max-sm:hidden' : null
        } top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700`}>
        <div className='px-3 py-3 lg:px-5 lg:pl-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center justify-start rtl:justify-end'>
              <button
                data-drawer-target='logo-sidebar'
                data-drawer-toggle='logo-sidebar'
                aria-controls='logo-sidebar'
                type='button'
                className='inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'>
                <span className='sr-only'>Open sidebar</span>
                <span className='material-symbols-outlined'>menu</span>
              </button>
              <Link href='/' className='flex md:me-24'>
                <Image className='p-0 m-0 pointer-events-none' src={'/logos/written.png'} alt='caelium' width={150} height={0} />
              </Link>
            </div>
            <div className='flex items-center'>
              <div className='flex items-center ms-3'>
                <div>
                  <button
                    type='button'
                    className='flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600'
                    aria-expanded='false'
                    data-dropdown-toggle='dropdown-user'>
                    <span className='sr-only'>Open user menu</span>
                    <Image className='h-12 w-12 rounded-full' src={user?.avatar} alt='user photo' width={100} height={100} />
                  </button>
                </div>
                <div
                  className='z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600'
                  id='dropdown-user'>
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
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
};
export default NavBar;
