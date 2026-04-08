import { Route } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/dashboardLayout/DashboardLayout';

// Pages – Đoàn Khoa
import DashboardKhoa from '@/pages/doankhoa/dashboard/DashboardKhoa';
import HoatDongKhoaQuanLy from '@/pages/doankhoa/hoat-dong-khoa/HoatDongKhoaQuanLy';
import HoatDongKhoaDuyet from '@/pages/doankhoa/hoat-dong-khoa/HoatDongKhoaDuyet';

/**
 * DoanKhoaRoutes – prefix /doankhoa để tránh conflict với DoanTruongRoutes
 * TODO: Bật lại ProtectedRoute khi tích hợp BE
 */
const DoanKhoaRoutes = (
  <Route path="/doankhoa" element={<DashboardLayout />}>
    <Route path="dashboard" element={<DashboardKhoa />} />
    <Route path="hoat-dong-khoa/quan-ly" element={<HoatDongKhoaQuanLy />} />
    <Route path="hoat-dong-khoa/duyet" element={<HoatDongKhoaDuyet />} />
  </Route>
);

export default DoanKhoaRoutes;
