import AuthContext from '@/contexts/AuthContext';
import { useChatContext } from '@/contexts/ChatContext';
import { Message } from '@/helpers/props';
import { useContext } from 'react';

const ImageMessage = ({ message }: { message: Message }) => {
  const date = new Date(message.timestamp);
  const { user } = useContext(AuthContext);
  const { getParticipant, is_anon, anonAvatar, anonName } = useChatContext();
  const participant = getParticipant(message.sender);
  const isMe = message.sender == user.id;
  const formattedTime = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  return (
    <div className={`flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 my-6 max-w-[85%] ${isMe ? 'ml-auto' : 'mr-auto'}`}>
      {!isMe && (
        <div className='shrink-0'>
          <div className='relative w-9 h-9'>
            <img
              className='rounded-full w-full h-full object-cover 
                ring-2 ring-white/80 dark:ring-neutral-800
                shadow-[0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
              alt={is_anon ? 'Anonymous' : participant?.name}
              src={is_anon ? anonAvatar : participant?.avatar}
            />
          </div>
        </div>
      )}
      <div className='flex flex-col'>
        <div className='flex items-center gap-2 mb-1.5'>
          <span className='text-sm font-medium text-neutral-800 dark:text-neutral-200'>
            {isMe ? 'You' : is_anon ? anonName : participant?.name}
          </span>
          <span className='text-[11px] text-neutral-500 dark:text-neutral-400'>{formattedTime}</span>
        </div>
        <div
          className={`
            rounded-2xl
            bg-white text-neutral-900 
            dark:bg-neutral-800 dark:text-white 
            border border-neutral-200 dark:border-neutral-700
            ${isMe ? 'rounded-tr-none' : 'rounded-tl-none'}
            transition-colors duration-200
            hover:shadow-md
            max-w-md overflow-hidden
          `}
        >
          <div className="max-h-[300px] max-w-[300px] overflow-hidden">
            <img 
              className='w-full h-auto object-contain' 
              src={message.file ? message.file : ''} 
              alt='Image message'
              loading='lazy'
              style={{ maxHeight: '300px', maxWidth: '300px' }}
            />
          </div>
          {message.content && (
            <p className='p-4 text-[15px] leading-relaxed tracking-[0.01em] font-normal
              selection:bg-neutral-200 dark:selection:bg-neutral-700
              selection:text-neutral-900 dark:selection:text-white'>
              {message.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageMessage;
