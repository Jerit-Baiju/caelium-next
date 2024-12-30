import { useChatContext } from '@/contexts/ChatContext';
import { User } from '@/helpers/props';
import { useEffect, useState } from 'react';

const Typing = () => {
  const { typingMessage, getParticipant } = useChatContext();
  const [typist, setTypist] = useState<User | null>(null);
  useEffect(() => {
    setTypist(typingMessage?.sender ? getParticipant(typingMessage?.sender) : null);
  }, [typingMessage]);
  return (
    typingMessage?.typed && (
      <div className='chat chat-start'>
        <div className='chat-image avatar'>
          <div className='w-10 rounded-full'>
            <img
              className='dark:bg-white border-1 border-neutral-200 dark:border-neutral-800'
              alt={typist?.name}
              src={typist?.avatar}
            />
          </div>
        </div>
        <div className='chat-header'>{typist?.name}</div>
        <div className='chat-bubble flex items-center space-x-2 text-black dark:text-white fa-beat-fade'>
          <span className='text-sm font-medium'>{typingMessage?.typed}</span>
          <i className='fa-solid fa-i-cursor'></i>
        </div>
      </div>
    )
  );
};

export default Typing;
