import useAxios from '@/hooks/useAxios';
import { User } from '@/helpers/props';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const useChatUtils = () => {
  const router = useRouter();
  const [newChats, setNewChats] = useState<User[]>([]);
  const api = useAxios();

  const createChat = async (recipient_id: number) => {
    try {
      const response = await api.post('/api/chats/', { participant: recipient_id });
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
      const response = await api.post('/api/chats/create_group/', {
        name,
        participants,
      });
      console.log(response.data)
      router.push(`/chats/${response.data.id}`);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return { createChat, fetchNewChats, newChats, createGroup };
};

export default useChatUtils;
