import Link from 'next/link';
import { options } from './SideBar';

const BottomNav = () => {
  return (
    <div className='fixed sm:hidden bottom-0 left-0 z-50 w-full h-16 border-t bg-black'>
      <div className='grid h-full max-w-lg grid-cols-5 mx-auto font-medium'>
        {options.map((option, id) => (
          <Link href={option.url} key={id} className='inline-flex text-xl flex-col items-center justify-center px-5 group'>
            <i className={`fa-solid fa-${option.icon} text-white`}></i>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
