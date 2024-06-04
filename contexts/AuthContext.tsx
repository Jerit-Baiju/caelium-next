'use client';
import { User } from '@/helpers/props';
import { jwtDecode } from 'jwt-decode';
import { signOut, useSession } from 'next-auth/react';
import { ReactNode, Suspense, createContext, useEffect, useState } from 'react';

interface AuthContextProps {
  authTokens: any;
  logoutUser: () => void;
  setAuthTokens: (e: any) => void;
  user: any;
}

const AuthContext = createContext<AuthContextProps>({
  authTokens: {},
  logoutUser: () => {},
  setAuthTokens: () => {},
  user: {},
});

export default AuthContext;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const session = useSession();
  let [loading, setLoading] = useState(true);
  let [user, setUser] = useState<User | null>(null);
  let [authTokens, setAuthTokens] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens') || '{}')
      : null,
  );

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
    setLoading(false);
  }, [authTokens]);

  useEffect(() => {
    localStorage.setItem('authTokens', JSON.stringify({ access: session.data?.accessToken, refresh: session.data?.refreshToken }));
  }, [session]);

  let logoutUser = () => {
    setAuthTokens(null);
    localStorage.removeItem('authTokens');
    signOut();
  };

  let contextData: AuthContextProps = {
    authTokens,
    logoutUser,
    setAuthTokens,
    user,
  };

  return <AuthContext.Provider value={contextData}>{loading ? <Suspense /> : children}</AuthContext.Provider>;
};
