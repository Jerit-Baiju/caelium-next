import { useNavbar } from '@/contexts/NavContext';
import Link from 'next/link';

const NavBar = () => {
  let { ctaButton, navLinks, dropDown } = useNavbar();
  return (
    <nav className='bg-neutral-100 dark:bg-neutral-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600'>
      <div className='max-w-screen-xl flex flex-wrap items-center h-20 justify-between mx-auto p-1'>
        <Link href='/' className='flex  p-0 m-0 items-center space-x-3 rtl:space-x-reverse'>
          <img
            className='p-0 m-0 pointer-events-none dark:invert'
            src={'/logos/written-dark.png'}
            alt='caelium'
            width={150}
            height={0}
          />
        </Link>
        <div className='flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse'>
          {ctaButton && (
            <Link
              href={ctaButton.url}
              type='button'
              className='flex items-center justify-center bg-blue-500 text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            >
              {ctaButton.name}
            </Link>
          )}
          <button
            data-collapse-toggle='navbar-sticky'
            type='button'
            className='inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
            aria-controls='navbar-sticky'
            aria-expanded='false'
          >
            <span className='sr-only'>Open main menu</span>
            <i className='fa-solid fa-bars text-xl'></i>
          </button>
        </div>
        <div className='items-center dark:bg-neutral-900 bg-neutral-100 max-sm:w-screen justify-center hidden w-full md:flex md:w-auto' id='navbar-sticky'>
          <ul className='flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0'>
            {navLinks?.map((button, index) => (
              <li key={index}>
                <Link
                  href={button.url}
                  className={`block py-2 px-3 rounded md:bg-transparent ${button.active ? 'md:text-blue-700 md:dark:text-blue-500' : null} md:p-0`}
                  aria-current='page'
                >
                  {button.name}
                </Link>
              </li>
            ))}
            {dropDown && (
              <li>
                <button
                  id='dropdownNavbarLink'
                  data-dropdown-toggle='dropdownNavbar'
                  className='flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded hover:bg-neutral-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-neutral-700 md:dark:hover:bg-transparent'
                >
                  {dropDown.name}
                  <i className='fa-solid fa-chevron-down px-1'></i>
                </button>
                <div
                  id='dropdownNavbar'
                  className='z-10 hidden font-normal bg-neutral-200 divide-y divide-gray-100 rounded-lg w-44 shadow-lg dark:bg-neutral-700 dark:divide-gray-600'
                >
                  <ul className='py-2 text-sm text-gray-700 dark:text-gray-200' aria-labelledby='dropdownLargeButton'>
                    {dropDown.options.map((option, index) => (
                      <li key={index}>
                        <a
                          href={option.url}
                          className='block px-4 py-2 hover:bg-neutral-300 dark:hover:bg-neutral-600 dark:hover:text-white'
                        >
                          {option.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
