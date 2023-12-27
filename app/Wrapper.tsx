'use client';
import NavBar from '@/components/NavBar';
import SideBar from '@/components/SideBar';
import { initFlowbite } from 'flowbite';
import { ReactNode, useEffect } from 'react';

interface WrapperProps {
  children: ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  useEffect(() => {
    initFlowbite();
  }, []);
  return (
    <main className='min-h-screen flex flex-col'>
      <NavBar />
      <SideBar />
      <div className='sm:ml-64 pt-20 flex flex-col flex-grow'>
        <div className='flex flex-grow'>{children}</div>
      </div>
    </main>
  );
};

export default Wrapper;
