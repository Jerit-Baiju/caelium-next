import useChatUtils from '@/helpers/chats';
import { User } from '@/helpers/props';
import Link from 'next/link';
import { useEffect } from 'react';

interface NewChatDialogProps {
  onClose?: () => void;
}

const NewChatDialog = ({ onClose }: NewChatDialogProps) => {
  const { createChat, fetchNewChats, newChats } = useChatUtils();

  useEffect(() => {
    fetchNewChats();
  }, []);

  const handleCreateChat = (recipientId: number) => {
    createChat(recipientId);
    onClose?.();
  };

  return (
    <>
      <div className='p-4 md:p-5'>
        <div>
          <input
            type='text'
            name='name'
            id='name'
            className='bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full mb-2 p-2.5 dark:bg-neutral-800 dark:border-neutral-500 dark:placeholder-neutral-400 dark:text-white'
            placeholder='search'
            required
          />
        </div>
        <ul className='sm:max-h-[calc(100dvh-25rem)] overflow-y-scroll'>
          <li className='px-3 py-3 m-1 rounded-md hover:bg-neutral-800'>
            <Link href='/chats/new-group' className='flex items-center space-x-3 rtl:space-x-reverse'>
              <div className='flex-shrink-0'>
                <div className='w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-emerald-600 flex items-center justify-center'>
                  <span className='material-symbols-outlined text-white'>group_add</span>
                </div>
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-semibold text-neutral-900 truncate dark:text-white'>Create Group</p>
                <p className='text-sm text-neutral-500 truncate dark:text-neutral-400'>Start a new group chat</p>
              </div>
            </Link>
          </li>
          {newChats.map((recipient: User) => (
            <li
              onClick={() => handleCreateChat(recipient.id)}
              key={recipient.id}
              className='px-3 py-3 m-1 rounded-md hover:bg-neutral-800'
            >
              <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                <div className='flex-shrink-0'>
                  <img className='w-12 h-12 rounded-full dark:bg-white object-cover' src={recipient.avatar} alt={recipient.name} />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold text-neutral-900 truncate dark:text-white'>{recipient.name}</p>
                  <p className='text-sm text-neutral-500 truncate dark:text-neutral-400'>{recipient.email}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default NewChatDialog;
