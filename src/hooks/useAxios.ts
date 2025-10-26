import AuthContext from '@/contexts/AuthContext';
import { serverManager } from '@/lib/serverManager';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useContext } from 'react';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _serverId?: number;
}

const useAxios = () => {
  const { authTokens, logoutUser, refreshToken } = useContext(AuthContext);
  
  const axiosInstance = axios.create({
    // Don't set baseURL here - we'll set it dynamically per request
  });

  axiosInstance.interceptors.request.use(async (request: CustomAxiosRequestConfig) => {
    // Select a server dynamically for each request
    const selectedServer = await serverManager.selectServer();
    
    if (!selectedServer) {
      return Promise.reject(new Error('No active servers available'));
    }

    // Store server ID in request config for error handling
    request._serverId = selectedServer.id;
    
    // Set the baseURL dynamically
    if (!request.baseURL) {
      request.baseURL = selectedServer.base_url;
    }

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
            return Promise.reject(new Error('Session expired'));
          }
        } else {
          request.headers.Authorization = `Bearer ${authTokens.access}`;
        }
      } catch (err) {
        logoutUser();
        console.error('Error decoding token:', err);
        return Promise.reject(new Error('Invalid token'));
      }
    }
    return request;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;
      
      // Handle 401 unauthorized
      if (error.response && error.response.status === 401) {
        console.log('[Axios] 401 detected, logging out at', new Date().toLocaleTimeString());
        logoutUser();
        return Promise.reject(error);
      }

      // Handle network errors or server down scenarios
      // Check if it's a network error or 5xx error and we haven't retried yet
      const isServerError = 
        !error.response || 
        (error.response.status >= 500 && error.response.status < 600);
      
      if (isServerError && originalRequest && !originalRequest._retry) {
        console.warn('[Axios] Server error detected:', error.message);
        
        // Report the error if we have a server ID
        if (originalRequest._serverId) {
          const serverId = originalRequest._serverId;
          const server = await serverManager.getServerById(serverId);
          
          // Only report if server was marked as active
          if (server && server.active_status) {
            console.log(`[Axios] Reporting error for server ${serverId}`);
            await serverManager.reportServerError(serverId);
          }
        }

        // Mark request as retried and try again with a different server
        originalRequest._retry = true;
        delete originalRequest._serverId; // Clear server ID so a new one is selected
        delete originalRequest.baseURL; // Clear baseURL so a new one is selected
        
        try {
          return await axiosInstance.request(originalRequest);
        } catch (retryError) {
          console.error('[Axios] Retry failed:', retryError);
          return Promise.reject(retryError);
        }
      }

      return Promise.reject(error);
    },
  );

  return axiosInstance;
};

export default useAxios;
