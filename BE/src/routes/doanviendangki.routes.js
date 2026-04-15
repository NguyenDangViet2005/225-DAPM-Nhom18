const express = require("express");
const router = express.Router();
const {
  getAllPendingRegistrations,
  getAllRegistrations,
  duyetDangKy,
  getActivityRegistrations,
  getApprovedActivityRegistrations,
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

// Get all registrations for a specific activity (all statuses)
router.get("/:idHD/registrations", getActivityRegistrations);

// Get only approved registrations for a specific activity
router.get("/:idHD/approved-registrations", getApprovedActivityRegistrations);

// Duyệt hoặc từ chối đăng ký (Đoàn Trường only)
router.put(
  "/doantruong/:idHD/duyet",
  checkRole(["DOANTRUONG"]),
  duyetDangKyValidator,
  duyetDangKy,
);

module.exports = router;
