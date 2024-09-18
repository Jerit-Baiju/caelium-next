importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: 'AIzaSyA4Ilj8CqJdPiux6gQEI2r6Q7jN7dCj3xE',
  authDomain: 'caeliumpro.firebaseapp.com',
  projectId: 'caeliumpro',
  storageBucket: 'caeliumpro.appspot.com',
  messagingSenderId: '657087635264',
  appId: '1:657087635264:web:e92d428d146c167c59e4a5',
  measurementId: 'G-1YN2GRP2P5',
};

firebase.initializeApp(firebaseConfig);


const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logos/logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});