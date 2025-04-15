import AuthContext from '@/contexts/AuthContext';
import { useChatContext } from '@/contexts/ChatContext';
import { Message } from '@/helpers/props';
import { useContext } from 'react';

const DocMessage = ({ message }: { message: Message }) => {
  const date = new Date(message.timestamp);
  const { user } = useContext(AuthContext);
  const { getParticipant, is_anon, anonAvatar, anonName } = useChatContext();
  const participant = getParticipant(message.sender);
  const isMe = message.sender == user.id;
  const formattedTime = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  return (
    <div
      className={`flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 my-6 max-w-[85%] ${isMe ? 'ml-auto' : 'mr-auto'}`}
    >
      {!isMe && <div className='shrink-0'>
        <div className='relative w-9 h-9'>
          <img
            className='rounded-full w-full h-full object-cover 
              ring-2 ring-white/80 dark:ring-neutral-800
              shadow-[0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
            alt={is_anon ? 'Anonymous' : isMe ? user.name : participant?.name}
            src={is_anon ? anonAvatar : isMe ? user.avatar : participant?.avatar}
          />
        </div>
      </div>}
      <div className='flex flex-col'>
        <div className='flex items-center gap-2 mb-1.5'>
          <span className='text-sm font-medium text-neutral-800 dark:text-neutral-200'>
            {isMe ? 'You' : is_anon ? anonName : participant?.name}
          </span>
          <span className='text-[11px] text-neutral-500 dark:text-neutral-400'>{formattedTime}</span>
        </div>
        <div
          className={`
            rounded-2xl px-4 py-3 
            bg-white text-neutral-900 
            dark:bg-neutral-800 dark:text-white 
            border border-neutral-200 dark:border-neutral-700
            ${isMe ? 'rounded-tr-none' : 'rounded-tl-none'}
            transition-colors duration-200
            hover:shadow-md
            max-w-prose break-words
          `}
        >
          <div className='flex items-center justify-between gap-3'>
            <div className='flex items-start gap-3'>
              <div className='text-2xl text-neutral-500 dark:text-neutral-400'>
                <i className='fa-regular fa-file'></i>
              </div>
              <div className='flex flex-col'>
                <span className='text-sm font-medium truncate max-w-[200px] sm:max-w-[300px]'>
                  {message?.file_name}
                </span>
                <span className='text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1'>
                  {message.size} <span className='mx-0.5'>•</span> {message.extension}
                </span>
              </div>
            </div>
            <a
              href={message.file ? message.file : ''}
              download={message.file_name}
              target='_blank'
              rel='noopener noreferrer'
              className='w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-700 
                hover:bg-neutral-200 dark:hover:bg-neutral-600 
                transition-colors duration-200 text-neutral-700 dark:text-neutral-200'
              aria-label='Download file'
            >
              <i className='fa-solid fa-download text-sm'></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocMessage;
