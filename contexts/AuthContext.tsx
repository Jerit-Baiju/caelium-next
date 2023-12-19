'use client';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { ReactNode, createContext, useEffect, useState } from 'react';

interface childrenProps {
  children: ReactNode;
}

const AuthContext = createContext('');

export default AuthContext;

export const AuthProvider = ({ children }: childrenProps) => {
  let [authTokens, setAuthTokens] = useState(() => (localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null));
  let [user, setUser] = useState(() => (localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null));
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState('');

  const router = useRouter();

  let loginUser = async (e: any) => {
    console.log('ltr');
    e.preventDefault();
    let response = await fetch('http://127.0.0.1:8000/api/auth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: e.target.username.value, password: e.target.password.value }),
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
    router.push('/login');
  };

  let updateToken = async () => {
    let response = await fetch('http://127.0.0.1:8000/api/auth/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: authTokens?.refresh }),
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

  let contextData = {
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
