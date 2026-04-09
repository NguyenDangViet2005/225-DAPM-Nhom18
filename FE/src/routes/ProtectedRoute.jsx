import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/**
 * ProtectedRoute – Bảo vệ các route yêu cầu đăng nhập và phân quyền.
 *
 * @param {string[]} allowedRoles – mảng các vai trò được phép truy cập
 */
// eslint-disable-next-line no-unused-vars
const ProtectedRoute = ({ allowedRoles = [] }) => {
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();

  // 1. Kiểm tra đăng nhập (Tạm thời tắt để dev)
  // if (!user) {
  //   return <Navigate to="/login" replace />;
  // }

  // 2. Kiểm tra quyền (Tạm thời tắt để dev)
  // if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
  //   return <Navigate to="/login" replace />;
  // }

  // 3. Nếu OK, render con của Route
  return <Outlet />;
};

export default ProtectedRoute;
