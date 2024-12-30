import AuthContext from '@/contexts/AuthContext';
import { useChatContext } from '@/contexts/ChatContext';
import { Message } from '@/helpers/props';
import { useContext } from 'react';

const ImageMessage = ({ message }: { message: Message }) => {
  const date = new Date(message.timestamp);
  const { user } = useContext(AuthContext);
  const { getParticipant } = useChatContext();
  const participant = getParticipant(message.sender);
  const isMe = message.sender == user.id;
  const formattedTime = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  return (
    <div className={`chat ${isMe ? 'chat-end' : 'chat-start'}`}>
      <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
          <img
            className='dark:bg-white border-1 border-neutral-200 dark:border-neutral-800'
            alt={participant?.name}
            src={isMe ? user.avatar : participant?.avatar}
          />
        </div>
      </div>
      <div className='chat-header'>
        {participant?.name}
        <time className='text-xs opacity-50 mx-2'>{formattedTime}</time>
      </div>
      <div className='chat-bubble rounded-lg bg-neutral-500 dark:bg-neutral-700 text-white overscroll-none break-words p-1'>
        <img className='h-64' src={message.file ? message.file : ''} alt='' />
        {message.content && <p className='mt-1 ms-1'> {message.content}</p>}
      </div>

      {/* <div className='chat-footer opacity-50'>Delivered</div> */}
    </div>
  );
};

export default ImageMessage;
