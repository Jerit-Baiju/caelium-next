import AuthContext from '@/contexts/AuthContext';
import axios from 'axios';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import { useContext } from 'react';

const baseURL = process.env.NEXT_PUBLIC_API_HOST;

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);
  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${authTokens?.access}` },
  });
  axiosInstance.interceptors.request.use(async (request) => {
    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs.unix(Number(user.exp)).diff(dayjs()) < 1;
    if (!isExpired) return request;
    const response = await axios.post(`${baseURL}/api/auth/token/refresh/`, {
      refresh: authTokens.refresh,
    });
    localStorage.setItem('authTokens', JSON.stringify(response.data));
    setAuthTokens(response.data);
    setUser(jwtDecode(response.data.access));
    request.headers.Authorization = `Bearer ${response.data.access}`;
    console.log('update auth token');
    return request;
  });
  return axiosInstance;
};

export default useAxios;
