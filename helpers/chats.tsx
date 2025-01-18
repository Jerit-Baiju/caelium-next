import useAxios from '@/hooks/useAxios';
import { User, Chat } from '@/helpers/props';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const useChatUtils = () => {
  const router = useRouter();
  const [newChats, setNewChats] = useState<User[]>([]);
  const api = useAxios();

  const createChat = async (recipient_id: number) => {
    try {
      const response = await api.post('/api/chats/', { 
        participant_ids: [recipient_id],
        is_group: false 
      });
      router.push(`/chats/${response.data.id}`);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const fetchNewChats = async () => {
    try {
      const response = await api.get('/api/chats/users/');
      setNewChats(response.data);
    } catch (error) {
      console.error('Error fetching new chats:', error);
    }
  };

  const createGroup = async (name: string, participants: number[]) => {
    try {
      const response = await api.post('/api/chats/', {
        participant_ids: participants,
        name,
        is_group: true
      });
      router.push(`/chats/${response.data.id}`);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const sortChats = (chats: Chat[]): Chat[] => {
    return [...chats].sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) {
        return a.is_pinned ? -1 : 1;
      }
      return new Date(b.updated_time).getTime() - new Date(a.updated_time).getTime();
    });
  };

  return { createChat, fetchNewChats, newChats, createGroup, sortChats };
};

export default useChatUtils;
