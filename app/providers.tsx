'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { NavbarProvider } from '@/contexts/NavContext';
import { WebSocketProvider } from '@/contexts/SocketContext';
import { ReactNode } from 'react';

const ProvidersWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <AuthProvider>
        <WebSocketProvider>
          <NavbarProvider>{children}</NavbarProvider>
        </WebSocketProvider>
      </AuthProvider>
    </main>
  );
};

export default ProvidersWrapper;
