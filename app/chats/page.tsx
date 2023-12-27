// Assuming this is your Chat component in Next.js

import React from 'react';
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
      <div className='flex'>
      <div className='w-1/5 p-4 border-r'>
        <h2 className='text-lg font-semibold mb-4'>Persons to Chat</h2>
        <ul>
          {persons.map((person) => (
            <li key={person.id} className='cursor-pointer hover:bg-gray-200 p-2'>
              {person.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Right side - Current chat */}
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
