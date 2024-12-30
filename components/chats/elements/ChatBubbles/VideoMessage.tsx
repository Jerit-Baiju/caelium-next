import AuthContext from '@/contexts/AuthContext';
import ChatContext from '@/contexts/ChatContext';
import { Message } from '@/helpers/props';
import { useContext } from 'react';

const VideoMessage = ({ message }: { message: Message }) => {
  const date = new Date(message.timestamp);
  const formattedTime = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  const { recipient } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  let isMe = message.sender.id == user.id;
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
        {message.sender.name}
        <time className='text-xs opacity-50 mx-2'>{formattedTime}</time>
      </div>
      <div className='chat-bubble rounded-lg bg-neutral-500 dark:bg-neutral-700 text-white overscroll-none break-words p-1'>
        <video className='h-64' controls>
          <source src={message.file ? message.file : ''} type='video/mp4' />
          Your browser does not support the video tag.
        </video>
        {message.content && <p className='mt-1 ms-1'> {message.content}</p>}
      </div>

      {/* <div className='chat-footer opacity-50'>Delivered</div> */}
    </div>
  );
};

export default VideoMessage;
