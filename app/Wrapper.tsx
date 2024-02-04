'use client';
import BottomNav from '@/components/BottomNav';
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
    <main className='flex flex-col h-screen'>
      <SideBar />
      <NavBar />
      <div className={`sm:ml-64 flex flex-col flex-grow max-sm:mt-20`}>
        <div className='flex flex-grow'>{children}</div>
      </div>
      <BottomNav />
    </main>
  );
};

export default Wrapper;
