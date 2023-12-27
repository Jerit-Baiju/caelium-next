import AuthContext from '@/contexts/AuthContext';
import axios from 'axios';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';

export interface Item {
  chat: Chat;
}

export interface Chat {
  avatar: string;
  name: string;
}

interface SideBarProps {
  chat?: boolean;
}

const SideBar: React.FC<SideBarProps> = ({ chat = false }) => {
  let { authTokens } = useContext(AuthContext);
  let [chats, setChats] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: 'GET',
        url: 'http://192.168.43.157:8000/api/chats/',
        headers: {
          Authorization: 'Bearer ' + authTokens.access,
          'content-type': 'application/json',
        },
      };

      try {
        const { data } = await axios.request(options);
        console.log(data);
        setChats(await data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={`w-full ${chat?'max-sm:hidden':null} md:w-1/4 flex-grow-0 md:pr-4 md:border-r border-gray-200 dark:border-gray-700`}>
      <h2 className='text-lg font-semibold mb-4'>Persons to Chat</h2>
      <ul role='list' className='max-w-sm divide-y divide-gray-200 dark:divide-gray-700'>
        {chats.map((item: Item, id) => (
          <Link href={`/chats/${id}`}>
            <li key={id} className='py-3 sm:py-4'>
              <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                <div className='flex-shrink-0'>
                  <img className='w-8 h-8 rounded-full' src={item.chat.avatar} alt='Neil image' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold text-gray-900 truncate dark:text-white'>{item.chat.name}</p>
                  {/* <p className='text-sm text-gray-500 truncate dark:text-gray-400'>email@flowbite.com</p> */}
                </div>
                <span className='inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300'>
                  <span className='w-2 h-2 me-1 bg-green-500 rounded-full'></span>
                  Available
                </span>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
