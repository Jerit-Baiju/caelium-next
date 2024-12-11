'use client';
import ChatContext from '@/contexts/ChatContext';
import { Message } from '@/helpers/props';
import React, { useContext, useEffect, useRef } from 'react';
import DocMessage from './ChatBubbles/DocMessage';
import ImageMessage from './ChatBubbles/ImageMessage';
import { Separator } from './ChatBubbles/Separator';
import TextMessage from './ChatBubbles/TextMessage';
import VideoMessage from './ChatBubbles/VideoMessage';
import VoiceMessage from './ChatBubbles/VoiceMessage';
import UploadingMessage from './ChatBubbles/UploadingMessage';

const ChatMain = () => {
  let { messages, isUploading } = useContext(ChatContext);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isUploading]);

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
  };

  let prevDate: Date | null = null;

  const renderMessage = (message: Message) => {
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
  };

  return (
    <div ref={containerRef} className='flex flex-col overflow-auto h-full p-2'>
      <div className='flex-grow' />
      <div className='flex flex-col justify-end'>
        {messages.length === 0 && <div className='text-center text-neutral-400'>No messages yet</div>}
        {messages.map((message, index) => {
          const currentDate = new Date(message.timestamp);
          const isNewDay = !prevDate || !isSameDay(prevDate, currentDate);
          prevDate = currentDate;
          if (isNewDay) {
            return (
              <React.Fragment key={`separator-${index}`}>
                <Separator timestamp={currentDate} />
                {renderMessage(message)}
              </React.Fragment>
            );
          }
          return renderMessage(message);
        })}
        {isUploading && <UploadingMessage />}
      </div>
    </div>
  );
};

export default ChatMain;
