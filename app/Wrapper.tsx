'use client';
import BottomNav from '@/components/BottomNav';
import NavBar from '@/components/NavBar';
import SideBar from '@/components/SideBar';
import { initFlowbite } from 'flowbite';
import { ReactNode, useEffect } from 'react';
import { NavProvider } from '@/contexts/NavContext';
import NavContext from '@/contexts/NavContext';

interface WrapperProps {
  children: ReactNode;
  navSM?: boolean;
}

const Wrapper = ({ children, navSM = true }: WrapperProps) => {
  useEffect(() => {
    initFlowbite();
  }, []);
  return (
    <main>
      <SideBar />
      <div className={navSM ? '' : 'max-sm:hidden'}>
        <NavProvider>
          <NavBar />
        </NavProvider>
      </div>
      <div className={`md:ml-64 flex flex-col flex-grow ${navSM ? 'mt-20' : 'sm:mt-20 max-sm:h-screen'}`}>{children}</div>
      <div className={navSM ? 'max-sm:mt-16' : 'max-sm:hidden'}>
        <BottomNav />
      </div>
    </main>
  );
};

export default Wrapper;
