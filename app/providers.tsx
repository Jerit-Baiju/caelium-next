'use client';

import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChatsPaneProvider } from '@/contexts/ChatsPaneContext';
import { NavbarProvider } from '@/contexts/NavContext';
import { WebSocketProvider } from '@/contexts/SocketContext';
import { ReactNode } from 'react';

const ProvidersWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <AppProvider>
        <ChatsPaneProvider>
          <WebSocketProvider>
            <NavbarProvider>{children}</NavbarProvider>
          </WebSocketProvider>
        </ChatsPaneProvider>
      </AppProvider>
    </AuthProvider>
  );
};

export default ProvidersWrapper;
