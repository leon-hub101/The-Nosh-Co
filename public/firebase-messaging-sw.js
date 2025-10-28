// Firebase Cloud Messaging Service Worker
// This file handles background push notifications

// Import Firebase scripts for service worker (compat version)
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase configuration
// Note: In production, these should match your Firebase project
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Initialize Firebase in service worker
try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  // Handle background messages (when app is not in focus)
  messaging.onBackgroundMessage((payload) => {
    console.log('[SW] Background message received:', payload);
    
    const notificationTitle = payload.notification?.title || 'The Nosh Co.';
    const notificationOptions = {
      body: payload.notification?.body || 'You have a new notification',
      icon: payload.notification?.icon || '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: 'nosh-notification',
      requireInteraction: false,
      data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });

  // Handle notification click
  self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event);
    event.notification.close();

    // Open the app when notification is clicked
    event.waitUntil(
      clients.openWindow('/')
    );
  });
} catch (error) {
  console.warn('[SW] Firebase init failed (demo mode):', error);
}
