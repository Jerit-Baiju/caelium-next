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

  // Reference to track refresh timers
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Proactive token refresh
  const refreshToken = async () => {
    if (!authTokens?.refresh) return;

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/token/refresh/`, {
        refresh: authTokens.refresh,
      });

      localStorage.setItem('authTokens', JSON.stringify(response.data));
      setAuthTokens(response.data);
      setTokenData(jwtDecode(response.data.access));

      // Schedule next refresh
      scheduleTokenRefresh(response.data.access);

      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Only logout if it's a 401 unauthorized
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logoutUser();
      }
      return null;
    }
  };

  // Schedule token refresh before it expires
  const scheduleTokenRefresh = (accessToken: string) => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    try {
      const decoded = jwtDecode(accessToken) as { exp: number };
      const expiryTime = decoded.exp * 1000; // Convert to milliseconds

      // Refresh 5 minutes before expiry
      const timeUntilRefresh = expiryTime - Date.now() - 5 * 60 * 1000;

      if (timeUntilRefresh <= 0) {
        // Token is already expired or about to expire, refresh now
        refreshToken();
        return;
      }

      console.log(`Scheduling token refresh in ${Math.floor(timeUntilRefresh / 60000)} minutes`);
      refreshTimerRef.current = setTimeout(refreshToken, timeUntilRefresh);
    } catch (error) {
      console.error('Failed to schedule token refresh:', error);
    }
  };

  // Check token expiration
  useEffect(() => {
    // Skip if we're still loading or no tokens exist
    if (loading || !authTokens) return;

    try {
      const decodedToken: any = tokenData;

      // Check if token is expired
      const isExpired = decodedToken && decodedToken.exp && decodedToken.exp * 1000 < Date.now();

      if (isExpired) {
        console.log('Token expired, attempting refresh');
        refreshToken();
        return;
      }

      // Schedule refresh for non-expired token
      scheduleTokenRefresh(authTokens.access);
    } catch (err) {
      console.error('Error checking token expiration:', err);
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
      console.log('No auth token, redirecting to welcome');
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

    // Schedule refresh when logging in
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
  };

  return <AuthContext.Provider value={contextData}>{loading ? <Loader fullScreen /> : children}</AuthContext.Provider>;
};
