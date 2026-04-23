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

const getDoanPhi = async (req, res) => {
  try {
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
    // Parse listIdDoanPhi if it's a JSON string
    let listIdDoanPhi = req.body.listIdDoanPhi;
    if (typeof listIdDoanPhi === 'string') {
      try {
        listIdDoanPhi = JSON.parse(listIdDoanPhi);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: "Danh sách đoàn phí không đúng định dạng JSON",
        });
      }
    }

    // Validate input
    if (!listIdDoanPhi || !Array.isArray(listIdDoanPhi)) {
      return res.status(400).json({
        success: false,
        message: "Danh sách đoàn phí không hợp lệ (cần mảng ID)",
      });
    }

    if (listIdDoanPhi.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Danh sách đoàn phí không được rỗng",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng đính kèm file chứng từ",
      });
    }

    if (!req.user || !req.user.idUser) {
      return res.status(403).json({
        success: false,
        message: "Thông tin người dùng không hợp lệ",
      });
    }

    // Pass parsed data to service
    const data = await createPhieuThu({ listIdDoanPhi }, req.user, req.file);
    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error("Error in postPhieuThu:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Lỗi khi tạo phiếu thu",
      errorName: error.name,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
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
