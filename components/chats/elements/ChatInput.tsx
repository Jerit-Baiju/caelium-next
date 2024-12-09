import ChatContext from '@/contexts/ChatContext';
import { useWebSocket } from '@/contexts/SocketContext';
import { useContext, useRef } from 'react';

const ChatInput = () => {
  let { textInput, setTextInput, handleSubmit, sendFile, recipient } = useContext(ChatContext);
  let {socket } = useWebSocket()
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    file ? sendFile(file) : null;
  };

  const sendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    if (socket && textInput && recipient?.id) {
      const data = {
        message: textInput,
        receiver_id: recipient.id,
      };
      socket.send(JSON.stringify(data));
      setTextInput('');
    }
  };

  return (
    <form onSubmit={sendMessage}>
      <label htmlFor='chat' className='sr-only'>
        Your message
      </label>
      <div className='flex bottom-0 items-center px-3 py-2 border-t border-dashed bg-neutral-200 border-neutral-500 dark:bg-neutral-900'>
        <div>
          <input type='file' ref={fileInputRef} className='hidden' onChange={handleFileChange} />
        </div>
        <button
          type='button'
          onClick={handleButtonClick}
          className='inline-flex justify-center p-2 text-neutral-600 rounded-lg cursor-pointer hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-600'
        >
          <i className='fa-solid fa-image text-xl p-1'></i>
          <span className='sr-only'>Upload image</span>
        </button>
        <input
          type='text'
          id='chat'
          value={textInput}
          onChange={handleInputChange}
          autoComplete='off'
          autoFocus
          className='block mx-4 p-2.5 w-full text-sm text-neutral-900 bg-white rounded-lg border border-neutral-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-900 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          placeholder='Your message...'
          onKeyDown={handleKeyPress}
        />
        <button
          type='submit'
          className='inline-flex justify-center text-neutral-600 p-2 rounded-lg cursor-pointer hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-600'
        >
          <i className='fa-solid fa-paper-plane text-xl p-1'></i>
          <span className='sr-only'>Send message</span>
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
