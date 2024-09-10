'use client';
import Wrapper from '@/app/Wrapper';
import ChatsPane from '@/components/chats/ChatsPane';
import ChatHeader from '@/components/chats/elements/ChatHeader';
import ChatInput from '@/components/chats/elements/ChatInput';
import ChatMain from '@/components/chats/elements/ChatMain';
import Loader from '@/components/Loader';
import { ChatProvider, useChatContext } from '@/contexts/ChatContext'; // Modified import

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

const page = ({ params }: { params: { slug: Number } }) => {
  return (
    <Wrapper navSM={false}>
      <div className='flex flex-grow h-[calc(100dvh-5rem)] sm:divide-x divide-dashed divide-neutral-500 overflow-y-scroll'>
        <div className='max-sm:hidden flex flex-grow flex-none sm:w-1/4'>
          <ChatsPane />
        </div>
        <ChatProvider chatId={params.slug}>
          <ChatPageContent />
        </ChatProvider>
      </div>
    </Wrapper>
  );
};

export default page;
