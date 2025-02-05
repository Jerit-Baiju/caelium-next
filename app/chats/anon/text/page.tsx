'use client';
import ChatPageContent from '@/components/chats/ChatPageContent';
import Loader from '@/components/Loader';
import { ChatProvider } from '@/contexts/ChatContext';
import { useNavbar } from '@/contexts/NavContext';
import { useWebSocket } from '@/contexts/SocketContext';
import { User } from '@/helpers/props';
import { useEffect, useState } from 'react';

const Page = () => {
  const { setShowNav } = useNavbar();
  const { socket, isConnected, socketData } = useWebSocket();
  const [currentTipIndex, setCurrentTipIndex] = useState(Math.floor(Math.random() * 5));
  const [isVisible, setIsVisible] = useState(true);
  const [isMatched, setIsMatched] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [chatId, setChatId] = useState<number | null>(null);

  const tips = [
    'Be respectful and kind to others',
    'Keep conversations friendly and light',
    "Feel free to skip if you're uncomfortable",
    'Report any inappropriate behavior',
    'Have fun and be yourself!',
  ];

  useEffect(() => {
    setShowNav(false);
    return () => {
      setShowNav(true);
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      console.log('Sending random chat request');
      socket?.send(JSON.stringify({ category: 'random_chat_request' }));

      const handleMessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        console.log('Received message:', data);

        if (data.category === 'random_chat_matched' && data.matched_user) {
          console.log('Matched with:', data.matched_user);
          setIsMatched(true);
          setMatchedUser(data.matched_user);
          setChatId(data.chat_id);
        } else if (data.category === 'random_chat_queued') {
          console.log('Added to queue');
        }
      };

      socket?.addEventListener('message', handleMessage);
      return () => socket?.removeEventListener('message', handleMessage);
    }
  }, [isConnected, socket]);

  // Tips rotation effect
  useEffect(() => {
    if (!isMatched) {
      const timer = setInterval(() => {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentTipIndex((prev) => {
            let next = Math.floor(Math.random() * tips.length);
            while (next === prev) {
              next = Math.floor(Math.random() * tips.length);
            }
            return next;
          });
          setIsVisible(true);
        }, 200);
      }, 2000);
      return () => clearInterval(timer);
    }
  }, [isMatched]);

  if (isMatched && chatId && matchedUser) {
    return (
      <main className='flex grow md:p-6 md:gap-6 h-dvh md:mx-96'>
        <ChatProvider is_anon={true} chatId={chatId}>
          <ChatPageContent />
        </ChatProvider>
      </main>
    );
  }

  return (
    <main className='flex grow md:p-6 md:gap-6 h-dvh md:mx-96'>
      <div className='flex flex-col w-full h-full items-center justify-center gap-6'>
        <Loader />
        <div className='flex flex-col items-center gap-2 text-center'>
          <h2 className='text-xl font-semibold'>Looking for someone to chat with...</h2>
          <p className='text-gray-500'>Please wait while we connect you with a random person</p>
          <p
            className={`text-sm text-gray-400 mt-2 px-5 italic transition-opacity duration-200 ease-in-out ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {tips[currentTipIndex]}
          </p>
        </div>
      </div>
    </main>
  );
};

export default Page;
