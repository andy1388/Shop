import { Navigate, useLocation } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const location = useLocation();
  const adminToken = localStorage.getItem('adminToken');

  if (!adminToken) {
    // 未登入時重定向到管理員登入頁面
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}; 