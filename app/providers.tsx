'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { NavbarProvider } from '@/contexts/NavContext';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

const ProvidersWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <SessionProvider>
        <AuthProvider>
          <NavbarProvider>{children}</NavbarProvider>
        </AuthProvider>
      </SessionProvider>
    </main>
  );
};

export default ProvidersWrapper;
