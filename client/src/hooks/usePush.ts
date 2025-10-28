import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function usePush() {
  const [hasPermission, setHasPermission] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { toast } = useToast();

  const requestPermission = async () => {
    // Mock FCM permission request
    try {
      // Simulate requesting notification permission
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // Generate a mock FCM token
          const mockToken = `mock-fcm-token-${Math.random().toString(36).substr(2, 9)}`;
          setToken(mockToken);
          setHasPermission(true);
          
          toast({
            title: "Notifications Enabled",
            description: "You'll receive updates about specials!",
          });
          
          return mockToken;
        } else {
          toast({
            title: "Permission Denied",
            description: "Enable notifications to receive updates.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Not Supported",
          description: "Push notifications are not supported in this browser.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
    return null;
  };

  const sendTestPush = () => {
    // Mock sending a push notification
    if (!hasPermission) {
      toast({
        title: "No Permission",
        description: "Please enable notifications first.",
        variant: "destructive",
      });
      return;
    }

    // Simulate successful push send
    toast({
      title: "Push Notification Sent! 📱",
      description: "Test notification sent to all Android users.",
      duration: 5000,
    });

    // If browser supports actual notifications, show one
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('The Nosh Co.', {
        body: 'Your special is live!',
        icon: '/favicon.png',
      });
    }
  };

  return {
    hasPermission,
    token,
    requestPermission,
    sendTestPush,
  };
}
