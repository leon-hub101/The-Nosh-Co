import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useOffline() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast({
        title: "Back Online",
        description: "You're connected to the internet.",
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast({
        title: "You're Offline",
        description: "Changes are saved locally and will sync when online.",
        variant: "default",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  return { isOffline };
}
