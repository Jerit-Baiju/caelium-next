'use client';
import Loader from '@/components/layout/Loader';
import useAxios from '@/hooks/useAxios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const Page = () => {
  const api = useAxios();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetch_tokens = async (auth_code: any) => {
      const response = await api.post(`${process.env.NEXT_PUBLIC_API_HOST}/api/gallery/update_token/`, {
        code: auth_code,
      });
      const data = await response.data;
      if (data.data === 'success') {
        router.replace('/gallery');
      }
    };
    const auth_code = searchParams?.get('code');
    if (auth_code) {
      fetch_tokens(auth_code);
    }
  }, [searchParams]);
  
  return (
    <div className='flex h-dvh items-center justify-center'>
      <Loader />
    </div>
  );
};

export default Page;
