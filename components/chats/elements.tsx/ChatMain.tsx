'use client';
import { useEffect, useRef } from 'react';
import TextLeft from './ChatBubbles/TextLeft';

const ChatMain = () => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, []);
  return (
    <div ref={chatContainerRef} className='flex flex-col h-full overflow-y-scroll'>
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
  );
};

export default ChatMain;
