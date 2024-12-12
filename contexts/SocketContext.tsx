import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  send: (data: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

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
        console.log('Received:', data);
      };

      ws.onclose = () => {
        console.log('WebSocket closed, attempting to reconnect...');
        setIsConnected(false);
        reconnectTimeout = setTimeout(connectWebSocket, reconnectInterval);
      };

      ws.onerror = (err) => {
        console.error('WebSocket encountered error:', err);
        // Remove ws.close() to prevent auto-closing the socket
        // ws.close();
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

  return <WebSocketContext.Provider value={{ socket: socketRef.current, isConnected, send }}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
