// hooks/useNotifications.ts
import { useCallback, useEffect, useState } from 'react';
import { fetchToken } from '../lib/firebase';
import useAxios from './useAxios';

const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>(Notification.permission);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const API = useAxios();

  const requestPermission = useCallback(async () => {
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
    }
  }, []);

  useEffect(() => {
    if (permission !== 'granted') {
      setShowAlertDialog(true);
    }
  }, [permission]);

  return { permission, showAlertDialog, requestPermission, setShowAlertDialog };
};

export default useNotifications;
