import { getApp, getApps, initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyA4Ilj8CqJdPiux6gQEI2r6Q7jN7dCj3xE',
  authDomain: 'caeliumpro.firebaseapp.com',
  projectId: 'caeliumpro',
  storageBucket: 'caeliumpro.appspot.com',
  messagingSenderId: '657087635264',
  appId: '1:657087635264:web:e92d428d146c167c59e4a5',
  measurementId: 'G-1YN2GRP2P5',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      });
      return token;
    }
    return null;
  } catch (err) {
    console.error('An error occurred while fetching the token:', err);
    return null;
  }
};

export { app, messaging };
