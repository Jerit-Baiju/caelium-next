import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { options } from './SideBar';

const BottomNav = () => {
  const pathname = usePathname();
  return (
    <div className='fixed lg:hidden bottom-0 left-0 z-50 w-full h-16 border-t bg-neutral-100 dark:bg-neutral-900'>
      <div className='grid h-full max-w-lg grid-cols-5 mx-auto font-medium'>
        {options.map((option, id) => {
          const isActive = pathname === option.url;
          return (
            <Link href={option.url} key={id} className='relative inline-flex flex-col items-center justify-center px-5 group'>
              <motion.div
                className={`p-2 rounded-lg ${isActive ? 'bg-neutral-200 dark:bg-neutral-800' : ''}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <option.icon
                  className={`w-6 h-6 ${isActive ? 'text-violet-500 dark:text-purple-400' : 'text-neutral-600 dark:text-neutral-400'}`}
                />
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
