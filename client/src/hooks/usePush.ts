import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function usePush() {
  const [hasPermission, setHasPermission] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { toast } = useToast();

  const requestPermission = async () => {
    // Mock FCM permission request - always succeeds for testing
    try {
      // Generate a mock FCM token immediately
      const mockToken = `mock-fcm-token-${Math.random().toString(36).substr(2, 9)}`;
      setToken(mockToken);
      setHasPermission(true);
      
      // Try to request real permission if available (for real browser testing)
      if ('Notification' in window && Notification.permission === 'default') {
        try {
          await Notification.requestPermission();
        } catch {
          // Ignore permission errors - we're mocking anyway
        }
      }
      
      toast({
        title: "Notifications Enabled",
        description: "You'll receive updates about specials!",
      });
      
      return mockToken;
    } catch (error) {
      console.error('Error requesting permission:', error);
      // Still set permission for mock even if error
      const mockToken = `mock-fcm-token-${Math.random().toString(36).substr(2, 9)}`;
      setToken(mockToken);
      setHasPermission(true);
      return mockToken;
    }
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
      title: "Push Notification Sent",
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
