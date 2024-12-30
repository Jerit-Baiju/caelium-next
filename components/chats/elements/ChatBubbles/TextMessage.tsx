import AuthContext from '@/contexts/AuthContext';
import ChatContext from '@/contexts/ChatContext';
import { Message } from '@/helpers/props';
import { useContext } from 'react';

const TextMessage = ({ message }: { message: Message }) => {
  const date = new Date(message.timestamp);
  const formattedTime = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  const { recipient } = useContext(ChatContext);
  const { user } = useContext(AuthContext);

  let isMe = message.sender.id == user.id;

  const paragraphs = message?.content
    .split('\n\n')
    .map((paragraph) =>
      paragraph.split('\n').map((line, index, array) => (index < array.length - 1 ? [line, <br key={index} />] : line)),
    );

  return (
    <div className={`chat ${isMe ? 'chat-end' : 'chat-start'}`}>
      <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
          <img
            className='dark:bg-white border-1 border-neutral-200 dark:border-neutral-800'
            alt={message.sender.name}
            src={isMe ? user.avatar : recipient?.avatar}
          />
        </div>
      </div>
      <div className='chat-header'>
        {isMe ? user.name : recipient?.name}
        <time className='text-xs opacity-50 mx-2'>{formattedTime}</time>
      </div>
      <div className='chat-bubble rounded-lg bg-neutral-500 dark:bg-neutral-700 text-white overscroll-none break-words space-y-3'>
        {paragraphs?.map((paragraph, index) => (
          <p key={index} className='leading-relaxed'>
            {paragraph || '\u00A0'}
          </p>
        ))}
      </div>

      {/* <div className='chat-footer opacity-50'>Delivered</div> */}
    </div>
  );
};

export default TextMessage;
