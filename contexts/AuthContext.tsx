'use client';
import { User } from '@/helpers/props';
import { jwtDecode } from 'jwt-decode';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, Suspense, createContext, useEffect, useState } from 'react';

interface ErrorObject {
  [key: string]: string;
}

interface AuthContextProps {
  authTokens: any;
  error: ErrorObject;

  logoutUser: () => void;
  setAuthTokens: (e: any) => void;
  user: any;
}

const AuthContext = createContext<AuthContextProps>({
  authTokens: {},
  error: {},
  logoutUser: () => {},
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

  let [loading, setLoading] = useState(true);
  let [error, setError] = useState({});
  let [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  const session = useSession();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api/auth/accounts/${jwtDecode<{ user_id: string }>(authTokens?.access).user_id}/`,
        );
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMe();
  }, [authTokens]);

  useEffect(() => {
    localStorage.setItem('authTokens', JSON.stringify({ access: session.data?.accessToken, refresh: session.data?.refreshToken }));
  }, [session]);

  let logoutUser = () => {
    setAuthTokens(null);
    localStorage.removeItem('authTokens');
    router.push('/welcome');
  };

  let contextData: AuthContextProps = {
    authTokens,
    error,
    logoutUser,
    setAuthTokens,
    user,
  };

  return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};
