const express = require("express");
const router = express.Router();
const {
  getMucDoanPhi,
  postMucDoanPhi,
  putMucDoanPhi,
  getDoanPhi,
  getChiDoan,
  getDoanPhiStats,
  getPhieuThu,
  postPhieuThu,
  putDuyetPhieuThu,
  getMyDoanPhiController,
} = require("../controllers/doanphi.controller");
const {
  createMucDoanPhiValidator,
} = require("../validators/doanphi.validator");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

router.use(verifyToken);

// ── Đoàn viên xem lịch sử đoàn phí của mình (không cần role DOANTRUONG)
router.get("/me", getMyDoanPhiController);

// ── Mức đoàn phí ─────────────────────────────────────────
router.get("/muc-phi", checkRole(["DOANTRUONG"]), getMucDoanPhi);
router.post(
  "/muc-phi",
  checkRole(["DOANTRUONG"]),
  createMucDoanPhiValidator,
  postMucDoanPhi,
);
router.put("/muc-phi/:idMucDP", checkRole(["DOANTRUONG"]), putMucDoanPhi);

// ── Tình trạng nộp đoàn phí ──────────────────────────────
router.get(
  "/stats",
  checkRole(["DOANTRUONG", "DOANKHOA", "BITHU"]),
  getDoanPhiStats,
);
router.get(
  "/chi-doan",
  checkRole(["DOANTRUONG", "DOANKHOA", "BITHU"]),
  getChiDoan,
);
router.get("/", checkRole(["DOANTRUONG", "DOANKHOA", "BITHU"]), getDoanPhi);

// ── Phiếu thu ────────────────────────────────────────────
router.get(
  "/phieu-thu",
  checkRole(["DOANTRUONG", "DOANKHOA", "BITHU"]),
  getPhieuThu,
);
router.post(
  "/phieu-thu",
  checkRole(["BITHU"]),
  upload.single("fileDinhKem"),
  postPhieuThu,
);
router.put(
  "/phieu-thu/:idPhieuThu",
  checkRole(["DOANTRUONG"]),
  putDuyetPhieuThu,
);

module.exports = router;
