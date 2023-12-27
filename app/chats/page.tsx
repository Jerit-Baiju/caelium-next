// Assuming this is your Chat component in Next.js

import Wrapper from '../Wrapper';

const Chat = () => {
  // Sample data for persons
  const persons = [
    { id: 1, name: 'Person 1' },
    { id: 2, name: 'Person 2' },
    { id: 3, name: 'Person 3' },
    // Add more persons as needed
  ];

  // Sample data for current chat
  const currentChat = {
    personId: 1, // ID of the person you are currently chatting with
    messages: [
      { id: 1, text: 'Hi there!' },
      { id: 2, text: 'How are you?' },
      // Add more messages as needed
    ],
  };

  return (
    <Wrapper>
      <div className='flex h-full'>
        <div className='w-1/5 h-full p-4 border-r-2 border-gray-200 dark:border-gray-700'>
          <h2 className='text-lg font-semibold mb-4'>Persons to Chat</h2>
          <ul role='list' className='max-w-sm divide-y divide-gray-200 dark:divide-gray-700'>
            {persons.map((person) => (
              <li className='py-3 sm:py-4'>
                <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                  <div className='flex-shrink-0'>
                    <img className='w-8 h-8 rounded-full' src='http://192.168.43.157:8000/media/avatars/default.png' alt='Neil image' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-semibold text-gray-900 truncate dark:text-white'>{person.name}</p>
                    <p className='text-sm text-gray-500 truncate dark:text-gray-400'>email@flowbite.com</p>
                  </div>
                  <span className='inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300'>
                    <span className='w-2 h-2 me-1 bg-green-500 rounded-full'></span>
                    Available
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className='flex-1 p-4'>
          <h2 className='text-lg font-semibold mb-4'>Chat with {currentChat.personId}</h2>
          <div className='border p-4 h-64 overflow-y-auto'>
            {currentChat.messages.map((message) => (
              <div key={message.id} className='mb-2'>
                {message.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Chat;
