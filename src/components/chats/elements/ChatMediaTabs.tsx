import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Message } from '@/helpers/props';
import { getURL } from '@/helpers/utils';
import useAxios from '@/hooks/useAxios';
import { useEffect, useState } from 'react';
import { BsFileEarmark, BsFiles, BsFilm, BsImages, BsMusicNote } from 'react-icons/bs';

interface ChatMediaTabsProps {
  chatId: number;
}

const ChatMediaTabs = ({ chatId }: ChatMediaTabsProps) => {
  const axios = useAxios();
  const [media, setMedia] = useState<{
    images: Message[];
    videos: Message[];
    audios: Message[];
    documents: Message[];
  } | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await axios.get(`/api/chats/${chatId}/media/`);
        setMedia(response.data);
      } catch (error) {
        console.log('Error fetching media:', error);
      }
    };
    if (chatId) {
      fetchMedia();
    }
  }, [chatId]);

  if (!media) return null;

  const EmptyState = ({ type }: { type: string }) => (
    <div className='flex flex-col items-center justify-center p-8 text-center text-neutral-500'>
      {type === 'images' && <BsImages className='text-7xl mb-2' />}
      {type === 'videos' && <BsFilm className='text-7xl mb-2' />}
      {type === 'audios' && <BsMusicNote className='text-7xl mb-2' />}
      {type === 'documents' && <BsFiles className='text-7xl mb-2' />}
      <p>No {type} found in this chat</p>
    </div>
  );

  return (
    <>
      <Tabs defaultValue='images' className='w-full'>
        <TabsList className='w-full justify-center'>
          <TabsTrigger value='images'>Photos ({media.images.length})</TabsTrigger>
          <TabsTrigger value='videos'>Videos ({media.videos.length})</TabsTrigger>
          <TabsTrigger value='audios'>Audio ({media.audios.length})</TabsTrigger>
          <TabsTrigger value='documents'>Docs ({media.documents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value='images' className='mt-4'>
          {media.images.length > 0 ? (
            <div className='grid grid-cols-3 gap-2'>
              {media.images.map((message) => (
                <div key={message.id} className='aspect-square'>
                  <img src={getURL(message.file || '')} alt='' className='w-full h-full object-cover rounded-lg' />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState type='images' />
          )}
        </TabsContent>

        <TabsContent value='videos' className='mt-4'>
          {media.videos.length > 0 ? (
            <div className='grid grid-cols-3 gap-2'>
              {media.videos.map((message) => (
                <div key={message.id} className='aspect-square'>
                  <video src={getURL(message.file || '')} className='w-full h-full object-cover rounded-lg' />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState type='videos' />
          )}
        </TabsContent>

        <TabsContent value='audios' className='mt-4'>
          {media.audios.length > 0 ? (
            <div className='space-y-2'>
              {media.audios.map((message) => (
                <div key={message.id} className='p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg'>
                  <audio src={getURL(message.file || '')} controls className='w-full' />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState type='audios' />
          )}
        </TabsContent>

        <TabsContent value='documents' className='mt-4'>
          {media.documents.length > 0 ? (
            <div className='space-y-2'>
              {media.documents.map((message) => (
                <a
                  key={message.id}
                  href={getURL(message.file || '')}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700'>
                  <BsFileEarmark className='text-2xl mr-3' />
                  <span className='flex-1 truncate'>{message.file_name || 'Document'}</span>
                </a>
              ))}
            </div>
          ) : (
            <EmptyState type='documents' />
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ChatMediaTabs;
