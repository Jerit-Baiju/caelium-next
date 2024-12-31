'use client';
import Wrapper from '@/app/Wrapper';
import ChatsPane from '@/components/chats/ChatsPane';
import ChatProfile from '@/components/chats/elements/ChatProfile';
import { ChatProvider } from '@/contexts/ChatContext';
import { use } from 'react';

const page = (props: { params: Promise<{ slug: number }> }) => {
  const params = use(props.params);

  return (
    <Wrapper navSM={false}>
      <div className='flex flex-grow h-[calc(100dvh-5rem)] lg:divide-x divide-dashed divide-neutral-500'>
        <div className='hidden lg:block flex-none sm:w-1/4'>
          <ChatsPane />
        </div>
        <ChatProvider chatId={params.slug}>
          <ChatProfile />
        </ChatProvider>
      </div>
    </Wrapper>
  );
};

export default page;
