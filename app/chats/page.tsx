// Assuming this is your Chat component in Next.js

import SideBar from '@/components/chats/SideBar';
import Wrapper from '../Wrapper';

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
      <SideBar chats={persons}/>
        <div className='flex-1 p-4 max-sm:hidden'>
          <h2 className='text-lg font-semibold mb-4'>Chat with {currentChat.personId}</h2>
          <div className='border p-4 h-64 overflow-y-auto'>
            {currentChat.messages.map((message) => (
              <div key={message.id} className='mb-2'>
                {message.text}
              </div>
            ))}
          </div>
        </div>
    </Wrapper>
  );
};

export default Chat;
