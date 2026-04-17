const doanviendangkiService = require("../services/doanviendangki.service");

// Duyệt hoặc từ chối đơn đăng ký
const duyetDangKy = async (req, res) => {
  try {
    const { idHD } = req.params;
    const { maSV, trangThai, lyDo } = req.body;

    const result = await doanviendangkiService.duyetDangKy(
      idHD,
      maSV,
      trangThai,
      lyDo,
    );

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};

// Get tất cả đơn đăng ký (mọi trạng thái) từ tất cả hoạt động Đoàn Trường
const getAllRegistrations = async (req, res) => {
  try {
    const result = await doanviendangkiService.getAllRegistrations();

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách đơn đăng ký thành công",
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};

// Get tất cả đơn đăng ký chờ duyệt từ tất cả hoạt động Đoàn Trường
const getAllPendingRegistrations = async (req, res) => {
  try {
    const result = await doanviendangkiService.getAllPendingRegistrations();

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách đơn đăng ký chờ duyệt thành công",
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};

// Get dashboard data cho Đoàn Trường
const getDoanTruongDashboardData = async (req, res) => {
  try {
    const result = await doanviendangkiService.getDoanTruongDashboardData();

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json({
      success: true,
      message: "Lấy dữ liệu dashboard Đoàn Trường thành công",
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};

// Get all registrations for a specific activity (all statuses)
const getActivityRegistrations = async (req, res) => {
  try {
    const { idHD } = req.params;
    const result = await doanviendangkiService.getActivityRegistrations(idHD);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách đăng ký hoạt động thành công",
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};

// Get only approved registrations for a specific activity
const getApprovedActivityRegistrations = async (req, res) => {
  try {
    const { idHD } = req.params;
    const result =
      await doanviendangkiService.getApprovedActivityRegistrations(idHD);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách đoàn viên đã duyệt thành công",
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};

module.exports = {
  duyetDangKy,
  getAllRegistrations,
  getAllPendingRegistrations,
  getDoanTruongDashboardData,
  getActivityRegistrations,
  getApprovedActivityRegistrations,
};
