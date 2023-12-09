import NavBar from '@/components/NavBar';
import Link from 'next/link';

const page = () => {
  return (
    <main>
      <NavBar/>
    <div className='flex flex-col items-center justify-center h-screen bg-blue-500 text-white'>
      <h1 className='text-4xl font-bold mb-4'>Welcome to Caelium</h1>
      <p className='text-lg text-center mb-8'>Your Family&apos;s Digital Hub for Memories and Connections</p>
      <Link href='/accounts/login' className='bg-white text-blue-500 px-6 py-3 rounded-full font-bold hover:bg-blue-100'>
        Get Started
      </Link>
    </div>
    </main>
  );
};

export default page;
