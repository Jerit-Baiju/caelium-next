'use client';
import Loader from '@/components/layout/Loader';
import { User } from '@/helpers/props';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { ReactNode, createContext, useEffect, useState } from 'react';

interface ErrorObject {
  [key: string]: string;
}

interface AuthContextProps {
  tokenData?: any;
  authTokens: any;
  error: ErrorObject;
  loginUser: (e: any) => Promise<void>;
  logoutUser: () => void;
  setTokenData: (e: any) => void;
  setAuthTokens: (e: any) => void;
  user: any;
}

const AuthContext = createContext<AuthContextProps>({
  tokenData: {},
  authTokens: {},
  error: {},
  loginUser: async () => {},
  logoutUser: () => {},
  setTokenData: () => {},
  setAuthTokens: () => {},
  user: {},
});

export default AuthContext;
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState({});
  let [user, setUser] = useState<User | null>(null);
  let [authTokens, setAuthTokens] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens') || '{}')
      : null,
  );

  let [tokenData, setTokenData] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens') || '{}') : null,
  );

  useEffect(() => {
    if (loading) return;
    
    const path = window.location.pathname;
    
    // Don't redirect if we have tokens or we're on certain public pages
    if (!tokenData && 
        path !== '/welcome' && 
        path !== '/privacy-policy' && 
        path !== '/terms-and-conditions' && 
        !path.startsWith('/api/auth/callback')) {
      router.replace('/welcome');
    }
  }, [router, tokenData, loading]);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api/auth/accounts/${(jwtDecode(authTokens?.access) as { user_id: string }).user_id}/`,
        );
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error(error);
      }
    };
    authTokens ? fetchMe() : null;
  }, [tokenData]);

  let loginUser = async (data: any) => {
    localStorage.setItem('authTokens', JSON.stringify(data));
    setAuthTokens(data);
    setTokenData(jwtDecode(data?.access));
  };

  let logoutUser = () => {
    setAuthTokens(null);
    setTokenData(null);
    localStorage.removeItem('authTokens');
    router.push('/landing');
  };

  useEffect(() => {
    if (authTokens?.access) {
      setTokenData(jwtDecode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  let contextData: AuthContextProps = {
    tokenData,
    authTokens,
    error,
    loginUser,
    logoutUser,
    setTokenData,
    setAuthTokens,
    user,
  };

  return <AuthContext.Provider value={contextData}>{loading ? <Loader fullScreen /> : children}</AuthContext.Provider>;
};
