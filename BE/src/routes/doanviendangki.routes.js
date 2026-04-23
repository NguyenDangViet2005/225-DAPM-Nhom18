const express = require("express");
const router = express.Router();
const {
  getAllPendingRegistrations,
  getAllRegistrations,
  duyetDangKy,
  getDoanTruongDashboardData,
  getActivityRegistrations,
  getApprovedActivityRegistrations,
  getChiDoanRegistrations,
  getAvailableActivities,
  dangKyHoatDong,
  huyDangKy,
  getLichSuDangKy,
  getXemDiem,
} = require("../controllers/doanviendangki.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");
const { duyetDangKyValidator } = require("../validators/hoatdong.validator");

// All routes require authentication
router.use(verifyToken);

// Get tất cả đơn đăng ký (mọi trạng thái) hoạt động Đoàn Trường
router.get(
  "/doantruong/registrations/all",
  checkRole(["DOANTRUONG"]),
  getAllRegistrations,
);

// Get tất cả đơn đăng ký chờ duyệt hoạt động Đoàn Trường
router.get(
  "/doantruong/registrations/pending",
  checkRole(["DOANTRUONG"]),
  getAllPendingRegistrations,
);

// Get dashboard data cho Đoàn Trường
router.get(
  "/doantruong/dashboard",
  checkRole(["DOANTRUONG"]),
  getDoanTruongDashboardData,
);

// ── Đoàn viên tự đăng ký / hủy ──────────────────────────
router.get("/available", getAvailableActivities);
router.get("/lich-su", getLichSuDangKy);
router.get("/xem-diem", getXemDiem);
router.post("/:idHD/dang-ky", dangKyHoatDong);
router.delete("/:idHD/huy", huyDangKy);

// Get all registrations for a specific activity (all statuses)
router.get("/:idHD/registrations", getActivityRegistrations);

// Get only approved registrations for a specific activity
router.get("/:idHD/approved-registrations", getApprovedActivityRegistrations);

// Get all registrations for a Chi Doan
router.get(
  "/chidoan/registrations/all",
  checkRole(["BITHU"]),
  getChiDoanRegistrations,
);

// Duyệt hoặc từ chối đăng ký (Đoàn Trường only)
router.put(
  "/doantruong/:idHD/duyet",
  checkRole(["DOANTRUONG"]),
  duyetDangKyValidator,
  duyetDangKy,
);

module.exports = router;
