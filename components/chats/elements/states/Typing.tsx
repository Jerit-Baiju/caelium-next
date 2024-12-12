import { useChatContext } from '@/contexts/ChatContext';

const Typing = () => {
  const { recipient, typingMessage } = useChatContext();
  return (
    <div className='chat chat-start'>
      <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
          <img
            className='dark:bg-white border-1 border-neutral-200 dark:border-neutral-800'
            alt={recipient?.name}
            src={recipient?.avatar}
          />
        </div>
      </div>
      <div className='chat-header'>{recipient?.name}</div>
      <div className='chat-bubble flex items-center space-x-2 text-black dark:text-white fa-beat-fade'>
        <span className='text-sm font-medium'>{typingMessage}</span>
        <i className='fa-solid fa-i-cursor'></i>
      </div>
    </div>
  );
};

export default Typing;
