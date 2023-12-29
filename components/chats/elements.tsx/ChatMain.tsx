'use client';
import { useEffect, useRef } from 'react';
import TextLeft from './ChatBubbles/TextLeft';

const ChatMain = () => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, []);
  return (
    <div ref={chatContainerRef} className='flex flex-col overflow-y-scroll flex-grow-0 h-screen -my-[3.82rem] max-h-min text-white'>
      <div className='py-16'>
        <TextLeft />
        <TextLeft />
        <TextLeft />
        <TextLeft />
        <TextLeft />
        <TextLeft />
        <TextLeft />
        <TextLeft />
        <TextLeft />
        <TextLeft />
      </div>
    </div>
  );
};

export default ChatMain;
