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
  getActivityRegistrations,
} = require("../controllers/hoatdong.controller");
const {
  createActivityValidator,
  updateActivityValidator,
} = require("../validators/hoatdong.validator");
const { verifyToken } = require("../middlewares/auth.middleware");

// All routes require authentication
router.use(verifyToken);

// Get all school-level activities
router.get("/doantruong", getAllSchoolActivities);

// Get all khoa-level activities
router.get("/khoa/", getAllKhoaActivities);

// Get all chi doan-level activities
router.get("/chidoan/", getAllChidoanActivities);

// Get registrations for an activity
router.get("/:idHD/registrations", getActivityRegistrations);

// Get activity by ID (must be last - generic pattern)
router.get("/:idHD", getActivityById);

// Create new activity
router.post("/", createActivityValidator, createActivity);

// Update activity
router.put("/:idHD", updateActivityValidator, updateActivity);

// Delete activity
router.delete("/:idHD", deleteActivity);

module.exports = router;
