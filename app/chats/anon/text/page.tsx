'use client';
import ChatHeader from '@/components/chats/elements/ChatHeader';
import ChatInput from '@/components/chats/elements/ChatInput';
import ChatMain from '@/components/chats/elements/ChatMain';
import { ChatProvider, useChatContext } from '@/contexts/ChatContext';
import { useNavbar } from '@/contexts/NavContext';
import { useWebSocket } from '@/contexts/SocketContext';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';

const RandomTextChat = () => {
  const { setShowNav } = useNavbar();
  useEffect(() => {
    setShowNav(false);
    return () => setShowNav(true);
  });
  const ChatPageContent = () => {
    const { isLoading } = useChatContext();
    const { isConnected } = useWebSocket();
    const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight);
    const [isMobile, setIsMobile] = useState(false);

    const { setViewSM } = useNavbar();
    useEffect(() => {
      setViewSM(false);
      return () => {
        setViewSM(true);
      };
    }, [setViewSM]);

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
      <div className='flex flex-col flex-grow max-sm:h-dvh sm:w-3/4' style={isMobile ? { height: `${viewportHeight}px` } : undefined}>
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

  return (
    <ChatProvider chatId={139}>
      <ChatPageContent />
    </ChatProvider>
  );
};

export default RandomTextChat;
