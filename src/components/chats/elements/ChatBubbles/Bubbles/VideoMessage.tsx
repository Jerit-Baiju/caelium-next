import { Message } from '@/helpers/props';
import MessageBubble from '../MessageBubble';

const VideoMessage = ({ message }: { message: Message }) => {
  return (
    <MessageBubble message={message}>
      <div className='max-h-[400px] max-w-[400px] overflow-hidden'>
        <video className='w-full h-auto object-contain' controls style={{ maxHeight: '400px', maxWidth: '400px' }}>
          <source src={message.file ? message.file : ''} type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      </div>
    </MessageBubble>
  );
};

export default VideoMessage;
