'use client';
import { Chat } from '@/helpers/props';
import useAxios from '@/hooks/useAxios';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface ChatsPaneContextType {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fetchChats: () => Promise<void>;
  searchChats: (e: any) => Promise<void>;
  updateChatOrder: (chatId: number, lastMessage: string) => void;
}

const ChatsPaneContext = createContext<ChatsPaneContextType | undefined>(undefined);

export function ChatsPaneProvider({ children }: { children: ReactNode }) {
  const api = useAxios();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchChats = async () => {
    try {
      const response = await api.get('/api/chats/');
      setChats(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setIsLoading(false);
    }
  };

  const searchChats = async (e: any) => {
    e.preventDefault();
    try {
      const response = await api.get(`/api/chats/?search=${searchQuery}`);
      setChats(response.data);
    } catch (error) {
      console.error('Error searching chats:', error);
    }
  };

  const updateChatOrder = useCallback((chatId: number, lastMessage: string) => {
    setChats((prevChats) => {
      const updatedChats = [...prevChats];
      const chatIndex = updatedChats.findIndex((chat) => chat.id === chatId);

      if (chatIndex !== -1) {
        const chat = { ...updatedChats[chatIndex], last_message_content: lastMessage };
        updatedChats.splice(chatIndex, 1);
        updatedChats.unshift(chat);
      }

      return updatedChats;
    });
  }, []);

  const value = {
    chats,
    setChats,
    isLoading,
    searchQuery,
    setSearchQuery,
    fetchChats,
    searchChats,
    updateChatOrder,
  };

  return <ChatsPaneContext.Provider value={value}>{children}</ChatsPaneContext.Provider>;
}

export function useChatsPaneContext() {
  const context = useContext(ChatsPaneContext);
  if (context === undefined) {
    throw new Error('useChatsPaneContext must be used within a ChatsPaneProvider');
  }
  return context;
}
