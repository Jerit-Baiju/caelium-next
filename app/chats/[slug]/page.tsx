'use client';
import { use, useEffect, useState } from 'react';
import ChatHeader from '@/components/chats/elements/ChatHeader';
import ChatInput from '@/components/chats/elements/ChatInput';
import ChatMain from '@/components/chats/elements/ChatMain';
import Loader from '@/components/Loader';
import { ChatProvider, useChatContext } from '@/contexts/ChatContext';
import { useWebSocket } from '@/contexts/SocketContext';

const ChatPageContent = () => {
  const { isLoading } = useChatContext();
  const { isConnected } = useWebSocket();
  const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    const updateViewportHeight = () => {
      const height = window.visualViewport?.height || window.innerHeight;
      setViewportHeight(height);
    };

    // Initial checks
    checkMobile();
    updateViewportHeight();

    // Event listeners
    window.addEventListener('resize', checkMobile);
    window.visualViewport?.addEventListener('resize', updateViewportHeight);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.visualViewport?.removeEventListener('resize', updateViewportHeight);
    };
  }, []);

  return (
    <div
      className='flex flex-col flex-grow max-sm:h-dvh sm:w-3/4'
      style={isMobile ? { height: `${viewportHeight}px` } : undefined}
    >
      {isLoading || !isConnected ? (
        <div className='flex flex-grow items-center justify-center'>
          <Loader />
        </div>
      ) : (
        <>
          <ChatHeader />
          <ChatMain viewportHeight={viewportHeight} />
          <ChatInput />
        </>
      )}
    </div>
  );
};

const Page = (props: { params: Promise<{ slug: number }> }) => {
  const params = use(props.params);

  return (
    <ChatProvider chatId={params.slug}>
      <ChatPageContent />
    </ChatProvider>
  );
};

export default Page;
