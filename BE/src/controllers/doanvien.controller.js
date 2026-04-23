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
   * GET /api/doan-vien/so-doan
   * Lấy thông tin sổ đoàn của đoàn viên đang đăng nhập
   */
  getMySoDoan: async (req, res) => {
    try {
      const idDV = req.user?.idDV;

      if (!idDV) {
        return res.status(403).json({
          success: false,
          message: "Tài khoản này không liên kết với đoàn viên nào",
        });
      }

      const soDoan = await doanvienService.getMySoDoan(idDV);

      if (!soDoan) {
        return res.status(404).json({
          success: false,
          message: "Chưa có thông tin sổ đoàn",
        });
      }

      return res.status(200).json({ success: true, data: soDoan });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * GET /api/doan-vien
   * Lấy danh sách đoàn viên với phân trang và tìm kiếm
   */
  getAll: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const result = await doanvienService.getAll(
        parseInt(page),
        parseInt(limit),
        search
      );
      return res.status(200).json({ success: true, ...result });
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
      const list = await doanvienService.getChiDoanList();
      return res.status(200).json({ success: true, data: list });
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
      const doanvien = await doanvienService.create(req.body);
      return res.status(201).json({ success: true, data: doanvien });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  /**
   * PUT /api/doan-vien/:id
   * Cập nhật đoàn viên
   */
  update: async (req, res) => {
    try {
      const doanvien = await doanvienService.update(req.params.id, req.body);
      if (!doanvien) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đoàn viên",
        });
      }
      return res.status(200).json({ success: true, data: doanvien });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const doanvien = await doanvienService.getProfile(id);
      if (!doanvien) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy đoàn viên" });
      }
      return res.status(200).json({ success: true, data: doanvien });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = doanvienController;
