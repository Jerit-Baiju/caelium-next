'use client';
import { Chat, LastSeen } from '@/helpers/props';
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
  activeUsers: number[];
  addActiveUser: (id: number) => void;
  removeActiveUser: (id: number) => void;
  setActiveUsers: (ids: number[]) => void;
  lastSeenUsers: LastSeen[];
  updateLastSeen: (userId: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const api = useAxios();
  const { user } = useContext(AuthContext);
  const {sortChats} = useChatUtils()
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [activeUsers, setActiveUsers] = useState<number[]>([]);
  const [lastSeenUsers, setLastSeenUsers] = useState<LastSeen[]>([]);

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

  const addActiveUser = (id: number) => {
    setActiveUsers(prev => [...prev, id]);
  };

  const removeActiveUser = (id: number) => {
    setActiveUsers(prev => prev.filter(user => user !== id));
  };

  const updateLastSeen = (userId: number) => {
    setLastSeenUsers(prev => {
      const filtered = prev.filter(user => user.userId !== userId);
      return [...filtered, { userId, timestamp: new Date() }];
    });
  };

  useEffect(() => {
    if (!user || lastFetched) return;
    refreshChats();
  }, [user, lastFetched]);

  const value = {
    chats,
    setChats,
    isLoading,
    setIsLoading,
    lastFetched,
    refreshChats,
    activeUsers,
    addActiveUser,
    removeActiveUser,
    setActiveUsers,
    lastSeenUsers,
    updateLastSeen,
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
