'use client';
import AuthContext from '@/contexts/AuthContext';
import { Message } from '@/helpers/props';
import { getUrl } from '@/helpers/support';
import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import TextLeft from './ChatBubbles/TextLeft';

const ChatMain = ({ chatId }: { chatId: Number }) => {
  let { authTokens } = useContext(AuthContext);
  let [messages, setMessages] = useState([]);
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
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, []);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={chatContainerRef} className='flex flex-col h-full overflow-y-scroll'>
      {messages.map((message: Message) => (
        <TextLeft key={message.id} message={message}/>
      ))}
    </div>
  );
};

export default ChatMain;
