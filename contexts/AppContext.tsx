'use client';
import { Chat } from '@/helpers/props';
import useAxios from '@/hooks/useAxios';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import AuthContext from './AuthContext';

interface AppContextType {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const api = useAxios();
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const fetchChats = async () => {
      if (!user) return;

      try {
        const { data } = await api.get('/api/chats/');
        if (!mounted) return;
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchChats();
    return () => {
      mounted = false;
    };
  }, [user]);

  const value = {
    chats,
    setChats,
    isLoading,
    setIsLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
