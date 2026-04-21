const doanvienService = require("../services/doanvien.service");

const doanvienController = {
  /**
   * GET /api/doan-vien/me
   * Lấy thông tin cá nhân của đoàn viên đang đăng nhập
   */
  getMyProfile: async (req, res) => {
    try {
      const idDV = req.user?.idDV;

      if (!idDV) {
        return res.status(403).json({
          success: false,
          message: "Tài khoản này không liên kết với đoàn viên nào",
        });
      }

      const profile = await doanvienService.getProfile(idDV);

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy thông tin đoàn viên",
        });
      }

      return res.status(200).json({ success: true, data: profile });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * PATCH /api/doan-vien/me
   * Cập nhật thông tin cá nhân (hoTen, ngaySinh, SDT, email, diaChi)
   */
  updateMyProfile: async (req, res) => {
    try {
      const idDV = req.user?.idDV;

      if (!idDV) {
        return res.status(403).json({
          success: false,
          message: "Tài khoản này không liên kết với đoàn viên nào",
        });
      }

      const updated = await doanvienService.updateProfile(idDV, req.body);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy thông tin đoàn viên",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Cập nhật thông tin thành công",
        data: await doanvienService.getProfile(idDV),
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  /**
   * GET /api/doan-vien/:id
   * Lấy thông tin đoàn viên theo ID
   */
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const doanvien = await doanvienService.getProfile(id);
      if (!doanvien) {
        return res.status(404).json({ success: false, message: "Không tìm thấy đoàn viên" });
      }
      return res.status(200).json({ success: true, data: doanvien });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * GET /api/doan-vien
   * Lấy danh sách đoàn viên (có phân trang, tìm kiếm)
   */
  getAll: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const result = await doanvienService.getAllDoanVien({ page, limit, search });
      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * POST /api/doan-vien
   * Tạo đoàn viên mới
   */
  create: async (req, res) => {
    try {
      const newDoanVien = await doanvienService.createDoanVien(req.body);
      return res.status(201).json({
        success: true,
        message: "Tạo đoàn viên thành công",
        data: newDoanVien,
      });
    } catch (error) {
      if (error.message === "Mã đoàn viên đã tồn tại") {
        return res.status(400).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * PUT /api/doan-vien/:id
   * Cập nhật thông tin đoàn viên
   */
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await doanvienService.updateDoanVien(id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Không tìm thấy đoàn viên" });
      }
      return res.status(200).json({
        success: true,
        message: "Cập nhật đoàn viên thành công",
        data: updated,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * GET /api/doan-vien/search/:mssv
   * Tìm kiếm đoàn viên theo mã sinh viên
   */
  searchByMSSV: async (req, res) => {
    try {
      const { mssv } = req.params;
      const doanvien = await doanvienService.getProfile(mssv);
      if (!doanvien) {
        return res.status(404).json({ success: false, message: "Không tìm thấy đoàn viên" });
      }
      return res.status(200).json({ success: true, data: doanvien });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  /**
   * GET /api/doan-vien/stats
   * Lấy thống kê đoàn viên
   */
  getStats: async (req, res) => {
    try {
      const stats = await doanvienService.getStats();
      return res.status(200).json({ success: true, data: stats });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * GET /api/doan-vien/chi-doan
   * Lấy danh sách chi đoàn
   */
  getChiDoanList: async (req, res) => {
    try {
      const chiDoanList = await doanvienService.getChiDoanList();
      return res.status(200).json({ success: true, data: chiDoanList });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = doanvienController;
