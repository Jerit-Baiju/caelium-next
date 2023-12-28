'use client';
import SideBar from '@/components/chats/ChatPane';
import SpeedDial from '@/components/chats/SpeedDial';
import Image from 'next/image';
import Wrapper from '../Wrapper';

export interface JSONSchema {
  chat: Chat;
}

export interface Chat {
  avatars: string;
  names: string;
}

const Chat = () => {
  return (
    <Wrapper>
      <div className='text-white flex flex-grow'>
        <SideBar />
        <div className='flex-1 p-4 max-sm:hidden flex flex-col items-center justify-center'>
          <div className='text-center'>
            <Image src={'/logos/written.png'} alt='caelium' className='-mt-32' width={500} height={100} />
            <p className='text-xl mt-7 mb-4'>Select a person to start a chat.</p>
            <button
              type='button'
              className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>
              Send Message
            </button>
          </div>
        </div>
      </div>
      <div className='md:hidden'>
        <SpeedDial />
      </div>
    </Wrapper>
  );
};

export default Chat;
