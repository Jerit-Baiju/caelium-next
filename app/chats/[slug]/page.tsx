'use client';
import Wrapper from '@/app/Wrapper';
import ChatsPane from '@/components/chats/ChatsPane';
import ChatHeader from '@/components/chats/elements.tsx/ChatHeader';
import ChatInput from '@/components/chats/elements.tsx/ChatInput';
import ChatMain from '@/components/chats/elements.tsx/ChatMain';
import { ChatProvider } from '@/contexts/ChatContext';

const page = ({ params }: { params: { slug: Number } }) => {
  return (
    <Wrapper navSM={false}>
      <div className='flex flex-grow sm:divide-x divide-dashed divide-neutral-500 overflow-y-scroll'>
        <div className='max-sm:hidden flex flex-grow flex-none sm:w-1/4'>
          <ChatsPane />
        </div>
        {/* <div className='flex  flex-col flex-grow max-sm:h-screen sm:h-[calc(100dvh-5rem)] sm:w-3/4'> */}
        <ChatProvider chatId={params.slug}>
          <div className='flex max-sm:max-h-[calc(100dvh-5rem] flex-col flex-grow h-screen sm:w-3/4'>
            <ChatHeader />
            <ChatMain />
            <ChatInput />
          </div>
        </ChatProvider>
      </div>
    </Wrapper>
  );
};

export default page;
