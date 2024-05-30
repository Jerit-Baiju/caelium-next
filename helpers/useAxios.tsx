import axios from 'axios';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import { useSession } from 'next-auth/react';

const baseURL = process.env.NEXT_PUBLIC_API_HOST;

const useAxios = () => {
  const session = useSession();
  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${session.data?.accessToken}` },
  });
  return axiosInstance;
};

export default useAxios;
