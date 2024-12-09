'use client';
import { BaseError, Message, User } from '@/helpers/props';
import useAxios from '@/hooks/useAxios';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import { useWebSocket } from './SocketContext';

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
  clearChat: () => void;
  sendFile: (file: File) => void;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextProps>({
  handleSubmit: async () => {},
  textInput: '',
  setTextInput: async () => {},
  messages: [],
  clearChat: async () => {},
  sendFile: async () => {},
  isLoading: true,
});
export default ChatContext;

export const ChatProvider = ({ chatId, children }: childrenProps) => {
  const { user } = useContext(AuthContext);
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [recipient, setRecipient] = useState<User>();
  const [error, setError] = useState<BaseError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { socket } = useWebSocket();
  const router = useRouter();
  const api = useAxios();

  useEffect(() => {
    if (socket) {
      socket.onmessage = async function (e) {
        let data = JSON.parse(e.data);
        if (data.category === 'message' && data.chat_id === chatId) {
          setMessages((prevMessages) => [...prevMessages, data]);
        }
      };
    }
  }, [socket]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/api/chats/messages/${chatId}/`);
        setMessages(response.data);
      } catch (error) {
        if (error instanceof AxiosError && error.code === 'ERR_BAD_REQUEST')
          setError({ text: 'Failed to fetch messages', code: 'FETCH_MESSAGES_FAILED' });
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchParticipant = async () => {
      try {
        const response = await api.get(`/api/chats/${chatId}`);
        setRecipient(response.data['other_participant']);
      } catch (error) {
        if (error instanceof AxiosError && error.code === 'ERR_BAD_REQUEST')
          setError({ text: 'Chat not found', code: 'CHAT_NOT_FOUND' });
        console.error('Error fetching data:', error);
      }
    };

    fetchParticipant();
    fetchMessages();
  }, [chatId, user]);

  const sendMessage = async (type: 'txt' | 'img', content?: string, file?: File) => {
    socket?.send(JSON.stringify({ message: content, type, chat_id: chatId }));
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: Date.now(), content: content || '', type, sender: user, side: 'right', file_name: '', timestamp: new Date(), file: null },
    ]);
    if (type != 'txt') {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('content', content ? content : '');
      formData.append('file', file ? file : '');
      await api.post(`api/chats/messages/${chatId}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    // }
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    textInput.trim() != '' ? sendMessage('txt', textInput) : null;
    setTextInput('');
  };

  const sendFile = (file: File) => {
    sendMessage('img', '', file);
  };

  const clearChat = async () => {
    await api.delete(`/api/chats/${chatId}/`);
    router.push('/chats');
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

  return (
    <ChatContext.Provider value={{ handleSubmit, textInput, setTextInput, messages, recipient, clearChat, sendFile, isLoading }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
