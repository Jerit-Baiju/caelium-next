'use client';
import Wrapper from '@/app/Wrapper';
import AuthContext from '@/contexts/AuthContext';
import { BaseError, Craft } from '@/helpers/props';
import { formatDate, getUrl } from '@/helpers/support';
import axios, { AxiosError } from 'axios';
import { useContext, useEffect, useState } from 'react';

const CraftRead = ({ params }: { params: { slug: Number } }) => {
  const { authTokens } = useContext(AuthContext);
  let [error, setError] = useState<BaseError | null>(null);
  let [craft, setCraft] = useState<Craft | null>(null);

  useEffect(() => {
    const fetchCraft = async () => {
      try {
        const response = await axios.request(getUrl({ url: `/api/crafts/${params.slug}/`, token: authTokens?.access }));
        setCraft(response.data);
      } catch (error) {
        if (error instanceof AxiosError && error.code === 'ERR_BAD_REQUEST')
          setError({ text: 'Failed to fetch messages', code: 'FETCH_MESSAGES_FAILED' });
        console.error('Error fetching data:', error);
      }
    };
    fetchCraft();
  }, []);
  const paragraphs = craft?.content.split('\n');
  return (
    <Wrapper>
      <div className='min-h-screen m-4 md:mx-56 flex flex-grow flex-col'>
        <div className='bg-black text-white py-8 text-center'>
          <h1 className='text-4xl font-bold'>{craft?.title}</h1>
          <p className='text-lg'>{craft?.tag}</p>
        </div>
        <div className='container mx-auto flex-1 pb-8'>
          <div className='max-w-3xl mx-auto'>
            <article className='mb-8'>
              <img src={craft?.banner} alt='Banner' className='w-auto mb-4 rounded-lg h-96 mx-auto' />
              <h2 className='text-2xl font-bold mb-2'>{craft?.title}</h2>
              <p className='text-neutral-500 mb-4'>
                {formatDate(craft?.date)} • {craft?.time}
              </p>
              {paragraphs?.map((paragraph, index) => (
                <p key={index} className='leading-relaxed my-4 text-lg'>
                  {paragraph}
                </p>
              ))}
            </article>
            <div className='flex items-center justify-end pe-10'>
              <img src={craft?.owner.avatar} alt='User Avatar' className='w-10 h-10 rounded-full mr-4' />
              <div>
                <p className='font-bold'>{craft?.owner.name}</p>
                <p className='text-sm'>{craft?.owner.username}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default CraftRead;
