'use client';
import { Chat } from '@/helpers/props';
import useAxios from '@/hooks/useAxios';
import useChatUtils from '@/hooks/useChat';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import AuthContext from './AuthContext';

interface AppContextType {
  chats: Chat[];
  setChats: (chats: Chat[] | ((prevChats: Chat[]) => Chat[])) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  lastFetched: Date | null;
  refreshChats: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const api = useAxios();
  const { user } = useContext(AuthContext);
  const {sortChats} = useChatUtils()
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const refreshChats = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data } = await api.get('/api/chats/');
      setChats(sortChats(data));
      setLastFetched(new Date());
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user || lastFetched) return;
    refreshChats();
  }, [user, lastFetched, refreshChats]);

  const value = {
    chats,
    setChats,
    isLoading,
    setIsLoading,
    lastFetched,
    refreshChats,
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
