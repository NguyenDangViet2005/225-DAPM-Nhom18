const express = require("express");
const router = express.Router();
const sodoanController = require("../controllers/sodoan.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

// Cấp quyền theo từng route
router.get("/lop/ds", verifyToken, checkRole(["BITHU", "VT003"]), sodoanController.getLopSoDoan);
router.patch("/lop/nop", verifyToken, checkRole(["BITHU", "VT003"]), sodoanController.submitLopSoDoan);

router.get("/", verifyToken, checkRole(["DOANTRUONG", "VT001"]), sodoanController.getAll);
router.get("/:id", verifyToken, checkRole(["DOANTRUONG", "VT001"]), sodoanController.getById);
router.patch("/:id/trang-thai", verifyToken, checkRole(["DOANTRUONG", "VT001"]), sodoanController.updateTrangThai);

module.exports = router;
