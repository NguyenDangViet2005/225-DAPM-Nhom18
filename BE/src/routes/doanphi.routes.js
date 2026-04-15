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
  putDuyetPhieuThu,
} = require("../controllers/doanphi.controller");
const { createMucDoanPhiValidator } = require("../validators/doanphi.validator");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

router.use(verifyToken);
router.use(checkRole(["DOANTRUONG"]));

// ── Mức đoàn phí ─────────────────────────────────────────
router.get("/muc-phi", getMucDoanPhi);
router.post("/muc-phi", createMucDoanPhiValidator, postMucDoanPhi);
router.put("/muc-phi/:idMucDP", putMucDoanPhi);

// ── Tình trạng nộp đoàn phí ──────────────────────────────
router.get("/stats", getDoanPhiStats);
router.get("/chi-doan", getChiDoan);
router.get("/", getDoanPhi);

// ── Phiếu thu ────────────────────────────────────────────
router.get("/phieu-thu", getPhieuThu);
router.put("/phieu-thu/:idPhieuThu", putDuyetPhieuThu);

module.exports = router;
