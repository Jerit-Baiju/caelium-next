import { Message } from '@/helpers/props';

const TextMessage = ({ message }: { message: Message }) => {
  const date = new Date(message.timestamp);
  const formattedTime = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  let side = 'chat-start'
  if (message.side == 'right'){
    side = 'chat-end'
  }
  return (
    <div className={`chat ${side}`}>
      <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
          <img className='dark:bg-white' alt={message.sender.name} src={message.sender.avatar} />
        </div>
      </div>
      <div className='chat-header'>
        {message.sender.name}
        <time className='text-xs opacity-50 mx-2'>{formattedTime}</time>
      </div>
      <div className='chat-bubble rounded-lg bg-neutral-700 text-white'>{message.content}</div>
      {/* <div className='chat-footer opacity-50'>Delivered</div> */}
    </div>
  );
};

export default TextMessage;
