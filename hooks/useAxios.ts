import AuthContext from '@/contexts/AuthContext';
import axios from 'axios';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import { useContext } from 'react';

const baseURL = process.env.NEXT_PUBLIC_API_HOST;

// Track if a refresh is in progress to prevent multiple simultaneous refresh requests
let isRefreshingToken = false;
let refreshPromise: Promise<any> | null = null;

const useAxios = () => {
  const { authTokens, setTokenData, setAuthTokens, logoutUser } = useContext(AuthContext);
  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: authTokens?.access ? `Bearer ${authTokens.access}` : '' },
  });
  
  axiosInstance.interceptors.request.use(async (request) => {
    if (!authTokens?.access) {
      return request;
    }
    
    try {
      const user = jwtDecode(authTokens.access);
      // Add a buffer of 60 seconds to refresh before actual expiration
      const isExpired = dayjs.unix(Number(user.exp)).diff(dayjs()) < 60000;
      
      if (!isExpired) return request;
      
      // If we're already refreshing, wait for that to complete
      if (isRefreshingToken && refreshPromise) {
        try {
          const newTokens = await refreshPromise;
          request.headers.Authorization = `Bearer ${newTokens.access}`;
          return request;
        } catch (error) {
          // If waiting on the existing refresh fails, we'll try again below
          console.log('Waiting for refresh failed, attempting new refresh');
        }
      }
      
      // Start a new refresh process
      isRefreshingToken = true;
      refreshPromise = axios.post(`${baseURL}/api/auth/token/refresh/`, {
        refresh: authTokens.refresh,
      }).then(response => {
        localStorage.setItem('authTokens', JSON.stringify(response.data));
        setAuthTokens(response.data);
        setTokenData(jwtDecode(response.data.access));
        request.headers.Authorization = `Bearer ${response.data.access}`;
        return response.data;
      }).catch(error => {
        if (error.response?.status === 401) {
          logoutUser();
        }
        return Promise.reject(error);
      }).finally(() => {
        isRefreshingToken = false;
        refreshPromise = null;
      });
      
      try {
        const newTokens = await refreshPromise;
        return request;
      } catch (error) {
        return Promise.reject(error);
      }
    } catch (error: any) {
      console.error('Token refresh error:', error);
      if (error.response?.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  });
  
  return axiosInstance;
};

export default useAxios;
