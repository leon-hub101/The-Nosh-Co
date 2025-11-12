import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AdminContextType {
  isAdminLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to check session:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = () => {
    // After successful backend login, re-check session
    const recheckSession = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to recheck session:', error);
      }
    };
    
    recheckSession();
  };

  const logout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout', {});
      setUser(null);
      
      // Invalidate shop status cache to ensure overlay shows for non-admins
      queryClient.invalidateQueries({ queryKey: ['/api/shop/status'] });
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const isAdminLoggedIn = user?.role === 'admin';

  return (
    <AdminContext.Provider value={{ isAdminLoggedIn, user, isLoading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
