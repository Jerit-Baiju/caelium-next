import { Message } from '@/helpers/props';
import MessageBubble from '../MessageBubble';

const DocMessage = ({ message }: { message: Message }) => {
  return (
    <MessageBubble message={message}>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-start gap-3'>
          <div className='text-2xl text-neutral-500 dark:text-neutral-400'>
            <i className='fa-regular fa-file'></i>
          </div>
          <div className='flex flex-col'>
            <span className='text-sm font-medium truncate max-w-[200px] sm:max-w-[300px]'>{message?.file_name}</span>
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
          aria-label='Download file'>
          <i className='fa-solid fa-download text-sm'></i>
        </a>
      </div>
    </MessageBubble>
  );
};

export default DocMessage;
