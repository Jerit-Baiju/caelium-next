'use client';
import ChatPageContent from '@/components/chats/ChatPageContent';
import { ChatProvider } from '@/contexts/ChatContext';
import { useNavbar } from '@/contexts/NavContext';
import { use, useEffect } from 'react';

const Page = (props: { params: Promise<{ slug: number }> }) => {
  const params = use(props.params);

  const { setViewSM } = useNavbar();
  useEffect(() => {
    setViewSM(false);
    return () => {
      setViewSM(true);
    };
  }, [setViewSM]);

  return (
    <ChatProvider chatId={params.slug}>
      <ChatPageContent />
    </ChatProvider>
  );
};

export default Page;
