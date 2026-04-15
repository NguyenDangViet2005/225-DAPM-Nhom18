const express = require("express");
const router = express.Router();
const {
  getAllPendingRegistrations,
  getAllRegistrations,
  duyetDangKy,
} = require("../controllers/hoatdong.controller");
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

// Duyệt hoặc từ chối đăng ký (Đoàn Trường only)
router.put(
  "/doantruong/:idHD/duyet",
  checkRole(["DOANTRUONG"]),
  duyetDangKyValidator,
  duyetDangKy,
);

module.exports = router;
