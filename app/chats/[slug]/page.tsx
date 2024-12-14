'use client';
import Wrapper from '@/app/Wrapper';
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
  return (
    <div className='flex flex-col flex-grow max-sm:h-screen sm:w-3/4'>
      {isLoading ? (
        <div className='flex flex-grow items-center justify-center'>
          <Loader />
        </div>
      ) : (
        <>
          <ChatHeader />
          <ChatMain />
          <ChatInput />
        </>
      )}
    </div>
  );
};

const Page = ({ params }: { params: { slug: Number } }) => {
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
