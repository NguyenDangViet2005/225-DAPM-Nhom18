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
};

module.exports = doanvienController;
