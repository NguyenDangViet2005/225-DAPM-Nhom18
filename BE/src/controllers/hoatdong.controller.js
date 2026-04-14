const hoatdongService = require("../services/hoatdong.service");

// Get all activities (school + khoa + chidoan) with pagination
const getAllSchoolActivities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await hoatdongService.getAllSchoolActivities({ page, limit });

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

module.exports = {
  getAllSchoolActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivityRegistrations,
};
