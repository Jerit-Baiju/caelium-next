'use client';
import Loader from '@/components/Loader';
import AuthContext from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect } from 'react';

const Page = () => {
  const { loginUser } = useContext(AuthContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetch_tokens = async (auth_code: any) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/google/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: auth_code }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 403) {
            toast({
              variant: 'destructive',
              title: 'Authentication Failed',
              description: errorData.error || 'Only @mariancollege.org email addresses are allowed.',
            });
            return;
          }
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        loginUser(data);
      } catch (error) {
        console.log('Error fetching tokens:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
        });
        toast({
          variant: 'destructive',
          title: 'Authentication Error',
          description: 'An unexpected error occurred. Please try again.',
        });
      }
    };
    const auth_code = searchParams.get('code');
    auth_code && fetch_tokens(auth_code);
  }, [searchParams, toast, router, loginUser]);

  return (
    <div className='flex h-dvh items-center justify-center'>
      <Loader />
    </div>
  );
};

export default Page;
