'use client';
import Wrapper from '@/app/Wrapper';
import ChatsPane from '@/components/chats/ChatsPane';
import { ChatsPaneProvider } from '@/contexts/ChatsPaneContext';

export default function ChatsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Wrapper navSM={false}>
      <ChatsPaneProvider>
        <main className='flex flex-grow p-6 gap-6 h-[calc(100vh-5rem)]'>
          <div className='hidden lg:block w-1/4 border-neutral-800'>
            <ChatsPane />
          </div>
          {children}
        </main>
      </ChatsPaneProvider>
    </Wrapper>
  );
}
