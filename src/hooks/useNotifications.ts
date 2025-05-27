// hooks/useNotifications.ts
import { useCallback, useEffect, useState } from 'react';
import { fetchToken } from '../lib/firebase';
import useAxios from './useAxios';

const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const API = useAxios();

  // Check if notifications are supported
  useEffect(() => {
    const supported = typeof window !== 'undefined' && 'Notification' in window;
    setIsSupported(supported);
    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      console.warn('Notifications are not supported in this environment');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        const token = await fetchToken();
        await API.put('api/auth/update/fcm-token/', { token });
        console.log('FCM Token:', token);
      }
    } catch (err) {
      console.error('Error requesting permission or fetching token:', err);
      setPermission('denied');
    }
  }, [isSupported, API]);

  useEffect(() => {
    if (isSupported && permission !== 'granted') {
      setShowAlertDialog(true);
    }
  }, [permission, isSupported]);

  return {
    isSupported,
    permission,
    showAlertDialog,
    setShowAlertDialog,
    requestPermission
  };
};

export default useNotifications;
