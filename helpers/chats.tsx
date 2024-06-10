import useAxios from '@/helpers/useAxios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const useChatUtils = () => {
  const router = useRouter();
  const [newChats, setNewChats] = useState([]);
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

  return { createChat, fetchNewChats, newChats };
};

export default useChatUtils;
