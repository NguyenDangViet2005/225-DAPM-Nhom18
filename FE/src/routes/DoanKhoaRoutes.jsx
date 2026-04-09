import { Route } from "react-router-dom";
import { ROLES } from "@/constants/roles";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "@/components/layouts/dashboardLayout/DashboardLayout";

// Pages – Đoàn Khoa
import DashboardKhoa from "@/pages/protected/doankhoa/dashboard/DashboardKhoa";
import HoatDongKhoaQuanLy from "@/pages/protected/doankhoa/hoat-dong-khoa/HoatDongKhoaQuanLy";
import HoatDongKhoaDuyet from "@/pages/protected/doankhoa/hoat-dong-khoa/HoatDongKhoaDuyet";
import HoatDongKhoaXacNhan from "@/pages/protected/doankhoa/hoat-dong-khoa/HoatDongKhoaXacNhan";
import YeuCauChiDoan from "@/pages/protected/doankhoa/yeu-cau-chi-doan/YeuCauChiDoan";
import GuiYeuCau from "@/pages/protected/doankhoa/gui-yeu-cau/GuiYeuCau";

import BaoCao from "@/pages/protected/doankhoa/bao-cao/BaoCao";

/**
 * DoanKhoaRoutes – prefix /doan-khoa (theo convention của main)
 */
const DoanKhoaRoutes = (
  <Route
    path="/doan-khoa"
    element={<ProtectedRoute allowedRoles={[ROLES.DOANKHOA]} />}
  >
    <Route element={<DashboardLayout />}>
      <Route index element={<DashboardKhoa />} />
      <Route path="dashboard" element={<DashboardKhoa />} />
      <Route path="hoat-dong-khoa/quan-ly" element={<HoatDongKhoaQuanLy />} />
      <Route path="hoat-dong-khoa/duyet" element={<HoatDongKhoaDuyet />} />
      <Route path="hoat-dong-khoa/xac-nhan" element={<HoatDongKhoaXacNhan />} />
      <Route path="yeu-cau-chi-doan" element={<YeuCauChiDoan />} />
      <Route path="gui-yeu-cau" element={<GuiYeuCau />} />
      <Route path="bao-cao" element={<BaoCao />} />
    </Route>
  </Route>
);

export default DoanKhoaRoutes;
