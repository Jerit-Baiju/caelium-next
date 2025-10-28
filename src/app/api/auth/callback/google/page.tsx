'use client';
import Loader from '@/components/layout/Loader';
import AuthContext from '@/contexts/AuthContext';
import { useNavbar } from '@/contexts/NavContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';

const Page = () => {
  const { loginUser } = useContext(AuthContext);
  const { setShowNav } = useNavbar();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const processingAttempted = useRef(false);

  // Hide navbar and sidebar on mount, restore on unmount
  useEffect(() => {
    setShowNav(false);
    
    return () => {
      setShowNav(true);
    };
  }, [setShowNav]);

  useEffect(() => {
    // Prevent double execution or processing after errors
    if (isProcessing || isSuccess || isError || processingAttempted.current) return;

    if (!searchParams) return;
    const auth_code = searchParams.get('code');
    if (!auth_code) {
      // No auth code, redirect to welcome
      window.location.href = '/welcome';
      return;
    }

    const fetch_tokens = async (auth_code: string) => {
      try {
        setIsProcessing(true);
        processingAttempted.current = true;
        
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
          let errorData = { error: 'Unknown error occurred' };
          try {
            // Try to parse the response as JSON
            const errorText = await response.text();
            console.log("Raw error response:", errorText);
            
            // Only try to parse as JSON if we have content
            if (errorText) {
              try {
                errorData = JSON.parse(errorText);
              } catch (jsonError) {
                console.error("Error parsing JSON:", jsonError);
                errorData = { error: errorText || 'Invalid response format' };
              }
            }
          } catch (parseError) {
            console.error("Error reading response:", parseError);
          }
          
          console.log("Error response data:", errorData);
          
          if (response.status === 403) {
            console.log({
              variant: 'destructive',
              title: 'Authentication Failed',
              description: errorData.error 
            });
          } else {
            console.log({
              variant: 'destructive',
              title: 'Authentication Error',
              description: `Error ${response.status}: ${errorData.error || 'An unexpected error occurred. Please try again.'}`,
            });
          }
          
          setIsError(true);
          window.location.href = '/welcome';
          return;
        }

        const data = await response.json();
        console.log("Authentication successful, logging in user");
        
        // Mark as success to prevent re-execution
        setIsSuccess(true);
        
        // Call loginUser which will set tokens and auth state
        await loginUser(data);
        
        console.log("Login successful, redirecting to home...");
        
        // Use window.location.href for a hard redirect to ensure clean navigation
        // This is more reliable than router.push() for OAuth callbacks
        window.location.href = '/';
        
      } catch (error) {
        console.error('Error fetching tokens:', error);
        
        console.log({
          variant: 'destructive',
          title: 'Authentication Error',
          description: 'An unexpected error occurred. Please try again.',
        });
        
        setIsError(true);
        window.location.href = '/welcome';
      } finally {
        setIsProcessing(false);
      }
    };
    
    fetch_tokens(auth_code);
  }, [searchParams, router, loginUser, isProcessing, isSuccess, isError]);

  return (
    <div className='flex h-dvh items-center justify-center'>
      <Loader />
    </div>
  );
};

export default Page;
