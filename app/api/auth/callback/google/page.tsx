'use client';
import Loader from '@/components/Loader';
import AuthContext from '@/contexts/AuthContext';
import { useSearchParams } from 'next/navigation';
import { useContext, useEffect } from 'react';

const page = () => {
  const { loginUser } = useContext(AuthContext);
  const searchParams = useSearchParams();
  useEffect(() => {
    const fetch_tokens = async (auth_code: any) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/google/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: auth_code }),
      });
      const data = await response.json();
      loginUser(data);
    };
    const auth_code = searchParams.get('code');
    fetch_tokens(auth_code);
  }, [searchParams]);
  return (
    <div className='flex h-dvh items-center justify-center'>
      <Loader />
    </div>
  );
};

export default page;
