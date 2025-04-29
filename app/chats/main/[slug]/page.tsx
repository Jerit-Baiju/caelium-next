'use client';
import ChatPageContent from '@/components/chats/ChatPageContent';
import { ChatProvider } from '@/contexts/ChatContext';
import { useNavbar } from '@/contexts/NavContext';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Page = (props: { params: Promise<{ slug?: number }> }) => {
  const searchParams = useSearchParams();
  const [slug, setSlug] = useState<number | null>(null);
  const { setViewSM } = useNavbar();
  const params = React.use(props.params);

  useEffect(() => {
    // Try to get slug from unwrapped params or from the URL
    let resolvedSlug: number | null = null;
    if (params && params.slug) {
      const parsed = Number(params.slug);
      if (!isNaN(parsed) && parsed > 0) resolvedSlug = parsed;
    } else {
      // fallback: try to get from URL if not in params
      const urlSlug = searchParams.get('slug');
      if (urlSlug) {
        const parsed = Number(urlSlug);
        if (!isNaN(parsed) && parsed > 0) resolvedSlug = parsed;
      }
    }
    setSlug(resolvedSlug);
  }, [params, searchParams]);

  useEffect(() => {
    setViewSM(false);
    return () => {
      setViewSM(true);
    };
  }, [setViewSM]);

  if (slug === null) return <div>Loading chat...</div>;
  if (isNaN(slug) || slug <= 0) return <div>Invalid chat ID.</div>;

  return (
    <ChatProvider chatId={slug}>
      <ChatPageContent />
    </ChatProvider>
  );
};

export default Page;
