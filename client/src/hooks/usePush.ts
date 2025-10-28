import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { requestNotificationPermission, onForegroundMessage, sendPushNotification } from '@/firebase';
import { useLocalStorage } from './useLocalStorage';

export function usePush() {
  const [hasPermission, setHasPermission] = useState(false);
  const [token, setToken] = useLocalStorage<string | null>('fcm-token', null);
  const { toast } = useToast();

  // Request FCM permission and get token
  const requestPermission = async () => {
    try {
      const fcmToken = await requestNotificationPermission();
      
      if (fcmToken) {
        setToken(fcmToken);
        setHasPermission(true);
        
        toast({
          title: "Notifications Enabled",
          description: "You'll receive updates about specials and orders!",
        });
        
        return fcmToken;
      } else {
        // Demo mode or permission denied
        toast({
          title: "Notifications Not Available",
          description: "Push notifications require Firebase configuration.",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      console.error('Error requesting FCM permission:', error);
      toast({
        title: "Error",
        description: "Failed to enable notifications. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Send test push notification (admin only)
  const sendTestPush = async () => {
    if (!token) {
      toast({
        title: "No Token",
        description: "Please enable notifications first.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Send via backend stub endpoint
      // In production, this would use Firebase Admin SDK server-side
      const success = await sendPushNotification(
        token,
        'The Nosh Co.',
        'New specials are now available!'
      );

      if (success) {
        toast({
          title: "Notification Logged",
          description: "Notification request sent to backend (stub mode)",
        });
        return true;
      } else {
        toast({
          title: "Send Failed",
          description: "Could not send push notification.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error sending push:', error);
      toast({
        title: "Error",
        description: "Failed to send notification.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Register service worker and listen for foreground messages
  useEffect(() => {
    // Register service worker for FCM (only once)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('FCM Service Worker registered:', registration.scope);
        })
        .catch((err) => {
          console.warn('Service Worker registration failed:', err);
        });
    }

    // Listen for foreground messages and get unsubscribe function
    const unsubscribe = onForegroundMessage((payload: unknown) => {
      const data = payload as { notification?: { title?: string; body?: string } };
      
      toast({
        title: data.notification?.title || 'The Nosh Co.',
        description: data.notification?.body || 'You have a new notification',
      });

      // Show browser notification if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(data.notification?.title || 'The Nosh Co.', {
          body: data.notification?.body || 'You have a new notification',
          icon: '/icon-192x192.png',
        });
      }
    });

    // Cleanup: unsubscribe when component unmounts
    return () => {
      unsubscribe();
    };
  }, [toast]);

  // Check if we already have a token
  useEffect(() => {
    if (token) {
      setHasPermission(true);
    }
  }, [token]);

  return {
    hasPermission,
    token,
    requestPermission,
    sendTestPush,
  };
}
