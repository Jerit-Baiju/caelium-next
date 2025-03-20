'use client';

import { useNavbar } from '@/contexts/NavContext';
import { useEffect } from 'react';

export default function CloudLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return (
    <section className="cloud-container">
      <div className="cloud-content">
        {children}
      </div>
    </section>
  );
}
