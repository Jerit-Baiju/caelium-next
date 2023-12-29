'use client';
import Wrapper from '@/app/Wrapper';
import ChatInput from '@/components/chats/ChatInput';
import ChatMain from '@/components/chats/ChatMain';
import SideBar from '@/components/chats/ChatPane';
import Header from '@/components/chats/Header';
// import AuthContext from '@/contexts/AuthContext';
// import { useContext } from 'react';

const page = ({ params }: { params: { slug: string } }) => {
  // let { user } = useContext(AuthContext);
  return (
    <Wrapper navSM={false}>
      <div className='text-white flex flex-grow'>
        <SideBar chat />
        <div className='flex flex-grow flex-col'>
          <Header />
          <ChatMain />
          <ChatInput />
        </div>
      </div>
    </Wrapper>
  );
};

export default page;
