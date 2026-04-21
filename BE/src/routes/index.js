const express = require("express");
const router = express.Router();

// Import routes
const taiKhoanRoutes = require("./auth.routes");
const hoatdongRoutes = require("./hoatdong.routes");
const doanphiRoutes = require("./doanphi.routes");
const doanviendangkiRoutes = require("./doanviendangki.routes");
const sodoanRoutes = require("./sodoan.routes");
const quanLyTaiKhoanRoutes = require("./taikhoan.routes");
const doanvienRoutes = require("./doanvien.routes");

// Health check route
router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date(),
  });
});

// Auth routes
router.use("/auth", taiKhoanRoutes);

// Hoạt động routes
router.use("/hoatdong", hoatdongRoutes);

// Đoàn viên đăng ký routes
router.use("/doanviendangki", doanviendangkiRoutes);

// Sổ đoàn routes
router.use("/sodoan", sodoanRoutes);
// Đoàn phí routes
router.use("/doan-phi", doanphiRoutes);

// Quản lý tài khoản routes (Đoàn Trường)
router.use("/tai-khoan", quanLyTaiKhoanRoutes);

// Đoàn viên routes
router.use("/doan-vien", doanvienRoutes);

module.exports = router;
