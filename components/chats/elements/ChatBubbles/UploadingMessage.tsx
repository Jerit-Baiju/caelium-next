import AuthContext from '@/contexts/AuthContext';
import { useContext } from 'react';

const UploadingMessage = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className='chat chat-end'>
      <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
          <img className='dark:bg-white border-1 border-neutral-200 dark:border-neutral-800' alt={user.name} src={user.avatar} />
        </div>
      </div>
      <div className='chat-bubble flex items-center space-x-2 text-black dark:text-white fa-beat-fade'>
        <span className='text-sm font-medium'>Uploading</span>
        <i className='fa-solid fa-angles-up'></i>
      </div>
    </div>
  );
};

export default UploadingMessage;
