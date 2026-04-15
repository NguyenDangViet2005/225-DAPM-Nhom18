const sodoanService = require("../services/sodoan.service");

const sodoanController = {
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
