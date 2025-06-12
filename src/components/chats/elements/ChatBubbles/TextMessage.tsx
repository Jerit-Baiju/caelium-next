import AuthContext from '@/contexts/AuthContext';
import { useChatContext } from '@/contexts/ChatContext';
import { Message } from '@/helpers/props';
import { useContext } from 'react';

const TextMessage = ({ message }: { message: Message }) => {
  const date = new Date(message.timestamp);
  const { user } = useContext(AuthContext);
  const { getParticipant } = useChatContext();
  const participant = getParticipant(message.sender);
  const isMe = message.sender == user?.id;
  const formattedTime = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  const paragraphs = message?.content
    .split('\n\n')
    .map((paragraph) =>
      paragraph.split('\n').map((line, index, array) => (index < array.length - 1 ? [line, <br key={index} />] : line)),
    );

  return (
    <div
      className={`flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 my-1 max-w-[85%] ${isMe ? 'ml-auto' : 'mr-auto'}`}
    >
      {!isMe&&<div className='shrink-0'>
        <div className='relative w-9 h-9'>
          <img
            className='rounded-full w-full h-full object-cover 
              ring-2 ring-white/80 dark:ring-neutral-800
              shadow-[0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
            alt={isMe ? user.name : participant?.name}
            src={isMe ? user.avatar : participant?.avatar}
          />
        </div>
      </div>}
      <div className='flex flex-col'>
        <div className='flex items-center gap-2 mb-1.5'>
          <span className='text-sm font-medium text-neutral-800 dark:text-neutral-200'>
            {isMe ? 'You' : participant?.name}
          </span>
          <span className='text-[11px] text-neutral-500 dark:text-neutral-400'>{formattedTime}</span>
        </div>
        <div
          className={`
            rounded-2xl px-5 py-3 
            bg-white text-neutral-900 
            dark:bg-neutral-800 dark:text-white 
            border border-neutral-200 dark:border-neutral-700
            ${isMe ? 'rounded-tr-none' : 'rounded-tl-none'}
            transition-colors duration-200
            hover:shadow-md
            max-w-prose break-words
          `}
        >
          {paragraphs?.map((paragraph, index) => (
            <p
              key={index}
              className='leading-relaxed mb-2 last:mb-0 text-[15px]
              tracking-[0.01em] font-normal
              selection:bg-neutral-200 dark:selection:bg-neutral-700
              selection:text-neutral-900 dark:selection:text-white'
            >
              {paragraph || '\u00A0'}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextMessage;
