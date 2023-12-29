'use client';
import Wrapper from '@/app/Wrapper';
import ChatsPane from '@/components/chats/ChatsPane';
import ChatHeader from '@/components/chats/elements.tsx/ChatHeader';
import ChatInput from '@/components/chats/elements.tsx/ChatInput';
import ChatMain from '@/components/chats/elements.tsx/ChatMain';

const page = ({ params }: { params: { slug: string } }) => {
  // let { user } = useContext(AuthContext);
  return (
    <Wrapper navSM={false}>
      <div className='flex relative flex-grow sm:divide-x divide-dashed divide-gray-500'>
        <div className='max-sm:hidden flex flex-grow flex-none sm:w-1/4'>
          <ChatsPane />
        </div>
        <div className='flex flex-col relative flex-grow sm:w-3/4'>
          <ChatHeader />
          <ChatMain />
          <ChatInput />
        </div>
      </div>
    </Wrapper>
  );
};

export default page;
