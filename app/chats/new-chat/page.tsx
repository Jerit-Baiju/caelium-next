'use client';
import NewChatDialog from '@/components/chats/NewChatDialog';
import Link from 'next/link';

const NewChat = () => {
  return (
    <div className='flex-grow bg-opacity-50 overflow-y-auto overflow-x-hidden top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0'>
      <div className='relative sm:p-4 w-full'>
        <div className='relative bg-white rounded-lg shadow dark:bg-neutral-900 h-screen'>
          <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-neutral-600'>
            <h3 className='text-xl font-semibold text-neutral-900 dark:text-white'>New Chat</h3>
            <Link
              href={'/chats'}
              className='end-2.5 text-neutral-400 bg-transparent hover:bg-neutral-200 hover:text-neutral-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-neutral-600 dark:hover:text-white'
              data-modal-hide='new-chat-modal'
            >
              <i className='fa-solid fa-xmark'></i>
              <span className='sr-only'>Close modal</span>
            </Link>
          </div>
          <NewChatDialog />
        </div>
      </div>
    </div>
  );
};

export default NewChat;
