import { Route } from "react-router-dom";
import { ROLES } from "@/constants/roles";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "@/components/layouts/dashboardLayout/DashboardLayout";

// Bí thư — Quyền riêng
import BiThuDashboard from "@/pages/protected/bithu/dashboard/BiThuDashboard";
import DoanPhiLop from "@/pages/protected/bithu/doan-phi-lop/DoanPhiLop";
import HoatDongChiDoanXacNhan from "@/pages/protected/bithu/hoat-dong-chi-doan/HoatDongChiDoanXacNhan";
import HoatDongChiDoanDanhSach from "@/pages/protected/bithu/hoat-dong-chi-doan/HoatDongChiDoanDanhSach";
import GuiYeuCauHoatDong from "@/pages/protected/bithu/gui-yeu-cau-hoat-dong/GuiYeuCauHoatDong";
import NopSoDoanLop from "@/pages/protected/bithu/nop-so-doan/NopSoDoanLop";

// Bí thư — Kế thừa từ Đoàn viên
import ThongTinCaNhan from "@/pages/protected/doanvien/thong-tin-ca-nhan/ThongTinCaNhan";
import TinhTrangSo from "@/pages/protected/doanvien/tinh-trang-so/TinhTrangSo";
import LSDoanPhi from "@/pages/protected/doanvien/ls-doan-phi/LSDoanPhi";
import DangKy from "@/pages/protected/doanvien/dang-ky/DangKy";
import LichSuDK from "@/pages/protected/doanvien/lich-su-dk/LichSuDK";
import XemDiem from "@/pages/protected/doanvien/xem-diem/XemDiem";

const BiThuRoutes = (
  <Route
    path="/bi-thu"
    element={<ProtectedRoute allowedRoles={[ROLES.BITHU]} />}
  >
    <Route element={<DashboardLayout />}>
      <Route path="dashboard" element={<BiThuDashboard />} />

      {/* ── Quyền riêng Bí thư ── */}
      <Route path="nop-so-doan" element={<NopSoDoanLop />} />
      <Route path="doan-phi-lop/lap-danh-sach" element={<DoanPhiLop />} />
      <Route path="doan-phi-lop/gui" element={<DoanPhiLop />} />
      <Route path="doan-phi-lop/lich-su" element={<DoanPhiLop />} />
      <Route
        path="hoat-dong-chi-doan/danh-sach"
        element={<HoatDongChiDoanDanhSach />}
      />
      <Route
        path="hoat-dong-chi-doan/xac-nhan"
        element={<HoatDongChiDoanXacNhan />}
      />
      <Route path="gui-yeu-cau-hoat-dong" element={<GuiYeuCauHoatDong />} />

      {/* ── Kế thừa từ Đoàn viên ── */}
      <Route path="thong-tin-ca-nhan" element={<ThongTinCaNhan />} />
      <Route path="tinh-trang-so" element={<TinhTrangSo />} />
      <Route path="doan-phi/tinh-trang" element={<LSDoanPhi />} />
      <Route path="hoat-dong/dang-ky" element={<DangKy />} />
      <Route path="hoat-dong/lich-su" element={<LichSuDK />} />
      <Route path="hoat-dong/diem" element={<XemDiem />} />
    </Route>
  </Route>
);

export default BiThuRoutes;
