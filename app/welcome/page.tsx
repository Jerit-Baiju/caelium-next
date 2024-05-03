'use client';
import { Vortex } from '@/components/ui/vortex';
import Link from 'next/link';

const Page = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen dark:text-white'>
      <Vortex
        backgroundColor='black'
        rangeY={800}
        particleCount={100}
        baseHue={120}
        className='flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full'
      >
        <h1 className='text-center text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400'>
          Welcome to Caelium
        </h1>
        <p className='text-xl text-center mb-8'>Unveil Your World, Connect Your Dreams - Where Privacy Meets Possibility.</p>
        <Link href='/accounts/login' className='bg-white text-neutral-800 px-6 py-3 rounded-full font-bold hover:bg-blue-100'>
          Get Started <i className='fa-solid fa-arrow-right ps-1'></i>
        </Link>
      </Vortex>
    </div>
  );
};
export default Page;
