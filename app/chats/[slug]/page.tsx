'use client';
import Wrapper from '@/app/Wrapper';
import { use, useEffect, useState } from 'react';
// import NotificationPrompt from '@/components/base/NotificationPrompt';
import ChatsPane from '@/components/chats/ChatsPane';
import ChatHeader from '@/components/chats/elements/ChatHeader';
import ChatInput from '@/components/chats/elements/ChatInput';
import ChatMain from '@/components/chats/elements/ChatMain';
import Loader from '@/components/Loader';
import { ChatProvider, useChatContext } from '@/contexts/ChatContext';
// import useNotifications from '@/hooks/useNotifications';

const ChatPageContent = () => {
  const { isLoading } = useChatContext();
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
    <div className='flex flex-col flex-grow max-sm:h-dvh sm:w-3/4' style={isMobile ? { height: `${viewportHeight}px` } : undefined}>
      {isLoading ? (
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
  // const { showAlertDialog, requestPermission, setShowAlertDialog } = useNotifications();

  return (
    <Wrapper navSM={false}>
      {/* {showAlertDialog && <NotificationPrompt onEnable={requestPermission} onClose={() => setShowAlertDialog(false)} />} */}
      <div className='flex flex-grow h-[calc(100dvh-5rem)] lg:divide-x divide-dashed divide-neutral-500 overflow-y-scroll'>
        <div className='hidden lg:block flex-grow flex-none sm:w-1/4'>
          <ChatsPane />
        </div>
        <ChatProvider chatId={params.slug}>
          <ChatPageContent />
        </ChatProvider>
      </div>
    </Wrapper>
  );
};

export default Page;
