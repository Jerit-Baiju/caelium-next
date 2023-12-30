'use client';
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
    <main className='flex flex-col h-screen'>
      <NavBar navSM={navSM} />
      <SideBar />
      <div className={`sm:ml-64 ${!navSM ? 'md:pt-20' : 'pt-20'} flex flex-col flex-grow`}>
        <div className='flex flex-grow'>{children}</div>
      </div>
    </main>
  );
};

export default Wrapper;
