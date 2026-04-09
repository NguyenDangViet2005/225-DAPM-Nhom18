import { Route } from "react-router-dom";
import { ROLES } from "@/constants/roles";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "@/components/layouts/dashboardLayout/DashboardLayout";

import ThongTinCaNhan from "@/pages/protected/doanvien/thong-tin-ca-nhan/ThongTinCaNhan";
import TinhTrangSo from "@/pages/protected/doanvien/tinh-trang-so/TinhTrangSo";
import LSDoanPhi from "@/pages/protected/doanvien/ls-doan-phi/LSDoanPhi";
import DangKy from "@/pages/protected/doanvien/dang-ky/DangKy";
import LichSuDK from "@/pages/protected/doanvien/lich-su-dk/LichSuDK";
import XemDiem from "@/pages/protected/doanvien/xem-diem/XemDiem";

const DoanVienRoutes = (
  <Route
    path="/doan-vien"
    element={<ProtectedRoute allowedRoles={[ROLES.DOANVIEN, ROLES.BITHU]} />}
  >
    <Route element={<DashboardLayout />}>
      <Route index element={<ThongTinCaNhan />} />
      <Route path="thong-tin-ca-nhan" element={<ThongTinCaNhan />} />
      <Route path="tinh-trang-so" element={<TinhTrangSo />} />
      <Route path="doan-phi/tinh-trang" element={<LSDoanPhi />} />
      <Route path="hoat-dong/dang-ky" element={<DangKy />} />
      <Route path="hoat-dong/lich-su" element={<LichSuDK />} />
      <Route path="hoat-dong/diem" element={<XemDiem />} />
    </Route>
  </Route>
);

export default DoanVienRoutes;
