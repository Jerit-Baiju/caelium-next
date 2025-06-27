import { Message } from '@/helpers/props';
import MessageBubble from '../MessageBubble';

const VoiceMessage = ({ message }: { message: Message }) => {
  return (
    <MessageBubble message={message}>
      <div className='p-4'>
        <audio controls className='w-full max-w-xs' style={{ height: '40px' }}>
          <source src={message.file ? message.file : ''} type='audio/mpeg' />
          <source src={message.file ? message.file : ''} type='audio/wav' />
          <source src={message.file ? message.file : ''} type='audio/ogg' />
          Your browser does not support the audio element.
        </audio>
      </div>
      {message.content && (
        <p
          className='px-4 pb-4 text-[15px] leading-relaxed tracking-[0.01em] font-normal
              selection:bg-neutral-200 dark:selection:bg-neutral-700
              selection:text-neutral-900 dark:selection:text-white'>
          {message.content}
        </p>
      )}
    </MessageBubble>
  );
};

export default VoiceMessage;
