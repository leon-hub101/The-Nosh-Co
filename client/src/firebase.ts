import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';

// Firebase configuration
// TODO: Replace with your Firebase project config from Firebase Console
// Get this from: Firebase Console → Project Settings → General → Your apps
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

// VAPID key for FCM web push
// Get this from: Firebase Console → Project Settings → Cloud Messaging → Web Push certificates
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || "demo-vapid-key";

// Initialize Firebase
let app;
let messaging: Messaging | null = null;

try {
  app = initializeApp(firebaseConfig);
  
  // Initialize FCM only if in browser and config is not using demo values
  if (typeof window !== 'undefined' && firebaseConfig.apiKey !== "demo-api-key") {
    messaging = getMessaging(app);
  }
} catch (error) {
  console.warn('Firebase initialization failed (demo mode):', error);
}

/**
 * Request notification permission and get FCM token
 * @returns FCM token or null if permission denied or not configured
 */
export const requestNotificationPermission = async (): Promise<string | null> => {
  if (!messaging) {
    console.warn('FCM not initialized. Using demo mode.');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      console.log('FCM Token:', token);
      
      // TODO: Send this token to your backend to store for sending notifications
      return token;
    } else {
      console.log('Notification permission denied.');
      return null;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

/**
 * Listen for foreground messages
 * @param callback Function to call when message is received
 */
export const onForegroundMessage = (callback: (payload: unknown) => void) => {
  if (!messaging) {
    console.warn('FCM not initialized. No foreground messages will be received.');
    return;
  }

  onMessage(messaging, (payload) => {
    console.log('Foreground message received:', payload);
    callback(payload);
  });
};

/**
 * Send push notification via FCM REST API
 * @param token FCM device token
 * @param title Notification title
 * @param body Notification body
 * @param serverKey FCM server key from Firebase Console
 */
export const sendPushNotification = async (
  token: string,
  title: string,
  body: string,
  serverKey?: string
): Promise<boolean> => {
  // If no server key provided, this is demo mode
  if (!serverKey) {
    console.log('Demo mode: Would send notification:', { token, title, body });
    return true;
  }

  try {
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${serverKey}`
      },
      body: JSON.stringify({
        to: token,
        notification: {
          title,
          body,
          icon: '/icon-192x192.png'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`FCM API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Notification sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
};

export { messaging };
