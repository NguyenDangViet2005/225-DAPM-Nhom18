const express = require("express");
const router = express.Router();

// Import routes
const taiKhoanRoutes = require("./auth.routes");

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

module.exports = router;
