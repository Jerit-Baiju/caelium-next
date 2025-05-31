'use client';
import AuthContext from '@/contexts/AuthContext';
import { useNavbar } from '@/contexts/NavContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { IconType } from 'react-icons';
import { FiCloud, FiHome, FiLogOut, FiMessageCircle, FiPlus, FiUser } from 'react-icons/fi';

// Define interfaces to match those in NavContext
interface SidebarOption {
  name: string;
  url: string;
  icon: IconType;
}

interface SidebarSection {
  section: string;
  items: SidebarOption[];
}

// Default fallback options if context isn't available
export const options: SidebarOption[] = [
  { name: 'Home', url: '/', icon: FiHome },
  { name: 'Chats', url: '/chats/main', icon: FiMessageCircle },
  { name: 'Create', url: '/create', icon: FiPlus },
  { name: 'Cloud', url: '/cloud', icon: FiCloud },
  { name: 'Profile', url: '/accounts/profile', icon: FiUser },
];

const SideBar = () => {
  const route = usePathname();
  const { logoutUser, user } = useContext(AuthContext);
  const { sidebarOptions } = useNavbar();

  // Type guard function to check if we have sections or simple options
  const hasSections = (options: SidebarOption[] | SidebarSection[]): options is SidebarSection[] => {
    return options.length > 0 && 'section' in options[0] && 'items' in options[0];
  };

  // Determine which options to use based on the route
  const isCloudRoute = route?.startsWith('/cloud');
  const navigationOptions = isCloudRoute ? sidebarOptions : options;

  return (
    <>
      <motion.aside
        initial={{ x: -15, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className='fixed top-20 left-0 z-40 w-72 h-screen hidden lg:block transition-transform 
          translate-x-0'
        aria-label='Sidebar'>
        <div className='h-full flex flex-col px-4 py-8 overflow-y-auto scrollbar-hide'>
          {/* User Profile Section */}
          <div className='mb-8'>
            <motion.div className='p-4 rounded-2xl bg-linear-to-br from-violet-500/10 to-purple-500/10' whileHover={{ scale: 1.02 }}>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 rounded-xl overflow-hidden bg-linear-to-br from-violet-500 to-purple-500 p-0.5'>
                  <img src={user?.avatar} alt='Profile' className='w-full h-full object-cover rounded-[10px]' />
                </div>
                <div>
                  <h3 className='font-medium dark:text-white'>{user?.name}</h3>
                  <p className='text-sm text-neutral-500 dark:text-neutral-400'>@{user?.username}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className='flex-1 space-y-6'>
            {isCloudRoute && hasSections(navigationOptions) ? (
              // Render sectioned sidebar for cloud pages
              (navigationOptions as SidebarSection[]).map((section, sectionIndex) => (
                <div key={sectionIndex} className='space-y-2'>
                  <div className='mb-2 text-sm font-medium text-neutral-500 dark:text-neutral-400 px-4'>{section.section}</div>
                  {section.items.map((option, id) => (
                    <motion.div key={id} whileHover={{ scale: 1.02 }} className='mb-1'>
                      <Link
                        href={option.url}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                          ${
                            // For /cloud/photos, only highlight exact match
                            (option.url === '/cloud/photos' && route === '/cloud/photos') ||
                            // For other paths, highlight if it's an exact match or starts with the URL (but not /cloud/photos special case)
                            (option.url !== '/cloud/photos' &&
                              (route === option.url || (route?.startsWith(option.url + '/') && option.url !== '/cloud')))
                              ? 'bg-linear-to-br from-violet-500 to-purple-500 text-white'
                              : 'hover:bg-white/10 dark:text-white dark:hover:bg-neutral-800'
                          }`}>
                        <option.icon className='w-5 h-5' />
                        <span>{option.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ))
            ) : (
              // Render standard sidebar for other pages
              <>
                <div className='mb-2 text-sm font-medium text-neutral-500 dark:text-neutral-400 px-4'>MENU</div>
                {(navigationOptions as SidebarOption[]).map((option, id) => (
                  <motion.div key={id} whileHover={{ scale: 1.02 }} className='mb-1'>
                    <Link
                      href={option.url}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                        ${
                          // For cloud routes, only highlight if exact match to prevent multiple items highlighting
                          (option.url.includes('/cloud') && route === option.url) ||
                          // For non-cloud routes, use the original logic
                          (!option.url.includes('/cloud') && (route === option.url || route?.startsWith(option.url + '/')))
                            ? 'bg-linear-to-br from-violet-500 to-purple-500 text-white'
                            : 'hover:bg-white/10 dark:text-white dark:hover:bg-neutral-800'
                        }`}>
                      <option.icon className='w-5 h-5' />
                      <span>{option.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </>
            )}
          </nav>

          {/* Storage progress - show only in cloud section */}
          {isCloudRoute && (
            <div className='mb-6 space-y-3 bg-white dark:bg-neutral-800/50 p-4 rounded-xl'>
              <div className='flex justify-between items-center text-sm text-neutral-600 dark:text-neutral-400'>
                <span>Storage</span>
                <span>35% used</span>
              </div>
              <div className='w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden'>
                <div className='h-full bg-violet-500 rounded-full' style={{ width: '35%' }}></div>
              </div>
              <p className='text-xs text-neutral-500 dark:text-neutral-400'>3.5 GB of 10 GB</p>
              <Link href='/cloud/upgrade'>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className='w-full text-center text-xs font-medium bg-linear-to-br from-violet-500 to-purple-500 text-white py-2 rounded-lg'>
                  Upgrade Storage
                </motion.button>
              </Link>
            </div>
          )}

          {/* Logout Section */}
          <div className='pt-4 mb-16 border-t border-neutral-200 dark:border-neutral-700'>
            <motion.button
              whileHover={{ scale: 1.02 }}
              data-modal-target='logout-modal'
              data-modal-toggle='logout-modal'
              className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all'>
              <FiLogOut className='w-5 h-5' />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Logout Modal */}
      <motion.div
        id='logout-modal'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        tabIndex={-1}
        className='hidden fixed inset-0 z-50 items-center justify-center bg-black/50'>
        <div className='relative p-4 w-full max-w-md'>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className='relative rounded-2xl bg-white dark:bg-neutral-800 shadow-lg p-8'>
            <div className='text-center space-y-4'>
              <div className='h-20 w-20 rounded-full bg-red-500/10 text-red-500 mx-auto flex items-center justify-center'>
                <FiLogOut className='w-10 h-10' />
              </div>
              <h3 className='text-xl font-semibold dark:text-white'>Confirm Logout</h3>
              <p className='text-neutral-500 dark:text-neutral-400'>Are you sure you want to logout from your account?</p>
              <div className='flex justify-center gap-3 pt-4'>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={logoutUser}
                  data-modal-hide='logout-modal'
                  className='bg-linear-to-br from-violet-500 to-purple-500 text-white font-medium rounded-xl px-6 py-2.5'>
                  Yes, logout
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  data-modal-hide='logout-modal'
                  className='bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-xl font-medium px-6 py-2.5'>
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default SideBar;
