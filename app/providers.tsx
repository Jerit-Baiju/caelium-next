'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { NavbarProvider } from '@/contexts/NavContext';
import { WebSocketProvider } from '@/contexts/SocketContext';
import { ReactNode } from 'react';

const ProvidersWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <NavbarProvider>{children}</NavbarProvider>
      </WebSocketProvider>
    </AuthProvider>
  );
};

export default ProvidersWrapper;
