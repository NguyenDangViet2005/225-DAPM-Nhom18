const express = require("express");
const router = express.Router();
const {
  getDoanVienDropdown,
  getKhoaDropdown,
  getAllTaiKhoan,
  getTaiKhoanById,
  getAllVaiTro,
  createTaiKhoan,
  updateTaiKhoan,
  resetPassword,
  toggleTrangThai,
  getStats,
} = require("../controllers/taikhoan.controller");
const {
  createTaiKhoanValidator,
  updateTaiKhoanValidator,
  resetPasswordValidator,
} = require("../validators/taikhoan.validator");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

// Tất cả các route đều yêu cầu đăng nhập và là Đoàn Trường
const requireDoanTruong = [verifyToken, checkRole(["DOANTRUONG"])];

// GET /api/tai-khoan/stats          – thống kê
router.get("/stats", requireDoanTruong, getStats);

// GET /api/tai-khoan/vai-tro/list   – danh sách vai trò (dropdown)
router.get("/vai-tro/list", requireDoanTruong, getAllVaiTro);

// GET /api/tai-khoan/dropdown/doan-vien  – đoàn viên chưa có tài khoản
router.get("/dropdown/doan-vien", requireDoanTruong, getDoanVienDropdown);

// GET /api/tai-khoan/dropdown/khoa       – danh sách khoa
router.get("/dropdown/khoa", requireDoanTruong, getKhoaDropdown);


// GET /api/tai-khoan                – danh sách tài khoản
router.get("/", requireDoanTruong, getAllTaiKhoan);

// GET /api/tai-khoan/:id            – chi tiết tài khoản
router.get("/:id", requireDoanTruong, getTaiKhoanById);

// POST /api/tai-khoan               – tạo tài khoản mới
router.post("/", requireDoanTruong, createTaiKhoanValidator, createTaiKhoan);

// PUT /api/tai-khoan/:id            – cập nhật thông tin tài khoản
router.put("/:id", requireDoanTruong, updateTaiKhoanValidator, updateTaiKhoan);

// PATCH /api/tai-khoan/:id/reset-password – đặt lại mật khẩu
router.patch("/:id/reset-password", requireDoanTruong, resetPasswordValidator, resetPassword);

// PATCH /api/tai-khoan/:id/toggle-status  – khóa / mở khóa tài khoản
router.patch("/:id/toggle-status", requireDoanTruong, toggleTrangThai);

module.exports = router;
