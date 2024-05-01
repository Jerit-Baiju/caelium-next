'use client';
import ChatContext from '@/contexts/ChatContext';
import { Message } from '@/helpers/props';
import { useContext, useEffect, useRef } from 'react';
import DocMessage from './ChatBubbles/DocMessage';
import ImageMessage from './ChatBubbles/ImageMessage';
import TextMessage from './ChatBubbles/TextMessage';
import VideoMessage from './ChatBubbles/VideoMessage';
import VoiceMessage from './ChatBubbles/VoiceMessage';

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
          if (message.type === 'txt') {
            return <TextMessage key={message.id} message={message} />;
          } else if (message.type === 'img') {
            return <ImageMessage key={message.id} message={message} />;
          } else if (message.type === 'vid') {
            return <VideoMessage key={message.id} message={message} />;
          } else if (message.type === 'aud') {
            return <VoiceMessage key={message.id} message={message} />;
          } else if (message.type === 'doc') {
            return <DocMessage key={message.id} message={message} />;
          } else {
            return null; 
          }
        })}
      </div>
    </div>
  );
};

export default ChatMain;
