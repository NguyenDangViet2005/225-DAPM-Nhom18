import { Route } from 'react-router-dom';
import { ROLES } from '../constants/roles';
import ProtectedRoute from './ProtectedRoute';
// import DashboardLayout from '../components/layouts/DashboardLayout';

// Pages – Admin
// import Dashboard from '../pages/dashboard/Dashboard';
// import SoDoan from '../pages/admin/so-doan/SoDoan';
// import DoanPhi from '../pages/admin/doan-phi/DoanPhi';
// import HoatDong from '../pages/admin/hoat-dong/HoatDong';
// import YeuCau from '../pages/admin/yeu-cau/YeuCau';
// import TaiKhoan from '../pages/admin/tai-khoan/TaiKhoan';

/**
 * AdminRoutes – chỉ cho phép role DOANTRUONG
 * Sử dụng trong AppRoutes.jsx:
 *   <Route path="/" element={<ProtectedRoute allowedRoles={[ROLES.DOANTRUONG]} />}>
 *     {AdminRoutes}
 *   </Route>
 */
const AdminRoutes = (
  <Route element={<ProtectedRoute allowedRoles={[ROLES.DOANTRUONG]} />}>
    {/* <Route element={<DashboardLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/so-doan" element={<SoDoan />} />
      <Route path="/doan-phi" element={<DoanPhi />} />
      <Route path="/hoat-dong/quan-ly" element={<HoatDong />} />
      <Route path="/hoat-dong/dang-ky" element={<HoatDong tab="dang-ky" />} />
      <Route path="/hoat-dong/duyet" element={<HoatDong tab="duyet" />} />
      <Route path="/hoat-dong/xac-nhan" element={<HoatDong tab="xac-nhan" />} />
      <Route path="/yeu-cau/danh-sach" element={<YeuCau />} />
      <Route path="/yeu-cau/duyet" element={<YeuCau tab="duyet" />} />
      <Route path="/tai-khoan" element={<TaiKhoan />} />
    </Route> */}
  </Route>
);

export default AdminRoutes;
