const express = require("express");
const router = express.Router();
const doanvienController = require("../controllers/doanvien.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

// Tất cả route yêu cầu đăng nhập
router.use(verifyToken);

// ── Routes cho Đoàn viên (cá nhân) ──────────────────────
// GET  /api/doan-vien/me  — Xem thông tin cá nhân
router.get("/me", doanvienController.getMyProfile);

// PATCH /api/doan-vien/me — Cập nhật thông tin cá nhân
router.patch("/me", doanvienController.updateMyProfile);

// GET /api/doan-vien/so-doan — Xem sổ đoàn của mình
router.get("/so-doan", doanvienController.getMySoDoan);

// ── Routes cho Đoàn trường (quản lý) ────────────────────
// GET /api/doan-vien/stats — Thống kê đoàn viên
router.get("/stats", checkRole(["DOANTRUONG"]), doanvienController.getStats);

// GET /api/doan-vien/chi-doan — Danh sách chi đoàn
router.get("/chi-doan", checkRole(["DOANTRUONG"]), doanvienController.getChiDoanList);

// GET /api/doan-vien — Danh sách đoàn viên (phân trang)
router.get("/", checkRole(["DOANTRUONG"]), doanvienController.getAll);

// POST /api/doan-vien — Tạo đoàn viên mới
router.post("/", checkRole(["DOANTRUONG"]), doanvienController.create);

// PUT /api/doan-vien/:id — Cập nhật đoàn viên
router.put("/:id", checkRole(["DOANTRUONG"]), doanvienController.update);

// GET /api/doan-vien/:id — Xem chi tiết đoàn viên
router.get("/:id", doanvienController.getById);

// GET /api/doan-vien/:id/full-detail — Xem chi tiết đầy đủ đoàn viên (tất cả quan hệ)
router.get("/:id/full-detail", doanvienController.getFullDetail);

module.exports = router;
