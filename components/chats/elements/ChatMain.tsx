'use client';
import ChatContext from '@/contexts/ChatContext';
import { Message } from '@/helpers/props';
import React, { useContext, useEffect, useRef, useState } from 'react';
import DocMessage from './ChatBubbles/DocMessage';
import ImageMessage from './ChatBubbles/ImageMessage';
import { Separator } from './ChatBubbles/Separator';
import TextMessage from './ChatBubbles/TextMessage';
import UploadingMessage from './ChatBubbles/UploadingMessage';
import VideoMessage from './ChatBubbles/VideoMessage';
import VoiceMessage from './ChatBubbles/VoiceMessage';
import Typing from './states/Typing';

const ChatMain = () => {
  const { messages, isUploading, typingMessage, loadMoreMessages, nextPage } = useContext(ChatContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState<number>(0); // To track the scroll offset
  const [loading, setLoading] = useState<boolean>(false); // Track if older messages are being loaded

  useEffect(() => {
    if (containerRef.current && !loading) {
      // Scroll to the bottom when new messages arrive (for sending or receiving messages)
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isUploading, typingMessage, loading]);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight } = containerRef.current;
      const isAtTop = scrollTop === 0;

      if (isAtTop && !loading) {
        // Save the current scroll position (offset)
        setScrollOffset(scrollHeight);

        // Load older messages when scrolled to the top
        setLoading(true);
        loadMoreMessages();
        setLoading(false);
      }
    }
  };

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

  useEffect(() => {
    if (containerRef.current && scrollOffset && !loading) {
      const newScrollHeight = containerRef.current.scrollHeight;
      containerRef.current.scrollTop = newScrollHeight - scrollOffset;
    }
  }, [messages, scrollOffset, loading]);

  return (
    <div ref={containerRef} onScroll={handleScroll} className='flex flex-col overflow-auto h-max p-2'>
      <div className='flex-grow' />
      {nextPage && <div className='text-center text-neutral-400 my-10'>Loading older messages...</div>}
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
        {typingMessage && <Typing />}
      </div>
    </div>
  );
};

export default ChatMain;
