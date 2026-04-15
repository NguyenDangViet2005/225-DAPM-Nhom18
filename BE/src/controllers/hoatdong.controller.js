const hoatdongService = require("../services/hoatdong.service");

// Get all activities (school + khoa + chidoan) with pagination
const getAllSchoolActivities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await hoatdongService.getAllSchoolActivities({
      page,
      limit,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách hoạt động thành công",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};

// Get activity by ID
const getActivityById = async (req, res) => {
  try {
    const { idHD } = req.params;
    const result = await hoatdongService.getActivityById(idHD);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json({
      success: true,
      message: "Lấy thông tin hoạt động thành công",
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

// Create new school-level activity
const createActivity = async (req, res) => {
  try {
    const { idHD, tenHD, moTa, ngayToChuc, diaDiem, soLuongMax, diemHD } =
      req.body;

    const result = await hoatdongService.createActivity({
      idHD,
      tenHD,
      moTa,
      ngayToChuc,
      diaDiem,
      soLuongMax,
      diemHD,
      creatorRole: req.user?.type, // Pass role so service can decide approval status
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json({
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

// Update activity
const updateActivity = async (req, res) => {
  try {
    const { idHD } = req.params;
    const updateData = req.body;

    const result = await hoatdongService.updateActivity(idHD, updateData);

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

// Delete activity
const deleteActivity = async (req, res) => {
  try {
    const { idHD } = req.params;

    const result = await hoatdongService.deleteActivity(idHD);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};

// Get registrations for an activity
const getActivityRegistrations = async (req, res) => {
  try {
    const { idHD } = req.params;

    const result = await hoatdongService.getActivityRegistrations(idHD);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách đăng ký thành công",
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

// Lấy danh sách đăng ký của 1 hoạt động cụ thể
const getDanhSachDangKy = async (req, res) => {
  try {
    const { idHD } = req.params;
    const result = await hoatdongService.getDanhSachDangKy(idHD);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách đăng ký thành công",
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

// Duyệt hoặc từ chối đăng ký của 1 đoàn viên
const duyetDangKy = async (req, res) => {
  try {
    const { idHD } = req.params;
    const { maSV, trangThai, lyDo } = req.body;

    const result = await hoatdongService.duyetDangKy(
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

// Lấy tất cả đơn đăng ký (mọi trạng thái) từ tất cả hoạt động Đoàn Trường
const xacNhanHoanThanh = async (req, res) => {
  try {
    const { idHD } = req.params;
    const result = await hoatdongService.xacNhanHoanThanh(idHD);
    if (!result.success) return res.status(400).json(result);
    return res.status(200).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Lỗi hệ thống", error: error.message });
  }
};

const getAllRegistrations = async (req, res) => {
  try {
    const result = await hoatdongService.getAllRegistrations();
    if (!result.success) return res.status(400).json(result);
    return res.status(200).json({ success: true, data: result.data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Lỗi hệ thống", error: error.message });
  }
};

// Lấy tất cả đơn đăng ký chờ duyệt từ tất cả hoạt động Đoàn Trường
const getAllPendingRegistrations = async (req, res) => {
  try {
    const result = await hoatdongService.getAllPendingRegistrations();

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

// Get all khoa-level activities with pagination
const getAllKhoaActivities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await hoatdongService.getAllKhoaActivities({
      page,
      limit,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách hoạt động khoa thành công",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};

// Get all chi doan-level activities with pagination
const getAllChidoanActivities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await hoatdongService.getAllChidoanActivities({
      page,
      limit,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách hoạt động chi đoàn thành công",
      data: result.data,
      pagination: result.pagination,
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
  getAllSchoolActivities,
  getAllKhoaActivities,
  getAllChidoanActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivityRegistrations,
  getDanhSachDangKy,
  duyetDangKy,
  getAllPendingRegistrations,
  getAllRegistrations,
  xacNhanHoanThanh,
};