'use client';
import AuthContext from '@/contexts/AuthContext';
import { Message } from '@/helpers/props';
import { getUrl } from '@/helpers/support';
import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';

import TextMessage from './ChatBubbles/TextMessage';

const ChatMain = ({ chatId }: { chatId: Number }) => {
  let { authTokens } = useContext(AuthContext);
  let [messages, setMessages] = useState([]);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fetchRecipient = async () => {
      try {
        const response = await axios.request(getUrl({ url: `/api/chats/messages/${chatId}/`, token: authTokens?.access }));
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchRecipient();
  }, []);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div ref={containerRef} className='flex flex-col overflow-auto h-full p-2'>
      <div className='flex-grow'/>
      <div className='flex flex-col justify-end'>
        {messages.map((message: Message) => (
          <TextMessage key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};

export default ChatMain;
