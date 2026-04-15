const express = require("express");
const router = express.Router();
const {
  getAllSchoolActivities,
  getAllKhoaActivities,
  getAllChidoanActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  xacNhanHoanThanh,
} = require("../controllers/hoatdong.controller");
const {
  createActivityValidator,
  updateActivityValidator,
} = require("../validators/hoatdong.validator");
const { verifyToken } = require("../middlewares/auth.middleware");

// All routes require authentication
router.use(verifyToken);

// ─────────────────────────────────────────────────────────
// READ ENDPOINTS (all authenticated users can access)
// ─────────────────────────────────────────────────────────

// Get all school-level activities
router.get("/doantruong", getAllSchoolActivities);

// Get all khoa-level activities
router.get("/khoa/", getAllKhoaActivities);

// Get all chi doan-level activities
router.get("/chidoan/", getAllChidoanActivities);

// Get activity by ID (must be last - generic pattern)
router.get("/:idHD", getActivityById);

// ─────────────────────────────────────────────────────────
// WRITE ENDPOINTS
// Role check in service/controller:
// - DOANTRUONG: create/update/delete school-level (idKhoa=null, idChiDoan=null)
// - DOANKHOA: create/update/delete khoa-level (idKhoa!=null, idChiDoan=null)
// - BITHU: create/update/delete chi doan-level (idKhoa=null, idChiDoan!=null)
// ─────────────────────────────────────────────────────────

// Xác nhận hoàn thành & cộng điểm
router.put("/:idHD/xac-nhan", xacNhanHoanThanh);

// Create new activity
router.post("/", createActivityValidator, createActivity);

// Update activity
router.put("/:idHD", updateActivityValidator, updateActivity);

// Delete activity
router.delete("/:idHD", deleteActivity);

module.exports = router;
