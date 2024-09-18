import { getApp, getApps, initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyC1CvHaaP-BTOOIaUrSGql4uwW3cUVb8xo',
  authDomain: 'caelium-cloud.firebaseapp.com',
  projectId: 'caelium-cloud',
  storageBucket: 'caelium-cloud.appspot.com',
  messagingSenderId: '295249747539',
  appId: '1:295249747539:web:26684734348a7073ab30a6',
  measurementId: 'G-RN3WVJ9FLK',
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
