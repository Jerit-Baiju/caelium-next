'use client';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { ReactNode, createContext, useEffect, useState } from 'react';

interface childrenProps {
  children: ReactNode;
}

interface AuthContextProps {
  user: any;
  authTokens: any;
  error: string;
  loginUser: (e: any, username: string, password: string) => Promise<void>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  authTokens: null,
  error: '',
  loginUser: () => {},
  logoutUser: () => {},
});

export default AuthContext;

export const AuthProvider = ({ children }: childrenProps) => {
  let [authTokens, setAuthTokens] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens') || '{}') : null
  );

  let [user, setUser] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens') || '') : null
  );
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState('');

  const router = useRouter();

  let loginUser = async (e: any, username: string, password: string) => {
    e.preventDefault();
    let url = 'http://127.0.0.1:8000/api/auth/token/';
    console.log(url);
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, password: password }),
    });
    let data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(data.access);
      localStorage.setItem('authTokens', JSON.stringify(data));
      router.push('/');
    } else {
      setError('Something went wrong!');
    }
  };

  let logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    router.push('/accounts/login');
  };

  let updateToken = async () => {
    let url = 'http://127.0.0.1:8000/api/auth/token/refresh/';
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: authTokens?.refresh}),
    });

    let data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem('authTokens', JSON.stringify(data));
    } else {
      logoutUser();
    }

    if (loading) {
      setLoading(false);
    }
  };

  let contextData: AuthContextProps = {
    user: user,
    authTokens: authTokens,
    error: error,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  useEffect(() => {
    if (loading) {
      updateToken();
    }

    let fourMinutes = 1000 * 60 * 4;

    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return <AuthContext.Provider value={contextData}>{loading ? null : children}</AuthContext.Provider>;
};
