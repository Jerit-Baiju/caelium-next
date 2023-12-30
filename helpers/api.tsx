import axios from 'axios';

export interface UserData {
  id: number;
  username: string;
  name: string;
  avatar: string;
}

export const fetchUser = async (pk: number): Promise<UserData> => {
  const options = { method: 'GET', url: `${process.env.NEXT_PUBLIC_API_HOST}/api/auth/accounts/${pk}/` };
  const { data } = await axios.request(options);
  console.log(data);
  return data;
};
