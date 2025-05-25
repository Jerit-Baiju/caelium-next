'use client';
import Loader from '@/components/layout/Loader';
import { User } from '@/helpers/props';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { ReactNode, createContext, useEffect, useRef, useState } from 'react';

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
  user: User | null;
  refreshToken: () => Promise<any>; // <-- Expose refreshToken
}

const AuthContext = createContext<AuthContextProps>({
  tokenData: {},
  authTokens: {},
  error: {},
  loginUser: async () => {},
  logoutUser: () => {},
  setTokenData: () => {},
  setAuthTokens: () => {},
  user: null,
  refreshToken: async () => null, // <-- Provide a default implementation
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

  // Reference to track refresh timers
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Proactive token refresh
  const refreshToken = async () => {
    if (!authTokens?.refresh) return;
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/token/refresh/`, {
        refresh: authTokens.refresh,
      });
      const newTokens = {
        access: response.data.access,
        refresh: authTokens.refresh,
      };
      localStorage.setItem('authTokens', JSON.stringify(newTokens));
      setAuthTokens(newTokens);
      setTokenData(jwtDecode(response.data.access));
      scheduleTokenRefresh(response.data.access);
      return newTokens;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logoutUser();
      }
      return null;
    }
  };

  // Schedule token refresh 5 minutes before expiry
  const scheduleTokenRefresh = (accessToken: string) => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    try {
      const decoded = jwtDecode(accessToken) as { exp: number };
      const expiryTime = decoded.exp * 1000;
      const timeUntilRefresh = expiryTime - Date.now() - 300000;
      if (timeUntilRefresh <= 0) {
        refreshToken();
        return;
      }
      refreshTimerRef.current = setTimeout(refreshToken, timeUntilRefresh);
    } catch (error) {
      logoutUser();
    }
  };

  useEffect(() => {
    if (loading || !authTokens) return;
    try {
      const decodedToken: any = tokenData;
      const isExpired = decodedToken && decodedToken.exp && decodedToken.exp * 1000 < Date.now();
      if (isExpired) {
        refreshToken();
        return;
      }
      scheduleTokenRefresh(authTokens.access);
    } catch (err) {
      logoutUser();
    }
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [tokenData, loading]);

  // Route protection
  useEffect(() => {
    if (loading) return;

    const path = window.location.pathname;
    const publicPaths = ['/welcome', '/privacy-policy', '/terms-and-conditions'];
    const isCallbackPath = path.startsWith('/api/auth/callback');
    const isPublicPath = publicPaths.includes(path) || isCallbackPath;

    // Redirect logic
    if (!tokenData && !isPublicPath) {
      router.replace('/welcome');
    }
  }, [router, tokenData, loading]);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        if (!authTokens?.access) return;

        const decodedToken = jwtDecode(authTokens.access) as { user_id: string };
        if (!decodedToken.user_id) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/accounts/${decodedToken.user_id}/`);

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        logoutUser();
      }
    };

    if (authTokens) {
      fetchMe();
    }
  }, [authTokens]);

  let loginUser = async (data: any) => {
    localStorage.setItem('authTokens', JSON.stringify(data));
    setAuthTokens(data);
    setTokenData(jwtDecode(data?.access));
    scheduleTokenRefresh(data.access);
  };

  let logoutUser = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    setAuthTokens(null);
    setTokenData(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    router.push('/welcome');
  };

  useEffect(() => {
    if (authTokens?.access) {
      try {
        setTokenData(jwtDecode(authTokens.access));
      } catch (err) {
        console.error('Invalid token format:', err);
        logoutUser();
      }
    }
    setLoading(false);
  }, [authTokens]);

  let contextData: AuthContextProps = {
    tokenData,
    authTokens,
    error,
    loginUser,
    logoutUser,
    setTokenData,
    setAuthTokens,
    user,
    refreshToken,
  };

  return <AuthContext.Provider value={contextData}>{loading ? <Loader fullScreen /> : children}</AuthContext.Provider>;
};
