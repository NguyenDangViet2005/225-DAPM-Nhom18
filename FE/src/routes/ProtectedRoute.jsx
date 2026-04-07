import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * ProtectedRoute – Bảo vệ các route yêu cầu đăng nhập và phân quyền.
 *
 * @param {string[]} allowedRoles – mảng các vai trò được phép truy cập
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user } = useAuth();

  // 1. Kiểm tra đăng nhập
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Kiểm tra quyền (nếu có yêu cầu)
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Thông thường sẽ redirect sang trang 403, tạm thời về / để cho đơn giản
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Nếu OK, render con của Route
  return <Outlet />;
};

export default ProtectedRoute;
