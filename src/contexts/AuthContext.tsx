'use client';
import { User } from '@/helpers/props';
import axios from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, Suspense, useEffect, useRef, useState } from 'react';

interface TokenData {
  access: string;
  refresh: string;
  exp?: number;
  user_id?: string;
}

interface AuthContextProps {
  tokenData?: TokenData | JwtPayload | null;
  authTokens: TokenData | null;
  loginUser: (e: TokenData) => Promise<void>;
  logoutUser: () => void;
  setTokenData: (e: TokenData) => void;
  setAuthTokens: (e: TokenData) => void;
  user: User | null;
  refreshToken: () => Promise<TokenData | null>;
}

const AuthContext = createContext<AuthContextProps>({
  tokenData: null,
  authTokens: null,
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
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authTokens, setAuthTokens] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens') || '{}') : null
  );

  const [tokenData, setTokenData] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens') || '{}') : null
  );

  // Reference to track refresh timers
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Proactive token refresh
  const refreshToken = async () => {
    if (!authTokens?.refresh) return null; // <-- Always return null, not undefined
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
      console.error('Error scheduling token refresh:', error);
    }
  };

  useEffect(() => {
    if (loading || !authTokens) return;
    try {
      const decodedToken = tokenData;
      const isExpired = decodedToken && decodedToken.exp && decodedToken.exp * 1000 < Date.now();
      if (isExpired) {
        refreshToken();
        return;
      }
      scheduleTokenRefresh(authTokens.access);
    } catch (err) {
      logoutUser();
      console.error('Error decoding token:', err);
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
    const publicPaths = ['/welcome', '/privacy-policy', '/terms-and-conditions', '/community/invite'];
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

  const loginUser = async (data: TokenData) => {
    localStorage.setItem('authTokens', JSON.stringify(data));
    setAuthTokens(data);
    setTokenData(jwtDecode(data?.access));
    scheduleTokenRefresh(data.access);
  };

  const logoutUser = () => {
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

  const contextData: AuthContextProps = {
    tokenData,
    authTokens,
    loginUser,
    logoutUser,
    setTokenData,
    setAuthTokens,
    user,
    refreshToken,
  };

  return <AuthContext.Provider value={contextData}>{loading ? <Suspense /> : children}</AuthContext.Provider>;
};
