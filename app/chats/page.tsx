// Assuming this is your Chat component in Next.js
import SideBar from '@/components/chats/SideBar';
import Wrapper from '../Wrapper';
import Image from 'next/image';
import SpeedDial from '@/components/chats/SpeedDial';

const Chat = () => {
  const persons = [
    { id: 1, name: 'Person 1' },
    { id: 2, name: 'Person 2' },
    { id: 3, name: 'Person 3' },
  ];

  const currentChat = {
    personId: 1,
    messages: [
      { id: 1, text: 'Hi there!' },
      { id: 2, text: 'How are you?' },
    ],
  };

  return (
    <Wrapper>
      <div className='text-white flex flex-grow p-4'>
        <SideBar chats={persons} />
        <div className='flex-1 p-4 max-sm:hidden flex flex-col items-center justify-center'>
          <div className='text-center'>
            <Image src={'/logos/written.png'} alt='caelium' className='-mt-32' width={500} height={100} />
            <p className='text-xl mt-7 mb-4'>Select a person to start a chat.</p>
            <button
              type='button'
              className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>
              Send Message
            </button>
          </div>
        </div>
      </div>
      <div className='md:hidden'>
      <SpeedDial />
      </div>
    </Wrapper>
  );
};

export default Chat;
