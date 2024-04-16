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
  registerUser: (e: any) => Promise<void>;
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
  registerUser: async () => {},
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/auth/accounts/${(jwtDecode(authTokens.access) as { id: string }).id}/`,
      );
      const userData = await response.json();
      setUser(userData);
    };
    fetchMe();
  }, [tokenData]);

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
        setTokenData(jwtDecode(data.access));
        router.push('/');
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
    setTokenData(null);
    localStorage.removeItem('authTokens');
    router.push('/welcome');
  };

  useEffect(() => {
    if (authTokens) {
      setTokenData(jwtDecode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  let contextData: AuthContextProps = {
    tokenData,
    authTokens,
    error,
    loginUser,
    registerUser,
    logoutUser,
    setTokenData,
    setAuthTokens,
    user,
  };

  return <AuthContext.Provider value={contextData}>{loading ? <Suspense /> : children}</AuthContext.Provider>;
};
