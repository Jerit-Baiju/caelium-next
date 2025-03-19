'use client';

import { useNavbar } from '@/contexts/NavContext';
import { useEffect } from 'react';

export default function CloudLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setCloudNav, resetToDefaultNav } = useNavbar();

  useEffect(() => {
    // Set cloud navigation when the layout mounts
    setCloudNav();
    
    // Reset to default navigation when the layout unmounts
    return () => {
      resetToDefaultNav();
    };
  }, [setCloudNav, resetToDefaultNav]);

  return (
    <section className="cloud-container">
      <div className="cloud-content">
        {children}
      </div>
    </section>
  );
}
