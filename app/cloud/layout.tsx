'use client';

import { useNavbar } from '@/contexts/NavContext';
import { useEffect } from 'react';

export default function CloudLayout({ children }: { children: React.ReactNode }) {
  const { setCloudNav, resetToDefaultNav, setCloudSidebar, resetToDefaultSidebar } = useNavbar();

  useEffect(() => {
    // Set cloud navigation and sidebar when the layout mounts
    setCloudNav();
    setCloudSidebar();

    // Reset to default navigation and sidebar when the layout unmounts
    return () => {
      resetToDefaultNav();
      resetToDefaultSidebar();
    };
  }, [setCloudNav, resetToDefaultNav, setCloudSidebar, resetToDefaultSidebar]);

  return <main className='flex grow md:p-6 md:gap-6 md:h-[calc(100vh-5rem)] justify-center overflow-auto'>{children}</main>;
}
