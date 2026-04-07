import { Route } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/dashboardLayout/DashboardLayout';

// Pages – Đoàn Khoa
import DashboardKhoa from '@/pages/doankhoa/dashboard/DashboardKhoa';

/**
 * DoanKhoaRoutes – prefix /doankhoa để tránh conflict với DoanTruongRoutes
 */
const DoanKhoaRoutes = (
  <Route path="/doankhoa" element={<DashboardLayout />}>
    <Route path="dashboard" element={<DashboardKhoa />} />
  </Route>
);

export default DoanKhoaRoutes;
