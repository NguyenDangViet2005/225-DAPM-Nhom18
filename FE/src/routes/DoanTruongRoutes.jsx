import { Route } from 'react-router-dom';
import { ROLES } from '@/constants/roles';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '@/components/layouts/dashboardLayout/DashboardLayout';

// Pages – Admin
import Dashboard from '@/pages/dashboard/Dashboard';
import SoDoan from '@/pages/doantruong/so-doan/SoDoan';
import DoanPhi from '@/pages/doantruong/doan-phi/DoanPhi';

// Hoạt động
import HoatDongQuanLy from '@/pages/doantruong/hoat-dong/HoatDongQuanLy';
import HoatDongDuyet from '@/pages/doantruong/hoat-dong/HoatDongDuyet';
import HoatDongXacNhan from '@/pages/doantruong/hoat-dong/HoatDongXacNhan';

import YeuCau from '@/pages/doantruong/yeu-cau/YeuCau';
import TaiKhoan from '@/pages/doantruong/tai-khoan/TaiKhoan';

/**
 * DoanTruongRoutes – chỉ cho phép role DOANTRUONG
 */
const DoanTruongRoutes = (
  <Route element={<ProtectedRoute allowedRoles={[ROLES.DOANTRUONG]} />}>
    <Route element={<DashboardLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/so-doan" element={<SoDoan />} />
      <Route path="/doan-phi" element={<DoanPhi />} />
      
      {/* ── Hoạt động ─────────────────────────────────── */}
      <Route path="/hoat-dong/quan-ly" element={<HoatDongQuanLy />} />
      <Route path="/hoat-dong/duyet" element={<HoatDongDuyet />} />
      <Route path="/hoat-dong/xac-nhan" element={<HoatDongXacNhan />} />

      <Route path="/yeu-cau/danh-sach" element={<YeuCau />} />
      <Route path="/yeu-cau/duyet" element={<YeuCau tab="duyet" />} />
      <Route path="/tai-khoan" element={<TaiKhoan />} />
    </Route>
  </Route>
);

export default DoanTruongRoutes;
