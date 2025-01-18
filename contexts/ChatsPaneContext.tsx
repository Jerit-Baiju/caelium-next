'use client';
import { Chat } from '@/helpers/props';
import { toast } from '@/hooks/use-toast';
import useAxios from '@/hooks/useAxios';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
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
}

const ChatsPaneContext = createContext<ChatsPaneContextType | undefined>(undefined);

const sortChats = (chats: Chat[]): Chat[] => {
  return [...chats].sort((a: Chat, b: Chat) => {
    if (a.is_pinned !== b.is_pinned) return b.is_pinned ? 1 : -1;
    return new Date(b.updated_time).getTime() - new Date(a.updated_time).getTime();
  });
};

export function ChatsPaneProvider({ children }: { children: ReactNode }) {
  const api = useAxios();
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch chats only once on mount when user is available
  useEffect(() => {
    let mounted = true;

    const fetchChats = async () => {
      if (!user) return;

      try {
        const { data } = await api.get('/api/chats/');
        if (!mounted) return;

        setChats(sortChats(data)); // Use sortChats here instead of inline sort
      } catch (error) {
        console.error('Error fetching chats:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch chats');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchChats();
    return () => {
      mounted = false;
    };
  }, [user]);

  const clearChat = useCallback(async (chatId: number) => {
    try {
      setIsLoading(true);
      await api.delete(`/api/chats/${chatId}/messages`);
      setChats((prevChats) => prevChats.map((chat) => (chat.id === chatId ? { ...chat, messages: [] } : chat)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear chat');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const togglePinChat = useCallback(
    async (chatId: number) => {
      try {
        setIsLoading(true);
        const chatToUpdate = chats.find((chat) => chat.id === chatId);
        if (!chatToUpdate) return;

        // If trying to pin and already have 5 pinned chats
        if (!chatToUpdate.is_pinned && chats.filter((chat) => chat.is_pinned).length >= 5) {
          toast({
            variant: 'destructive',
            title: 'Pin limit reached',
            description: 'You can only pin up to 5 chats. Please unpin a chat before pinning a new one.',
          });
          return;
        }

        const { data } = await api.patch(`/api/chats/${chatId}/pin/`, {
          isPinned: !chatToUpdate.is_pinned,
        });

        setChats((prevChats) => {
          const updatedChats = prevChats.map((chat) => (chat.id === chatId ? { ...chat, is_pinned: data.isPinned } : chat));
          return sortChats(updatedChats);
        });
      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to pin/unpin chat. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [chats],
  );

  const searchChats = async (e: React.FormEvent) => {
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
      // Sort considering pinned status
      updatedChats.splice(chatIndex, 1);
      const pinnedChats = updatedChats.filter((chat) => chat.is_pinned);
      const unpinnedChats = updatedChats.filter((chat) => !chat.is_pinned);

      if (chatToUpdate.is_pinned) {
        pinnedChats.unshift(chatToUpdate);
      } else {
        unpinnedChats.unshift(chatToUpdate);
      }

      setChats([...pinnedChats, ...unpinnedChats]);
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
    searchChats,
    updateChatOrder,
    clearChat,
    togglePinChat,
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
