'use client';
import BottomNav from '@/components/BottomNav';
import NavBar from '@/components/NavBar';
import SideBar from '@/components/SideBar';
import { initFlowbite } from 'flowbite';
import { ReactNode, useEffect } from 'react';

interface WrapperProps {
  children: ReactNode;
  navSM?: boolean;
}

const Wrapper = ({ children, navSM = true }: WrapperProps) => {
  useEffect(() => {
    initFlowbite();
  }, []);
  return (
    <main className='h-screen'>
      <SideBar />
      <div className={navSM ? '' : 'max-sm:hidden'}>
        <NavBar />
      </div>
      <div className={`sm:ml-64 h-[calc(100vh-9rem)] flex flex-col flex-grow ${navSM?'max-sm:mt-20':''}`}>
        <div className='flex flex-grow'>{children}</div>
      </div>
      <div className={navSM ? '' : 'max-sm:hidden'}>
        <BottomNav />
      </div>
    </main>
  );
};

export default Wrapper;
