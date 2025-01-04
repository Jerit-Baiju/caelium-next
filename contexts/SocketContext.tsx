import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AuthContext from './AuthContext';

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  send: (data: any) => void;
  socketData: any;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setActiveUsers, addActiveUser, removeActiveUser } = useContext(AuthContext);
  const socketRef = useRef<WebSocket | null>(null);
  const [socketData, setSocketData] = useState<any>();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socketData) return;
    console.log('Socket data:', socketData);
    if (socketData.category === 'online_users') {
      setActiveUsers(socketData.online_users);
    } else if (socketData.category === 'status_update') {
      socketData.is_online ? addActiveUser(socketData.user_id) : removeActiveUser(socketData.user_id);
    }
  }, [socketData]);

  useEffect(() => {
    const token = localStorage.getItem('authTokens');
    if (!token) return;

    let reconnectTimeout: NodeJS.Timeout;
    let reconnectInterval = 5000; // Reconnect every 5 seconds

    const connectWebSocket = () => {
      console.log('Connecting to WebSocket');

      if (socketRef.current) {
        socketRef.current.onclose = null; // Remove previous onclose to prevent duplicate connections
        socketRef.current.close();
      }

      const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_HOST}/ws/base/${JSON.parse(token).access}/`);

      ws.onopen = () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setSocketData(data);
      };

      ws.onclose = () => {
        console.log('WebSocket closed, attempting to reconnect...');
        setIsConnected(false);
        reconnectTimeout = setTimeout(connectWebSocket, reconnectInterval);
      };

      ws.onerror = (err) => {
        console.log('WebSocket encountered error:', err);
      };

      socketRef.current = ws;
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.onclose = null; // Prevent reconnect on component unmount
        socketRef.current.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, []);

  const send = (data: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    } else {
      console.log('WebSocket is not open. Ready state is:', socketRef.current?.readyState);
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket: socketRef.current, isConnected, send, socketData }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
