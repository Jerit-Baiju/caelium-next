import { useChatContext } from '@/contexts/ChatContext';
import { useWebSocket } from '@/contexts/SocketContext';
import { useEffect, useState } from 'react';
import Loader from '../layout/Loader';
import ChatHeader from './elements/ChatHeader';
import ChatInput from './elements/ChatInput';
import ChatMain from './elements/ChatMain';

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
    <div className='flex flex-col grow max-sm:h-dvh sm:w-3/4' style={isMobile ? { height: `${viewportHeight}px` } : undefined}>
      {isLoading ? (
        <div className='flex grow items-center justify-center'>
          <Loader />
        </div>
      ) : !isConnected ? (
        <div className='flex grow items-center justify-center'>
          <p>Connection lost. Please refresh the page.</p>
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
export default ChatPageContent;
