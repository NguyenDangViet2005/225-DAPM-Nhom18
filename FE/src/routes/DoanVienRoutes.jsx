import { Route } from 'react-router-dom';
import { ROLES } from '@/constants/roles';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '@/components/layouts/dashboardLayout/DashboardLayout';

import ThongTinCaNhan   from '@/pages/doanvien/thong-tin-ca-nhan/ThongTinCaNhan';
import TinhTrangSo      from '@/pages/doanvien/tinh-trang-so/TinhTrangSo';
import LSDoanPhi        from '@/pages/doanvien/ls-doan-phi/LSDoanPhi';
import DangKy           from '@/pages/doanvien/dang-ky/DangKy';
import LichSuDK         from '@/pages/doanvien/lich-su-dk/LichSuDK';
import XemDiem          from '@/pages/doanvien/xem-diem/XemDiem';

const DoanVienRoutes = (
  <Route element={<ProtectedRoute allowedRoles={[ROLES.DOANVIEN, ROLES.BITHU]} />}>
    <Route element={<DashboardLayout />}>
      <Route path="/thong-tin-ca-nhan"            element={<ThongTinCaNhan />} />
      <Route path="/so-doan"                      element={<TinhTrangSo />} />
      <Route path="/doan-phi/lich-su"             element={<LSDoanPhi />} />
      <Route path="/hoat-dong-ca-nhan/dang-ky"    element={<DangKy />} />
      <Route path="/hoat-dong-ca-nhan/lich-su"    element={<LichSuDK />} />
      <Route path="/hoat-dong-ca-nhan/diem"       element={<XemDiem />} />
    </Route>
  </Route>
);

export default DoanVienRoutes;
