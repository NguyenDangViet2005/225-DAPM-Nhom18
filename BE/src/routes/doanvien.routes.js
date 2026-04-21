const express = require("express");
const router = express.Router();
const doanvienController = require("../controllers/doanvien.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Tất cả route yêu cầu đăng nhập
router.use(verifyToken);

// GET  /api/doan-vien/me  — Xem thông tin cá nhân
router.get("/me", doanvienController.getMyProfile);

// PATCH /api/doan-vien/me — Cập nhật thông tin cá nhân
router.patch("/me", doanvienController.updateMyProfile);

// GET /api/doan-vien/search/:mssv — Tìm kiếm đoàn viên theo mã sinh viên
router.get("/search/:mssv", doanvienController.searchByMSSV);

// GET /api/doan-vien/stats — Lấy thống kê đoàn viên
router.get("/stats", doanvienController.getStats);

// GET /api/doan-vien/chi-doan — Lấy danh sách chi đoàn
router.get("/chi-doan", doanvienController.getChiDoanList);

// GET /api/doan-vien — Lấy danh sách đoàn viên (có phân trang, tìm kiếm)
router.get("/", doanvienController.getAll);

// POST /api/doan-vien — Tạo đoàn viên mới
router.post("/", doanvienController.create);

// PUT /api/doan-vien/:id — Cập nhật đoàn viên
router.put("/:id", doanvienController.update);

// GET /api/doan-vien/:id — Lấy thông tin đoàn viên theo ID
router.get("/:id", doanvienController.getById);

module.exports = router;
