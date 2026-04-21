const { validationResult } = require("express-validator");
const taiKhoanService = require("../services/taikhoan.service");

/**
 * GET /api/tai-khoan/dropdown/doan-vien?excludeIdDV=xxx
 * Lấy danh sách Đoàn viên chưa có tài khoản (cho dropdown khi tạo/sửa)
 */
const getDoanVienDropdown = async (req, res, next) => {
  try {
    const { excludeIdDV } = req.query;
    const data = await taiKhoanService.getDoanVienChuaCoTaiKhoan(excludeIdDV || null);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tai-khoan/dropdown/khoa
 * Lấy danh sách Khoa (cho dropdown khi tạo/sửa)
 */
const getKhoaDropdown = async (req, res, next) => {
  try {
    const data = await taiKhoanService.getAllKhoa();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};


/**
 * GET /api/tai-khoan
 * Lấy danh sách tài khoản (có phân trang, tìm kiếm, lọc vai trò)
 */
const getAllTaiKhoan = async (req, res, next) => {
  try {
    const { page, limit, search, idVaiTro } = req.query;
    const result = await taiKhoanService.getAllTaiKhoan({ page, limit, search, idVaiTro });

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách tài khoản thành công",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tai-khoan/:id
 * Lấy thông tin một tài khoản
 */
const getTaiKhoanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const taiKhoan = await taiKhoanService.getTaiKhoanById(id);

    return res.status(200).json({
      success: true,
      message: "Lấy thông tin tài khoản thành công",
      data: taiKhoan,
    });
  } catch (error) {
    if (error.message === "Tài khoản không tồn tại") {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

/**
 * GET /api/tai-khoan/vai-tro/list
 * Lấy tất cả vai trò (dùng cho dropdown)
 */
const getAllVaiTro = async (req, res, next) => {
  try {
    const vaiTros = await taiKhoanService.getAllVaiTro();
    return res.status(200).json({ success: true, data: vaiTros });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tai-khoan
 * Tạo tài khoản mới
 */
const createTaiKhoan = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: errors.array(),
      });
    }

    const newTaiKhoan = await taiKhoanService.createTaiKhoan(req.body);

    return res.status(201).json({
      success: true,
      message: "Tạo tài khoản thành công",
      data: newTaiKhoan,
    });
  } catch (error) {
    if (
      error.message === "Tên đăng nhập đã tồn tại" ||
      error.message === "Đoàn viên này đã có tài khoản" ||
      error.message === "Vai trò không tồn tại" ||
      error.message === "Đoàn viên không tồn tại" ||
      error.message === "Khoa không tồn tại"
    ) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

/**
 * PUT /api/tai-khoan/:id
 * Cập nhật thông tin tài khoản
 */
const updateTaiKhoan = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const updated = await taiKhoanService.updateTaiKhoan(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Cập nhật tài khoản thành công",
      data: updated,
    });
  } catch (error) {
    if (error.message === "Tài khoản không tồn tại") {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === "Tên đăng nhập đã tồn tại") {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

/**
 * PATCH /api/tai-khoan/:id/reset-password
 * Đặt lại mật khẩu
 */
const resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const { matKhauMoi } = req.body;
    const result = await taiKhoanService.resetPassword(id, matKhauMoi);

    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "Tài khoản không tồn tại") {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

/**
 * PATCH /api/tai-khoan/:id/toggle-status
 * Khóa / Mở khóa tài khoản
 */
const toggleTrangThai = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await taiKhoanService.toggleTrangThai(id);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: { trangThai: result.trangThai },
    });
  } catch (error) {
    if (error.message === "Tài khoản không tồn tại") {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

/**
 * GET /api/tai-khoan/stats
 * Thống kê tổng quan tài khoản
 */
const getStats = async (req, res, next) => {
  try {
    const stats = await taiKhoanService.getStats();
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoanVienDropdown,
  getKhoaDropdown,
  getAllTaiKhoan,
  getTaiKhoanById,
  getAllVaiTro,
  createTaiKhoan,
  updateTaiKhoan,
  resetPassword,
  toggleTrangThai,
  getStats,
};
