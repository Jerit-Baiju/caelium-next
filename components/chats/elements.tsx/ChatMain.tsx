'use client';
import ChatContext from '@/contexts/ChatContext';
import { Message } from '@/helpers/props';
import { useContext, useEffect, useRef } from 'react';
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
        {messages.map((message: Message) => (
          <TextMessage key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};

export default ChatMain;
