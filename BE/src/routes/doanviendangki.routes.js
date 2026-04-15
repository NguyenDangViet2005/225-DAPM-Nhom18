const express = require("express");
const router = express.Router();
const {
  getAllPendingRegistrations,
  duyetDangKy,
} = require("../controllers/hoatdong.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");
const { duyetDangKyValidator } = require("../validators/hoatdong.validator");

// All routes require authentication
router.use(verifyToken);

// Get tất cả đơn đăng ký chờ duyệt hoạt động Đoàn Trường
// Route: GET /doanviendangki/doantruong/registrations/pending
router.get(
  "/doantruong/registrations/pending",
  checkRole(["DOANTRUONG"]),
  getAllPendingRegistrations,
);

// Duyệt hoặc từ chối đăng ký (Đoàn Trường only)
// Route: PUT /doanviendangki/doantruong/registrations/:idHD/duyet
router.put(
  "/doantruong/:idHD/duyet",
  checkRole(["DOANTRUONG"]),
  duyetDangKyValidator,
  duyetDangKy,
);

module.exports = router;
