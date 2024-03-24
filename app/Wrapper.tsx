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
    <main className={navSM ? 'max-sm:h-[calc(100dvh-5rem)]' : 'max-h-screen'}>
      <SideBar />
      <div className={navSM ? '' : 'max-sm:hidden'}>
        <NavBar />
      </div>
      <div className={`sm:ml-64 flex flex-col flex-grow ${navSM ? 'max-sm:mt-20' : ''}`}>
        <div className={`flex flex-grow ${navSM?'max-sm:mb-16': ''}`}>{children}</div>
      </div>
      <div className={navSM ? '' : 'max-sm:hidden'}>
        <BottomNav />
      </div>
    </main>
  );
};

export default Wrapper;
