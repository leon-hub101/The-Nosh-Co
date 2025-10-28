import { ReactNode } from 'react';
import { Redirect } from 'wouter';
import { useAdmin } from '@/contexts/AdminContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAdminLoggedIn } = useAdmin();

  if (!isAdminLoggedIn) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
}
