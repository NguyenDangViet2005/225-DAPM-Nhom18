const express = require("express");
const router = express.Router();
const {
  getAllSchoolActivities,
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
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

// All routes require authentication
router.use(verifyToken);

// All routes require DOANTRUONG role
router.use(checkRole(["DOANTRUONG"]));

// Get all school-level activities
router.get("/", getAllSchoolActivities);

// Get registrations for an activity
router.get("/:idHD/registrations", getActivityRegistrations);

// Get activity by ID
router.get("/:idHD", getActivityById);

// Create new activity
router.post("/", createActivityValidator, createActivity);

// Update activity
router.put("/:idHD", updateActivityValidator, updateActivity);

// Delete activity
router.delete("/:idHD", deleteActivity);

module.exports = router;
