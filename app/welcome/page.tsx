'use client'
import AuthContext from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

const page = () => {
  const router = useRouter();
  let { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      router.replace('/')
    }
  }, []);
  return (
    <div className='flex flex-col items-center justify-center h-screen dark:text-white'>
      <h1 className='text-center text-6xl font-bold mb-4'>Welcome to Caelium</h1>
      <p className='text-xl text-center mb-8'>Your Family&apos;s Digital Hub for Memories and Connections</p>
      <Link href='/accounts/login' className='bg-white text-gray-800 px-6 py-3 rounded-full font-bold hover:bg-blue-100'>
        Get Started
      </Link>
    </div>
  );
};
export default page;
