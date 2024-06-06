'use client';
import { User } from '@/helpers/props';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { ReactNode, Suspense, createContext, useEffect, useState } from 'react';

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
  let [authTokens, setAuthTokens] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens') || '{}')
      : null,
  );

  let [tokenData, setTokenData] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens') || '{}') : null,
  );

  let [loading, setLoading] = useState(true);
  let [error, setError] = useState({});
  let [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!tokenData) {
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
    fetchMe();
  }, [tokenData]);

  let loginUser = async (data: any) => {
    localStorage.setItem('authTokens', JSON.stringify(data));
    setAuthTokens(data);
    setTokenData(jwtDecode(data?.access));
    router.push('/');
  };

  let logoutUser = () => {
    setAuthTokens(null);
    setTokenData(null);
    localStorage.removeItem('authTokens');
    router.push('/welcome');
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

  return <AuthContext.Provider value={contextData}>{loading ? <Suspense /> : children}</AuthContext.Provider>;
};
