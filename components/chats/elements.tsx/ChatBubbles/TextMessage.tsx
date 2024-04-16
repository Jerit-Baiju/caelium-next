import AuthContext from '@/contexts/AuthContext';
import ChatContext from '@/contexts/ChatContext';
import { Message } from '@/helpers/props';
import { useContext } from 'react';

const TextMessage = ({ message }: { message: Message }) => {
  const date = new Date(message.timestamp);
  const formattedTime = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  const { recipient } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  let side = 'chat-start';
  if (message.side == 'right') {
    side = 'chat-end';
  }
  return (
    <div className={`chat ${side}`}>
      <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
          <img
            className='dark:bg-white border-1 border-neutral-200 dark:border-neutral-800'
            alt={message.sender.name}
            src={message.side == 'left' ? recipient?.avatar : user.avatar}
          />
        </div>
      </div>
      <div className='chat-header'>
        {message.sender.name}
        <time className='text-xs opacity-50 mx-2'>{formattedTime}</time>
      </div>
      <div className='chat-bubble rounded-lg bg-neutral-500 dark:bg-neutral-700 text-white'>{message.content}</div>
      {/* <div className='chat-footer opacity-50'>Delivered</div> */}
    </div>
  );
};

export default TextMessage;
