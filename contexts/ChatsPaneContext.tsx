'use client';
import { Chat } from '@/helpers/props';
import useAxios from '@/hooks/useAxios';
import { createContext, ReactNode, useContext, useState } from 'react';
import AuthContext from './AuthContext';

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
  const { user } = useContext(AuthContext);
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

  const updateChatOrder = (chatId: number, lastMessage: string) => {
    console.log('Updating chat order:', chatId, lastMessage);
    const chatIdNum = Number(chatId);
    const chatIndex = chats.findIndex((chat) => chat.id === chatIdNum);
    console.log('Found chat at index:', chatIndex);

    if (chatIndex !== -1) {
      const updatedChats = [...chats];
      const chatToUpdate = { ...updatedChats[chatIndex] };

      if (!chatToUpdate.last_message) {
        chatToUpdate.last_message = {
          content: '',
          timestamp: new Date(),
          sender: user,
          type: 'text',
        };
      }

      chatToUpdate.last_message.content = lastMessage;
      chatToUpdate.updated_time = new Date();
      updatedChats[chatIndex] = chatToUpdate;
      // Move to top
      const [movedChat] = updatedChats.splice(chatIndex, 1);
      updatedChats.unshift(movedChat);
      setChats(updatedChats);
    } else {
      console.warn('Chat not found:', chatId, 'Type:', typeof chatId);
    }
  };

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
