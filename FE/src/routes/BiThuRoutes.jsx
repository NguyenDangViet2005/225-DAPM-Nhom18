import { Route } from 'react-router-dom';
import { ROLES } from '@/constants/roles';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '@/components/layouts/dashboardLayout/DashboardLayout';

// Bí thư
import BiThuDashboard from '@/pages/bithu/dashboard/BiThuDashboard';
import DoanPhiLop from '@/pages/bithu/doan-phi-lop/DoanPhiLop';
import HoatDongChiDoanXacNhan from '@/pages/bithu/hoat-dong-chi-doan/HoatDongChiDoanXacNhan';
import HoatDongChiDoanDanhSach from '@/pages/bithu/hoat-dong-chi-doan/HoatDongChiDoanDanhSach';
import GuiYeuCauHoatDong from '@/pages/bithu/gui-yeu-cau-hoat-dong/GuiYeuCauHoatDong';
// Kế thừa từ Đoàn viên
import SoDoanCaNhan from '@/pages/doanvien/so-doan/SoDoanCaNhan';
import DoanPhiLichSu from '@/pages/doanvien/doan-phi-lich-su/DoanPhiLichSu';
import HoatDongDangKy from '@/pages/doanvien/hoat-dong-ca-nhan/HoatDongDangKy';
import HoatDongLichSu from '@/pages/doanvien/hoat-dong-ca-nhan/HoatDongLichSu';
import HoatDongDiem from '@/pages/doanvien/hoat-dong-ca-nhan/HoatDongDiem';

const BiThuRoutes = (
  <Route path="/bi-thu" element={<ProtectedRoute allowedRoles={[ROLES.BITHU]} />}>
    <Route element={<DashboardLayout />}>
      <Route index element={<BiThuDashboard />} />
      <Route path="dashboard" element={<BiThuDashboard />} />

      {/* ── Quyền riêng Bí thư ── */}
      <Route path="doan-phi-lop/lap-danh-sach" element={<DoanPhiLop />} />
      <Route path="doan-phi-lop/gui" element={<DoanPhiLop />} />
      <Route path="hoat-dong-chi-doan/danh-sach" element={<HoatDongChiDoanDanhSach />} />
      <Route path="hoat-dong-chi-doan/xac-nhan" element={<HoatDongChiDoanXacNhan />} />
      <Route path="gui-yeu-cau-hoat-dong" element={<GuiYeuCauHoatDong />} />

      {/* ── Kế thừa từ Đoàn viên ── */}
      <Route path="so-doan" element={<SoDoanCaNhan />} />
      <Route path="doan-phi/lich-su" element={<DoanPhiLichSu />} />
      <Route path="hoat-dong-ca-nhan/dang-ky" element={<HoatDongDangKy />} />
      <Route path="hoat-dong-ca-nhan/lich-su" element={<HoatDongLichSu />} />
      <Route path="hoat-dong-ca-nhan/diem" element={<HoatDongDiem />} />
    </Route>
  </Route>
);

export default BiThuRoutes;
