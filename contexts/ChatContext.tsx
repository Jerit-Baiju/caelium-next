'use client';
import { Message, User } from '@/helpers/props';
import { getMedia, getUrl } from '@/helpers/support';
import axios, { AxiosError } from 'axios';
import { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';
import AuthContext from './AuthContext';

interface childrenProps {
  chatId: Number;
  children: ReactNode;
}

interface ChatContextProps {
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>;
  textInput: string;
  setTextInput: (e: string) => void;
  messages: Array<any>;
  recipient?: User;
}

const ChatContext = createContext<ChatContextProps>({
  handleSubmit: async () => {},
  textInput: '',
  setTextInput: async () => {},
  messages: [],
});
export default ChatContext;

type ErrorType = {
  text: string;
  code: 'CHAT_NOT_FOUND' | 'FETCH_MESSAGES_FAILED';
};

export const ChatProvider = ({ chatId, children }: childrenProps) => {
  const { authTokens, user } = useContext(AuthContext);
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [recipient, setRecipient] = useState<User>();
  const [error, setError] = useState<ErrorType | null>(null);

  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    socket.current = new WebSocket(`${process.env.NEXT_PUBLIC_WS_HOST}/ws/chat/${chatId}/${authTokens.access}/`);
    socket.current.onmessage = async function (e) {
      let data = JSON.parse(e.data)['message'];
      const message: Message = {
        sender: {
          name: data.name,
          avatar: getMedia(data.avatar),
          id: data.user_id,
        },
        id: data.message_id,
        content: data.content,
        timestamp: data.timestamp,
        side: user.id === data.user_id ? 'right' : 'left',
      };
      let newMessages = [...messages, message]
      console.log(newMessages)
      setMessages(newMessages);
    };

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [chatId]);

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    socket.current?.send(
      JSON.stringify({
        content: textInput,
        token: authTokens.access,
      }),
    );
    setTextInput('');
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.request(getUrl({ url: `/api/chats/messages/${chatId}/`, token: authTokens?.access }));
        setMessages(response.data);
      } catch (error) {
        if (error instanceof AxiosError && error.code === 'ERR_BAD_REQUEST')
          setError({ text: 'Failed to fetch messages', code: 'FETCH_MESSAGES_FAILED' });
        console.error('Error fetching data:', error);
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.request(getUrl({ url: `/api/chats/${chatId}/`, token: authTokens?.access }));
        setRecipient(response.data['other_participant']);
      } catch (error) {
        if (error instanceof AxiosError && error.code === 'ERR_BAD_REQUEST')
          setError({ text: 'Chat not found', code: 'CHAT_NOT_FOUND' });
        console.error('Error fetching data:', error);
      }
    };
    fetchMessages();
  }, []);

  let contextData: ChatContextProps = {
    handleSubmit,
    textInput,
    setTextInput,
    messages,
    recipient,
  };

  if (error) {
    return (
      <div className='flex max-sm:max-h-[calc(100dvh-5rem] flex-col flex-grow h-screen sm:w-3/4'>
        <div className='flex flex-col items-center justify-center flex-grow'>
          <h1 className='text-2xl font-bold'>{error.text}</h1>
          {/* <p className="text-gray-500">{error.code}</p> */}
        </div>
      </div>
    );
  }

  return <ChatContext.Provider value={contextData}>{children}</ChatContext.Provider>;
};
