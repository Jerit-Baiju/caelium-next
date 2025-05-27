'use client';
import { Chat } from '@/helpers/props';
import useAxios from '@/hooks/useAxios';
import useChatUtils from '@/hooks/useChat';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { useAppContext } from './AppContext';
import AuthContext from './AuthContext';

interface ChatsPaneContextType {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchChats: (e: React.FormEvent) => Promise<void>;
  updateChatOrder: (chatId: number, lastMessage: string) => void;
  clearChat: (chatId: number) => Promise<void>;
  togglePinChat: (chatId: number) => Promise<void>;
  removeChatFromPane: (chatId: number) => void;
}

const ChatsPaneContext = createContext<ChatsPaneContextType | undefined>(undefined);

export function ChatsPaneProvider({ children }: { children: ReactNode }) {
  const api = useAxios();
  const { user } = useContext(AuthContext);
  const { sortChats } = useChatUtils();
  const [searchQuery, setSearchQuery] = useState('');
  const { chats: appChats, setChats: setAppChats, isLoading: appLoading } = useAppContext();

  const clearChat = useCallback(
    async (chatId: number) => {
      try {
        await api.delete(`/api/chats/${chatId}/messages`);
        setAppChats((prevChats) => prevChats.map((chat) => (chat.id === chatId ? { ...chat, messages: [] } : chat)));
      } catch (err) {
        console.log({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to clear chat',
        });
      }
    },
    [api, setAppChats],
  );

  const togglePinChat = useCallback(
    async (chatId: number) => {
      try {
        const chatToUpdate = appChats.find((chat) => chat.id === chatId);
        if (!chatToUpdate) return;

        if (!chatToUpdate.is_pinned && appChats.filter((chat) => chat.is_pinned).length >= 5) {
          console.log({
            variant: 'destructive',
            title: 'Pin limit reached',
            description: 'You can only pin up to 5 chats. Please unpin a chat before pinning a new one.',
          });
          return;
        }

        // Update state with proper typing
        setAppChats((prevChats: Chat[]) => {
          const updatedChats = prevChats.map((chat) => (chat.id === chatId ? { ...chat, is_pinned: !chat.is_pinned } : chat));
          return sortChats(updatedChats);
        });

        await api.patch(`/api/chats/${chatId}/pin/`, {
          isPinned: !chatToUpdate.is_pinned,
        });
      } catch (err) {
        // Revert changes with proper typing
        setAppChats((prevChats: Chat[]) => {
          const currentChat = prevChats.find((chat) => chat.id === chatId);
          if (!currentChat) return prevChats;

          const updatedChats = prevChats.map((chat) => (chat.id === chatId ? { ...chat, is_pinned: !chat.is_pinned } : chat));
          return sortChats(updatedChats);
        });

        console.log({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to pin/unpin chat. Please try again.',
        });
      }
    },
    [appChats, api, setAppChats],
  );

  const searchChats = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.get(`/api/chats/?search=${searchQuery}`);
      setAppChats(response.data);
    } catch (error) {
      console.error('Error searching chats:', error);
    }
  };

  // Add this helper to remove a chat from the pane
  const removeChatFromPane = (chatId: number) => {
    setAppChats((prevChats: Chat[]) => prevChats.filter((chat) => chat.id !== chatId));
  };

  // Enhance updateChatOrder to add chat if missing, but prevent duplicates
  const updateChatOrder = async (chatId: number, lastMessage: string) => {
    setAppChats((prevChats: Chat[]) => {
      const chatIndex = prevChats.findIndex((chat) => chat.id === Number(chatId));
      if (chatIndex === -1) {
        // Chat not found, fetch and add it if not already present
        (async () => {
          try {
            const response = await api.get(`/api/chats/${chatId}/`);
            const chat = response.data;
            chat.last_message = {
              content: lastMessage,
              timestamp: new Date(),
              sender: chat.participants?.find((p: any) => p.id !== user?.id),
              type: 'txt',
            };
            chat.updated_time = new Date();
            setAppChats((prev) => {
              // Prevent duplicate ids
              if (prev.some((c) => c.id === chat.id)) return sortChats(prev);
              return sortChats([...prev, chat]);
            });
          } catch (err) {
            // ignore
          }
        })();
        return prevChats;
      }
      const updatedChats = [...prevChats];
      const chatToUpdate = { ...updatedChats[chatIndex] };
      const otherParticipant = chatToUpdate.participants?.find(p => p.id !== user?.id);
      if (otherParticipant) {
        chatToUpdate.last_message = {
          content: lastMessage,
          timestamp: new Date(),
          sender: otherParticipant,
          type: 'txt',
        };
        chatToUpdate.updated_time = new Date();
        updatedChats.splice(chatIndex, 1);
        updatedChats.push(chatToUpdate);
      }
      return sortChats(updatedChats);
    });
  };

  const value = {
    chats: appChats,
    setChats: setAppChats,
    isLoading: appLoading,
    searchQuery,
    setSearchQuery,
    searchChats,
    updateChatOrder,
    clearChat,
    togglePinChat,
    removeChatFromPane, // add to context
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
