'use client';
import ChatPageContent from '@/components/chats/ChatPageContent';
import { ChatProvider } from '@/contexts/ChatContext';
import { useNavbar } from '@/contexts/NavContext';
import { useEffect } from 'react';

const Page = () => {
  const { setShowNav } = useNavbar();
  useEffect(() => {
    setShowNav(false);
    return () => {
      setShowNav(true);
    };
  }, []);

  return (
    <main className='flex flex-grow md:p-6 md:gap-6 md:h-dvh md:mx-96'>
      <ChatProvider chatId={139}>
        <ChatPageContent />
      </ChatProvider>
    </main>
  );
};

export default Page;
