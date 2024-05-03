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

const ChatMain = () => {
  let { messages } = useContext(ChatContext);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const isSameDay = (date1:Date, date2:Date) => {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
  };

  let prevDate: Date | null = null;

  const renderMessage = (message:Message) => {
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
          // Convert the message date string to a Date object
          const currentDate = new Date(message.timestamp);
          // Check if it's a new day compared to the previous message
          const isNewDay = !prevDate || !isSameDay(prevDate, currentDate);

          // Update the previous date for the next iteration
          prevDate = currentDate;

          // Render the separator if it's a new day
          if (isNewDay) {
            return (
              <React.Fragment key={`separator-${index}`}>
                <Separator timestamp={currentDate}/>
                {renderMessage(message)}
              </React.Fragment>
            );
          }

          // Render the message normally if it's not a new day
          return renderMessage(message);
        })}
      </div>
    </div>
  );
};

export default ChatMain;
