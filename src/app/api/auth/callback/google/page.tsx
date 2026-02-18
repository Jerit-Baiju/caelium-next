'use client';
import Loader from '@/components/layout/Loader';
import AuthContext from '@/contexts/AuthContext';
import { useNavbar } from '@/contexts/NavContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useRef } from 'react';

const CALLBACK_SESSION_KEY = 'google_oauth_processing';

const Page = () => {
  const { loginUser } = useContext(AuthContext);
  const loginUserRef = useRef(loginUser);
  loginUserRef.current = loginUser;

  const { setShowNav } = useNavbar();
  const searchParams = useSearchParams();

  // Hide navbar and sidebar on mount, restore on unmount
  useEffect(() => {
    setShowNav(false);
    return () => {
      setShowNav(true);
    };
  }, [setShowNav]);

  useEffect(() => {
    if (!searchParams) return;
    const auth_code = searchParams.get('code');
    if (!auth_code) {
      window.location.href = '/welcome';
      return;
    }

    // Use sessionStorage to deduplicate across React Strict Mode remounts.
    // The key includes the auth_code so each unique code is only processed once.
    const sessionKey = `${CALLBACK_SESSION_KEY}_${auth_code}`;
    if (sessionStorage.getItem(sessionKey)) return;
    sessionStorage.setItem(sessionKey, '1');

    const fetch_tokens = async () => {
      try {
        console.log("Fetching tokens with code:", auth_code);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/google/login/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: auth_code }),
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          let errorData = { error: 'Unknown error occurred' };
          try {
            const errorText = await response.text();
            console.log("Raw error response:", errorText);
            if (errorText) {
              try {
                errorData = JSON.parse(errorText);
              } catch {
                errorData = { error: errorText || 'Invalid response format' };
              }
            }
          } catch (parseError) {
            console.error("Error reading response:", parseError);
          }

          console.error("Auth error:", errorData);
          sessionStorage.removeItem(sessionKey);
          window.location.href = '/welcome';
          return;
        }

        const data = await response.json();
        console.log("Authentication successful, logging in user");

        // Write tokens to localStorage synchronously via loginUser
        await loginUserRef.current(data);

        console.log("Login successful, redirecting to home...");
        window.location.href = '/';

      } catch (error) {
        console.error('Error fetching tokens:', error);
        sessionStorage.removeItem(sessionKey);
        window.location.href = '/welcome';
      }
    };

    fetch_tokens();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className='flex h-dvh items-center justify-center'>
      <Loader />
    </div>
  );
};

export default Page;
