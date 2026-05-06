import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function RoleRoute({ allow = [] }) {
  const { user } = useAuth();
  return allow.includes(user?.role) ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
