import React, { createContext, useContext, useEffect, useState } from 'react';

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  send: (data: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authTokens');
    if (!token) return;
    console.log('Connecting to WebSocket');

    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_HOST}/ws/base/${JSON.parse(token).access}/`);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received:', data);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);

      setTimeout(() => {
        console.log('Attempting to reconnect to WebSocket');
        setSocket(
          new WebSocket(`${process.env.NEXT_PUBLIC_WS_HOST}/ws/base/${JSON.parse(localStorage.getItem('authTokens')!).access}/`),
        );
      }, 5000);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const send = (data: any) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      console.log('WebSocket is not open. Ready state:', socket?.readyState);
    }
  };

  return <WebSocketContext.Provider value={{ socket, isConnected, send }}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
