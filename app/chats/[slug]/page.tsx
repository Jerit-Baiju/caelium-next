'use client';
import Wrapper from '@/app/Wrapper';
import ChatsPane from '@/components/chats/ChatsPane';
import ChatHeader from '@/components/chats/elements.tsx/ChatHeader';
import ChatInput from '@/components/chats/elements.tsx/ChatInput';
import ChatMain from '@/components/chats/elements.tsx/ChatMain';

const page = ({ params }: { params: { slug: Number } }) => {
  return (
    <Wrapper navSM={false}>
      <div className='flex flex-grow sm:divide-x divide-dashed divide-gray-500 overflow-y-scroll'>
        <div className='max-sm:hidden flex flex-grow flex-none sm:w-1/4'>
          <ChatsPane />
        </div>
        {/* <div className='flex  flex-col flex-grow max-sm:h-screen sm:h-[calc(100dvh-5rem)] sm:w-3/4'> */}
        <div className='flex max-sm:max-h-[calc(100dvh-5rem] flex-col flex-grow h-screen sm:w-3/4'>
          <ChatHeader chatId={params.slug}/>
          <ChatMain chatId={params.slug} />
          <ChatInput />
        </div>
      </div>
    </Wrapper>
  );
};

export default page;
