'use client';
import Link from 'next/link';

const Page = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen dark:text-white'>
      <h1 className='text-center text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400'>
        Welcome to Caelium
      </h1>
      <p className='text-xl text-center mb-8'>Unveil Your World, Connect Your Dreams - Where Privacy Meets Possibility.</p>
      <Link href='/accounts/login' className='bg-white text-neutral-800 px-6 py-3 rounded-full font-bold hover:bg-blue-100'>
        Get Started <i className='fa-solid fa-arrow-right ps-1'></i>
      </Link>
    </div>
  );
};
export default Page;
