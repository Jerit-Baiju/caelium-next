import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAppContext } from './AppContext';
import AuthContext from './AuthContext';
import { SocketData } from '@/types/socketData';

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  send: (data: object) => void;
  socketData: SocketData | null;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logoutUser, authTokens } = useContext(AuthContext); // Use authTokens from AuthContext
  const { setActiveUsers, addActiveUser, removeActiveUser, updateLastSeen } = useAppContext();
  const socketRef = useRef<WebSocket | null>(null);
  const [socketData, setSocketData] = useState<SocketData| null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const retryCountRef = useRef(0);
  const maxRetries = 10; // Increased from 2 to 10
  const stableConnectionTimer = useRef<NodeJS.Timeout | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!socketData) return;
    try {
      if (socketData.category === 'online_users') {
        setActiveUsers(socketData.online_users);
      } else if (socketData.category === 'status_update') {
        if (socketData.is_online) {
          addActiveUser(socketData.user_id);
        } else {
          removeActiveUser(socketData.user_id);
        }
        updateLastSeen(socketData.user_id);
      }
    } catch (error) {
      console.error('Error processing socket data:', error);
    }
  }, [socketData, setActiveUsers, addActiveUser, removeActiveUser, updateLastSeen]);

  useEffect(() => {
    mounted.current = true;
    let reconnectTimeout: NodeJS.Timeout;

    if (!authTokens || !authTokens.access) {
      setIsConnected(false);
      if (socketRef.current) {
        socketRef.current.onclose = null;
        socketRef.current.close();
      }
      return;
    }

    const getReconnectDelay = () => {
      // Exponential backoff: 500ms, 1000ms, 2000ms, 4000ms, etc.
      return Math.min(500 * Math.pow(2, retryCountRef.current), 10000);
    };

    const connectWebSocket = () => {
      console.log('Connecting to WebSocket', retryCountRef.current);

      if (socketRef.current) {
        socketRef.current.onclose = null;
        socketRef.current.close();
      }

      const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_HOST}/ws/base/${authTokens.access}/`);

      ws.onopen = () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);

        // Reset retry counter after 30 seconds of stable connection
        stableConnectionTimer.current = setTimeout(() => {
          retryCountRef.current = 0;
        }, 30000);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (mounted.current) {
            setSocketData(data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        if (stableConnectionTimer.current) {
          clearTimeout(stableConnectionTimer.current);
        }

        retryCountRef.current += 1;
        console.log(`WebSocket closed, attempt ${retryCountRef.current} of ${maxRetries}`);

        if (retryCountRef.current >= maxRetries) {
          console.log('Max retries reached, logging out');
          logoutUser();
          return;
        }

        const delay = getReconnectDelay();
        console.log(`Reconnecting in ${delay}ms...`);
        reconnectTimeout = setTimeout(connectWebSocket, delay);
      };

      ws.onerror = (err) => {
        console.log('WebSocket encountered error:', err);
      };

      socketRef.current = ws;
    };

    connectWebSocket();

    return () => {
      mounted.current = false;
      if (stableConnectionTimer.current) {
        clearTimeout(stableConnectionTimer.current);
      }
      if (socketRef.current) {
        socketRef.current.onclose = null; // Prevent reconnect on component unmount
        socketRef.current.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [authTokens, logoutUser]); // Depend on authTokens

  const send = (data: object) => {
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
