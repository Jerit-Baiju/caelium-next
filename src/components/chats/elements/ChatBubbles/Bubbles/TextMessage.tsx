import { Message } from '@/helpers/props';
import MessageBubble from '../MessageBubble';

const TextMessage = ({ message }: { message: Message }) => {
  const paragraphs = message?.content
    .split('\n\n')
    .map((paragraph) =>
      paragraph.split('\n').map((line, index, array) => (index < array.length - 1 ? [line, <br key={index} />] : line))
    );

  return (
    <MessageBubble message={message}>
      {paragraphs?.map((paragraph, index) => (
        <p
          key={index}
          className='leading-relaxed mb-2 last:mb-0 text-[15px]
              tracking-[0.01em] font-normal
              selection:bg-neutral-200 dark:selection:bg-neutral-700
              selection:text-neutral-900 dark:selection:text-white'>
          {paragraph || '\u00A0'}
        </p>
      ))}
    </MessageBubble>
  );
};

export default TextMessage;
