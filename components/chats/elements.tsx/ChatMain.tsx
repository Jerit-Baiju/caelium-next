'use client';
import ChatContext from '@/contexts/ChatContext';
import { Message } from '@/helpers/props';
import { useContext, useEffect, useRef } from 'react';
import ImageMessage from './ChatBubbles/ImageMessage';
import TextMessage from './ChatBubbles/TextMessage';

const ChatMain = () => {
  let { messages } = useContext(ChatContext);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={containerRef} className='flex flex-col overflow-auto h-full p-2'>
      <div className='flex-grow' />
      <div className='flex flex-col justify-end'>
        {messages.length === 0 && <div className='text-center text-neutral-400'>No messages yet</div>}
        {messages.map((message: Message) => {
          if (message.type === 'text') {
            return <TextMessage key={message.id} message={message} />;
          } else if (message.type === 'image') {
            return <ImageMessage key={message.id} message={message} />;
          } else {
            return null; // Handle other types of messages as needed
          }
        })}
      </div>
    </div>
  );
};

export default ChatMain;
