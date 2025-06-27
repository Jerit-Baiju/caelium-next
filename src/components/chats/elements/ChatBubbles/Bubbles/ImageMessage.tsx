import { Message } from '@/helpers/props';
import MessageBubble from '../MessageBubble';

const ImageMessage = ({ message }: { message: Message }) => {
  return (
    <MessageBubble message={message}>
      <div className='max-h-[300px] max-w-[300px] overflow-hidden'>
        <img
          className='w-full h-auto object-contain'
          src={message.file ? message.file : ''}
          alt='Image message'
          loading='lazy'
          style={{ maxHeight: '300px', maxWidth: '300px' }}
        />
      </div>
    </MessageBubble>
  );
};

export default ImageMessage;
