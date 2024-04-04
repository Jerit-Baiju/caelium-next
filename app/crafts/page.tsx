'use client';
import AuthContext from '@/contexts/AuthContext';
import { BaseError, Craft } from '@/helpers/props';
import { formatDate, getUrl } from '@/helpers/support';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import Wrapper from '../Wrapper';

const CraftsHome = () => {
  const { authTokens } = useContext(AuthContext);
  let [crafts, setCrafts] = useState<Craft[]|null>(null);
  const [error, setError] = useState<BaseError | null>(null);
  useEffect(() => {
    const fetchCrafts = async () => {
      try {
        const response = await axios.request(getUrl({ url: `/api/crafts/`, token: authTokens?.access }));
        setCrafts(response.data);
      } catch (error) {
        if (error instanceof AxiosError && error.code === 'ERR_BAD_REQUEST')
          setError({ text: 'Failed to fetch messages', code: 'FETCH_MESSAGES_FAILED' });
        console.error('Error fetching data:', error);
      }
    };
    fetchCrafts();
  }, []);
  return (
    <Wrapper>
      <div className='flex-grow'>
        <h1 className='text-4xl text-center font-bold m-4'>Crafts</h1> {/* Heading added here */}
        <div className='mx-4 md:mb-24 max-sm:m-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {crafts?.map((craft: Craft) => (
            <Link href={`/crafts/get/${craft.id}`}>
              <div className='dark:bg-neutral-800 h-min rounded-lg shadow-md overflow-hidden' key={craft.id}>
                <img src={craft.banner} alt={craft.title} className='w-full h-52 object-cover' />
                <div className='p-6'>
                  <p className='uppercase text-xs text-neutral-300 mb-2'>{craft.tag}</p>
                  <h2 className='text-2xl font-bold mb-2'>{craft.title}</h2>
                  <p className='text-neutral-200 line-clamp-2 mb-4'>{craft.content}</p>
                  <span className='text-neutral-300'>{formatDate(craft?.date)}</span>
                  <span className='text-neutral-300 mx-2'>•</span>
                  <span className='text-neutral-300'>{craft.time}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default CraftsHome;