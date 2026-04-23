const { validationResult } = require("express-validator");
const {
  getAllMucDoanPhi,
  createMucDoanPhi,
  updateMucDoanPhi,
  getAllDoanPhi,
  getMyDoanPhi,
  getAllPhieuThu,
  duyetPhieuThu,
  createPhieuThu,
  getAllChiDoan,
  getStats,
} = require("../services/doanphi.service");

// ── MUC DOAN PHI ─────────────────────────────────────────

const getMucDoanPhi = async (req, res) => {
  try {
    const data = await getAllMucDoanPhi();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const postMucDoanPhi = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const data = await createMucDoanPhi(req.body);
    return res.status(201).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const putMucDoanPhi = async (req, res) => {
  try {
    const data = await updateMucDoanPhi(req.params.idMucDP, req.body);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    const status = error.message.includes("Không tìm thấy") ? 404 : 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};

// ── DOAN PHI ─────────────────────────────────────────────

/**
 * GET /api/doan-phi/me
 * Đoàn viên xem lịch sử đóng đoàn phí của chính mình
 */
const getMyDoanPhiController = async (req, res) => {
  try {
    const idDV = req.user?.idDV;
    if (!idDV) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản này không liên kết với đoàn viên nào",
      });
    }
    const data = await getMyDoanPhi(idDV);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getDoanPhi = async (req, res) => {  try {
    const { search, trangThai, idChiDoan, page, limit } = req.query;
    const data = await getAllDoanPhi({
      search,
      trangThai,
      idChiDoan,
      page,
      limit,
    });
    return res.status(200).json({ success: true, ...data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getChiDoan = async (req, res) => {
  try {
    const data = await getAllChiDoan();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getDoanPhiStats = async (req, res) => {
  try {
    const { idChiDoan, namHoc } = req.query;
    const data = await getStats({ idChiDoan, namHoc });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── PHIEU THU ────────────────────────────────────────────

const getPhieuThu = async (req, res) => {
  try {
    const { trangThai } = req.query;
    const data = await getAllPhieuThu({ trangThai }, req.user);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const postPhieuThu = async (req, res) => {
  try {
    const data = await require("../services/doanphi.service").createPhieuThu(
      req.body,
      req.user,
    );
    const idUser = req.user.idUser;
    const { listIdDoanPhi, fileDinhKem } = req.body;
    const data = await createPhieuThu({ idUser, listIdDoanPhi, fileDinhKem });
    return res.status(201).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const putDuyetPhieuThu = async (req, res) => {
  try {
    const { trangThai } = req.body;
    if (!["Đã duyệt", "Từ chối"].includes(trangThai)) {
      return res
        .status(400)
        .json({ success: false, message: "Trạng thái không hợp lệ" });
    }
    const data = await duyetPhieuThu(req.params.idPhieuThu, trangThai);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    const status = error.message.includes("Không tìm thấy") ? 404 : 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMucDoanPhi,
  postMucDoanPhi,
  putMucDoanPhi,
  getMyDoanPhiController,
  getDoanPhi,
  getChiDoan,
  getDoanPhiStats,
  getPhieuThu,
  postPhieuThu,
  putDuyetPhieuThu,
};
