import { Route } from "react-router-dom";
import { ROLES } from "@/constants/roles";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "@/components/layouts/dashboardLayout/DashboardLayout";

// Pages – Admin
import Dashboard from "@/pages/protected/doantruong/dashboard/Dashboard";
import SoDoan from "@/pages/protected/doantruong/so-doan/SoDoan";
import DoanPhi from "@/pages/protected/doantruong/doan-phi/DoanPhi";

// Hoạt động
import HoatDongQuanLy from "@/pages/protected/doantruong/hoat-dong/HoatDongQuanLy";
import HoatDongDuyet from "@/pages/protected/doantruong/hoat-dong/HoatDongDuyet";
import HoatDongXacNhan from "@/pages/protected/doantruong/hoat-dong/HoatDongXacNhan";

import YeuCau from "@/pages/protected/doantruong/yeu-cau/YeuCau";
import TaiKhoan from "@/pages/protected/doantruong/tai-khoan/TaiKhoan";

/**
 * DoanTruongRoutes – chỉ cho phép role DOANTRUONG
 */
const DoanTruongRoutes = (
  <Route
    path="/doan-truong"
    element={<ProtectedRoute allowedRoles={[ROLES.DOANTRUONG]} />}
  >
    <Route element={<DashboardLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="so-doan" element={<SoDoan />} />
      <Route path="doan-phi" element={<DoanPhi />} />

      {/* ── Hoạt động ─────────────────────────────────── */}
      <Route path="hoat-dong/quan-ly" element={<HoatDongQuanLy />} />
      <Route path="hoat-dong/duyet" element={<HoatDongDuyet />} />
      <Route path="hoat-dong/xac-nhan" element={<HoatDongXacNhan />} />

      <Route path="yeu-cau" element={<YeuCau />} />
      <Route path="tai-khoan" element={<TaiKhoan />} />
    </Route>
  </Route>
);

export default DoanTruongRoutes;
