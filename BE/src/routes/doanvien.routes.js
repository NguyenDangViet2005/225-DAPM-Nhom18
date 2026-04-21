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

module.exports = router;
