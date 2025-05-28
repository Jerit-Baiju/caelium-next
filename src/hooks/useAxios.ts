import AuthContext from '@/contexts/AuthContext';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useContext } from 'react';

const baseURL = process.env.NEXT_PUBLIC_API_HOST;

const useAxios = () => {
  const { authTokens, logoutUser, refreshToken } = useContext(AuthContext);
  const axiosInstance = axios.create({
    baseURL,
  });

  axiosInstance.interceptors.request.use(async (request) => {
    if (authTokens?.access) {
      // Check if token is expired or about to expire (within 1 minute)
      try {
        const decoded: { exp: number } = jwtDecode(authTokens.access);
        const expiry = decoded.exp * 1000;
        if (expiry - Date.now() < 60000) {
          // Token is expired or about to expire, refresh it
          const newTokens = await refreshToken();
          if (newTokens?.access) {
            request.headers.Authorization = `Bearer ${newTokens.access}`;
          } else {
            // If refresh failed, logout
            logoutUser();
            return Promise.reject('Session expired');
          }
        } else {
          request.headers.Authorization = `Bearer ${authTokens.access}`;
        }
      } catch (err) {
        logoutUser();
        console.error('Error decoding token:', err);
        return Promise.reject('Invalid token');
      }
    }
    return request;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        console.log('[Axios] 401 detected, logging out at', new Date().toLocaleTimeString());
        logoutUser();
      }
      return Promise.reject(error);
    },
  );

  return axiosInstance;
};

export default useAxios;
