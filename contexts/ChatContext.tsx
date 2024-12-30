'use client';
import { BaseError, Chat, Message, User } from '@/helpers/props';
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
  typingMessage: string;
  handleTyping: (text: string) => void;
  isLoading: boolean;
  isUploading: boolean;
  isLoadingMore: boolean;
  loadMoreMessages: () => void;
  nextPage: string | null;
  meta: Chat | null;
}

const ChatContext = createContext<ChatContextProps>({
  handleSubmit: async () => {},
  textInput: '',
  setTextInput: async () => {},
  messages: [],
  clearChat: async () => {},
  sendFile: async () => {},
  typingMessage: '',
  handleTyping: async () => {},
  isLoading: true,
  isUploading: false,
  isLoadingMore: false,
  loadMoreMessages: async () => {},
  nextPage: null,
  meta: null,
});
export default ChatContext;

export const ChatProvider = ({ chatId, children }: childrenProps) => {
  const { user } = useContext(AuthContext);
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [recipient, setRecipient] = useState<User>();
  const [error, setError] = useState<BaseError | null>(null);
  const [meta, setMeta] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [typingMessage, setTypingMessage] = useState<string>('');
  const [nextPage, setNextPage] = useState<string | null>(null);

  const { socket } = useWebSocket();
  const router = useRouter();
  const api = useAxios();

  useEffect(() => {
    if (socket) {
      socket.onmessage = async function (e) {
        let data = JSON.parse(e.data);
        if (data.category === 'new_message' && data.chat_id == chatId) {
          setMessages((prevMessages) => [...prevMessages, data]);
        } else if (data.category === 'typing' && data.chat_id == chatId) {
          setTypingMessage(data.typed);
        }
      };
    }
  }, [socket]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await api.get(`/api/chats/messages/${chatId}/`);
        const metaResponse = await api.get(`/api/chats/${chatId}/`);
        setMeta(metaResponse.data);
        setMessages(response.data.results.reverse()); // Reverse the array to display the latest messages first
        setNextPage(response.data.next); // Set the next page URL
        const participantResponse = await api.get(`/api/chats/${chatId}`);
        setRecipient(participantResponse.data['other_participant']);
      } catch (error) {
        if (error instanceof AxiosError && error.code === 'ERR_BAD_REQUEST') {
          setError({ text: 'Failed to fetch messages or chat not found', code: 'FETCH_FAILED' });
        }
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [chatId, user]);

  const loadMoreMessages = async () => {
    if (!nextPage || isLoadingMore) return; // Prevent fetching if already at the last page or currently loading
    setIsLoadingMore(true);
    try {
      const nextPageUrl = nextPage.includes('caelium.co') ? nextPage.replace('http://', 'https://') : nextPage;
      const response = await api.get(nextPageUrl);
      let olderMessages = response.data.results.reverse();
      setMessages((prevMessages) => [...olderMessages, ...prevMessages]); // Prepend older messages
      setNextPage(response.data.next); // Update next page URL
    } catch (error) {
      console.error('Error fetching older messages:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const sendMessage = async (type: 'txt' | 'attachment', content?: string, file?: File) => {
    if (type === 'txt') {
      socket?.send(JSON.stringify({ category: 'text_message', message: content, type, chat_id: chatId }));
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now(),
          content: content || '',
          type,
          sender: user,
          file_name: '',
          timestamp: new Date(),
          file: null,
        },
      ]);
    } else {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('type', type);
      formData.append('content', content || '');
      formData.append('file', file || '');
      const response = await api.post(`api/chats/messages/${chatId}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.status == 201) {
        socket?.send(JSON.stringify({ category: 'file_message', chat_id: chatId, message_id: response.data.id }));
        setMessages((prevMessages) => [...prevMessages, { ...response.data, sender: user }]);
      }
      setIsUploading(false);
    }
  };

  const handleTyping = async (text: string) => {
    socket?.send(JSON.stringify({ category: 'typing', chat_id: chatId, typed: text }));
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    textInput.trim() !== '' && sendMessage('txt', textInput);
    setTextInput('');
  };

  const sendFile = (file: File) => sendMessage('attachment', '', file);

  const clearChat = async () => {
    await api.delete(`/api/chats/${chatId}/`);
    router.push('/chats');
  };

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-2xl font-bold'>{error.text}</h1>
      </div>
    );
  }

  return (
    <ChatContext.Provider
      value={{
        handleSubmit,
        textInput,
        setTextInput,
        messages,
        recipient,
        clearChat,
        sendFile,
        handleTyping,
        isLoading,
        isUploading,
        isLoadingMore,
        typingMessage,
        loadMoreMessages,
        nextPage,
        meta,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
