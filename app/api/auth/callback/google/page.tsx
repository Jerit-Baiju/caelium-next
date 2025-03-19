'use client';
import Loader from '@/components/Loader';
import AuthContext from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

const Page = () => {
  const { loginUser } = useContext(AuthContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Prevent double execution
    if (isProcessing || isSuccess) return;

    const fetch_tokens = async (auth_code: string) => {
      try {
        setIsProcessing(true);
        
        console.log("Fetching tokens with code:", auth_code);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/google/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: auth_code }),
        });
        
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          
          if (response.status === 403) {
            toast({
              variant: 'destructive',
              title: 'Authentication Failed',
              description: errorData.error || 'Only @mariancollege.org email addresses are allowed.',
            });
          } else {
            toast({
              variant: 'destructive',
              title: 'Authentication Error',
              description: 'An unexpected error occurred. Please try again.',
            });
          }
          
          setTimeout(() => {
            router.push('/welcome');
          }, 1500);
          return;
        }

        const data = await response.json();
        console.log("Authentication successful, logging in user");
        
        // Store tokens first before calling loginUser
        localStorage.setItem('authTokens', JSON.stringify(data));
        
        // Mark as success to prevent re-execution
        setIsSuccess(true);
        
        // Call loginUser and navigate manually to ensure proper redirection
        await loginUser(data);
        
        // Force navigation to home after a small delay
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 1000);
        
      } catch (error) {
        console.error('Error fetching tokens:', error);
        
        toast({
          variant: 'destructive',
          title: 'Authentication Error',
          description: 'An unexpected error occurred. Please try again.',
        });
        
        setTimeout(() => {
          router.push('/welcome');
        }, 1500);
      } finally {
        setIsProcessing(false);
      }
    };
    
    const auth_code = searchParams.get('code');
    if (auth_code) {
      fetch_tokens(auth_code);
    } else {
      router.push('/welcome');
    }
  }, [searchParams, toast, router, loginUser, isProcessing, isSuccess]);

  return (
    <div className='flex h-dvh items-center justify-center'>
      <Loader />
    </div>
  );
};

export default Page;
