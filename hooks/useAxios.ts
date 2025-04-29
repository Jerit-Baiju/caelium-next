import AuthContext from '@/contexts/AuthContext';
import axios from 'axios';
import { useContext } from 'react';

const baseURL = process.env.NEXT_PUBLIC_API_HOST;

const useAxios = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const axiosInstance = axios.create({
    baseURL,
  });

  axiosInstance.interceptors.request.use((request) => {
    if (authTokens?.access) {
      request.headers.Authorization = `Bearer ${authTokens.access}`;
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
    }
  );

  return axiosInstance;
};

export default useAxios;
