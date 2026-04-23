const sodoanService = require("../services/sodoan.service");

const sodoanController = {
  getLopSoDoan: async (req, res) => {
    try {
      const idDV = req.user.idDV; // Lấy từ token
      if (!idDV)
        return res
          .status(403)
          .json({ success: false, message: "Không xác định được bí thư" });

      const data = await sodoanService.getLopSoDoan(idDV);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  submitLopSoDoan: async (req, res) => {
    try {
      const { idSoDoans } = req.body;
      if (!idSoDoans || !Array.isArray(idSoDoans) || idSoDoans.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Danh sách nộp sổ không hợp lệ" });
      }
      await sodoanService.submitLopSoDoan(idSoDoans);
      return res
        .status(200)
        .json({ success: true, message: "Nộp danh sách thành công" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  getSoDoanChoDuyet: async (req, res) => {
    try {
      const data = await sodoanService.getSoDoanChoDuyet();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  createSoDoan: async (req, res) => {
    try {
      const { idDV, ngayCap, noiCap } = req.body;
      if (!idDV) {
        return res
          .status(400)
          .json({ success: false, message: "Cần mã đoàn viên" });
      }
      const result = await sodoanService.createSoDoan(idDV, ngayCap, noiCap);
      return res
        .status(201)
        .json({ success: true, message: "Tiếp nhận thành công", data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  duyetSoDoanLop: async (req, res) => {
    try {
      const { idSoDoans, trangThai } = req.body;
      if (!idSoDoans || !Array.isArray(idSoDoans) || idSoDoans.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Danh sách không hợp lệ" });
      }
      // trangThai nhận: "Đã nộp sổ" hoặc "Chưa nộp sổ" (từ chối/bỏ qua)
      if (!["Đã nộp sổ", "Chưa nộp sổ"].includes(trangThai)) {
        return res
          .status(400)
          .json({ success: false, message: "Trạng thái không hợp lệ" });
      }

      await sodoanService.duyetSoDoanLop(idSoDoans, trangThai);
      return res
        .status(200)
        .json({ success: true, message: "Cập nhật thành công!" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await sodoanService.getAllSoDoan(page, limit);

      return res.status(200).json({
        success: true,
        data: result.rows,
        pagination: {
          totalItems: result.count,
          currentPage: page,
          totalPages: Math.ceil(result.count / limit),
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const data = await sodoanService.getSoDoanById(req.params.id);
      if (!data)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy sổ đoàn" });
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  updateTrangThai: async (req, res) => {
    try {
      const { trangThai } = req.body;
      const data = await sodoanService.updateTrangThai(
        req.params.id,
        trangThai,
      );
      return res
        .status(200)
        .json({ success: true, data, message: "Cập nhật thành công" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = sodoanController;
