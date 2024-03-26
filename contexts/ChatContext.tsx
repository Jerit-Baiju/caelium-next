'use client';
import { User } from '@/helpers/props';
import { getUrl } from '@/helpers/support';
import axios from 'axios';
import { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';
import AuthContext from './AuthContext';

interface childrenProps {
  chatId: Number;
  children: ReactNode;
}

interface ChatContextProps {
  handleSubmit: (e: any) => Promise<void>;
  textInput: string;
  setTextInput: (e: any) => void;
  messages: any;
  recipient: any;
}

const ChatContext = createContext<ChatContextProps>({
  handleSubmit: async () => {},
  textInput: '',
  setTextInput: async () => {},
  messages: {},
  recipient: {},
});
export default ChatContext;

export const ChatProvider = ({ chatId, children }: childrenProps) => {
  let { authTokens } = useContext(AuthContext);
  let [textInput, setTextInput] = useState('');
  let [messages, setMessages] = useState([]);
  let [recipient, setRecipient] = useState<User | null>(null);


  const socket= useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    socket.current = new WebSocket(`${process.env.NEXT_PUBLIC_WS_HOST}/ws/chat/' + chatId + '/'`);

    // Define event handlers for the WebSocket
    socket.current.onmessage = function (e) {
      let data = JSON.parse(e.data);
      if (data['type'] === 'message') {
        console.log(data['message']);
      }
    };
    socket.current.onopen = function () {
      console.log('socket opened');
    };

    // Cleanup function to close the WebSocket connection when the component unmounts
    return () => {
      if (socket.current) {
        socket.current.close();
        console.log('socket closed');
      }
    };
  }, [chatId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.current?.send(
      JSON.stringify({
        content: textInput,

      })
    );
    setTextInput('');
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.request(getUrl({ url: `/api/chats/messages/${chatId}/`, token: authTokens?.access }));
        setMessages(response.data);
      } catch (error) {
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

  return <ChatContext.Provider value={contextData}>{children}</ChatContext.Provider>;
};
