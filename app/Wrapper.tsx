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
    <main className='min-h-screen'>
      <NavBar />
      <SideBar />
      <div className='p-4 sm:ml-64 pt-20'>
        <div className='p-4'>{children}</div>
      </div>
    </main>
  );
};

export default Wrapper;
