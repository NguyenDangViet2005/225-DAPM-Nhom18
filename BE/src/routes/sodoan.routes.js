const express = require("express");
const router = express.Router();
const sodoanController = require("../controllers/sodoan.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

// Chỉ quyền DOANTRUONG được phép truy cập
router.use(verifyToken, checkRole(["DOANTRUONG", "VT001"]));

router.get("/", sodoanController.getAll);
router.get("/:id", sodoanController.getById);
router.patch("/:id/trang-thai", sodoanController.updateTrangThai);

module.exports = router;
