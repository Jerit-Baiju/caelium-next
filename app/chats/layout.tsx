'use client';
import ChatsPane from '@/components/chats/ChatsPane';
import { ChatsPaneProvider } from '@/contexts/ChatsPaneContext';
import { useNavbar } from '@/contexts/NavContext';
import { useEffect } from 'react';

export default function ChatsLayout({ children }: { children: React.ReactNode }) {
  const { setViewSM } = useNavbar();
  useEffect(() => {
    setViewSM(false);
    return () => {
      setViewSM(true);
    };
  }, [setViewSM]);
  return (
    <ChatsPaneProvider>
      <main className='flex flex-grow p-6 gap-6 h-[calc(100vh-5rem)]'>
        <div className='hidden lg:block w-1/4 border-neutral-800'>
          <ChatsPane />
        </div>
        {children}
      </main>
    </ChatsPaneProvider>
  );
}
