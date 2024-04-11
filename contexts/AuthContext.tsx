'use client';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { ReactNode, Suspense, createContext, useEffect, useState } from 'react';

interface ErrorObject {
  [key: string]: string;
}

interface AuthContextProps {
  user?: any;
  authTokens: any;
  error: ErrorObject;
  loginUser: (e: any) => Promise<void>;
  registerUser: (e: any) => Promise<void>;
  logoutUser: () => void;
  setUser: (e: any) => void;
  setAuthTokens: (e: any) => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: {},
  authTokens: {},
  error: {},
  loginUser: async () => {},
  registerUser: async () => {},
  logoutUser: () => {},
  setUser: () => {},
  setAuthTokens: () => {},
});

export default AuthContext;
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  let [authTokens, setAuthTokens] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens') || '{}')
      : null,
  );

  let [user, setUser] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens') || '{}') : null,
  );

  let [loading, setLoading] = useState(true);
  let [error, setError] = useState({});

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/welcome');
    }
  }, [router, user, loading]);

  let loginUser = async (e: any) => {
    e.preventDefault();
    let username = e.target.username.value;
    let password = e.target.password.value;
    if (username && password) {
      let url = process.env.NEXT_PUBLIC_API_HOST + '/api/auth/token/';
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
      });
      let data = await response.json();

      if (response.status === 200) {
        localStorage.setItem('authTokens', JSON.stringify(data));
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        router.prefetch('/');
      } else {
        setError(data);
      }
    } else {
      setError('Enter your username and password !');
    }
  };

  let registerUser = async (e: any) => {
    e.preventDefault();
    let username = e.target.username.value;
    let name = e.target.name.value;
    let password = e.target.password.value;
    let password2 = e.target.password2.value;
    let errors: ErrorObject = {};
    username.length <= 3 && (errors.username = 'Ensure this field has at least 4 characters.');
    !username && (errors.username = 'This field may not be blank');
    !name && (errors.name = 'This field may not be blank');
    password != password2 && (errors.password = "Password fields didn't match.");
    !password && (errors.password = 'This field may not be blank');
    !password2 && (errors.password2 = 'This field may not be blank');
    setError(errors);
    if (username && name && password == password2) {
      let url = process.env.NEXT_PUBLIC_API_HOST + '/api/auth/register/';
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          name: name,
          password: password,
          password2: password2,
        }),
      });
      let data = await response.json();
      if (response.status === 201) {
        router.push('/accounts/login');
      } else {
        setError(data);
      }
    }
  };

  let logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    router.push('/welcome');
  };


  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  let contextData: AuthContextProps = {
    user,
    authTokens,
    error,
    loginUser,
    registerUser,
    logoutUser,
    setUser,
    setAuthTokens
  };

  return <AuthContext.Provider value={contextData}>{loading ? <Suspense /> : children}</AuthContext.Provider>;
};
