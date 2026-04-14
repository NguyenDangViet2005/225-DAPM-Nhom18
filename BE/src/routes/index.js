const express = require("express");
const router = express.Router();

// Health check route
router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date(),
  });
});

module.exports = router;
