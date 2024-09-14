import { useEffect, useState } from 'react';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>(Notification.permission);

  useEffect(() => {
    setPermission(Notification.permission);
  }, []);

  const isPermissionGranted = permission === 'granted';
  const isPermissionDenied = permission === 'denied';

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  return { permission, isPermissionGranted, isPermissionDenied, requestPermission };
};
