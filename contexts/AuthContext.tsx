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

  // Check token expiration
  useEffect(() => {
    // Skip if we're still loading or no tokens exist
    if (loading || !authTokens) return;
    
    try {
      const decodedToken: any = tokenData;
      
      // Check if token is expired
      const isTokenExpired = decodedToken && decodedToken.exp && 
        decodedToken.exp * 1000 < Date.now();
      
      if (isTokenExpired) {
        console.log("Token expired, logging out");
        logoutUser();
        return;
      }
    } catch (err) {
      console.error("Error checking token expiration:", err);
      logoutUser();
    }
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
      console.log("No auth token, redirecting to welcome");
      router.replace('/welcome');
    }
  }, [router, tokenData, loading]);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        if (!authTokens?.access) return;
        
        const decodedToken = jwtDecode(authTokens.access) as { user_id: string };
        if (!decodedToken.user_id) return;
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api/auth/accounts/${decodedToken.user_id}/`,
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
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
  };

  let logoutUser = () => {
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
        console.error("Invalid token format:", err);
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
