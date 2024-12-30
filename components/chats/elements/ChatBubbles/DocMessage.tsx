import AuthContext from '@/contexts/AuthContext';
import { Message } from '@/helpers/props';
import { useContext } from 'react';

const DocMessage = ({ message }: { message: Message }) => {
  const date = new Date(message.timestamp);
  const formattedTime = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  const { user } = useContext(AuthContext);
  let isMe = message.sender.id == user.id;
  return (
    <div className={`chat ${isMe ? 'chat-end' : 'chat-start'}`}>
      <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
          <img
            className='dark:bg-white border-1 border-neutral-200 dark:border-neutral-800'
            alt={message.sender.name}
            src={isMe ? user.avatar : message.sender.avatar}
          />
        </div>
      </div>
      <div className='chat-header'>
        {message.sender.name}
        <time className='text-xs opacity-50 mx-2'>{formattedTime}</time>
      </div>
      <div className='chat-bubble flex rounded-lg bg-neutral-500 dark:bg-neutral-700 text-white overscroll-none break-words p-4'>
        <div className='me-2 truncate'>
          <span className='flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white pb-2'>
            <i className='fa-regular fa-file text-xl'></i>
            {message?.file_name}
          </span>
          <span className='flex text-xs font-normal text-gray-500 dark:text-gray-400 gap-2'>
            {message.size} <span>•</span> {message.extension}
          </span>
        </div>
        <div className='inline-flex self-center items-center'>
          <a
            className='inline-flex self-center items-center p-2 text-sm font-medium text-center text-neutral-900 bg-neutral-50 rounded-lg hover:bg-neutral-100  dark:text-white focus:ring-neutral-50 dark:bg-neutral-600 dark:hover:bg-neutral-500'
            type='button'
            href={message.file ? message.file : ''}
            download={message.file_name}
            target={'_blank'}
          >
            <i className='fa-solid fa-download text-xl'></i>
          </a>
        </div>
      </div>

      {/* <div className='chat-footer opacity-50'>Delivered</div> */}
    </div>
  );
};

export default DocMessage;
