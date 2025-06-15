
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/contexts/AuthContext';

interface RoleBasedGuardProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'driver')[];
  fallbackRoute?: string;
}

const RoleBasedGuard = ({ 
  children, 
  allowedRoles, 
  fallbackRoute = '/auth' 
}: RoleBasedGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const { userRole, loading: roleLoading } = useUserRole();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    // Redirect based on user role
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (userRole === 'driver') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to={fallbackRoute} replace />;
  }

  return <>{children}</>;
};

export default RoleBasedGuard;
