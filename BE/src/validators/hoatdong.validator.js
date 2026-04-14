const createActivityValidator = (req, res, next) => {
  const { idHD, tenHD, ngayToChuc, diaDiem, soLuongMax } = req.body;

  // Check if required fields exist
  if (!idHD || !tenHD) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng cung cấp idHD và tenHD",
    });
  }

  // Validate string fields
  if (typeof idHD !== "string" || typeof tenHD !== "string") {
    return res.status(400).json({
      success: false,
      message: "idHD và tenHD phải là chuỗi ký tự",
    });
  }

  // Validate empty strings
  if (idHD.trim().length === 0 || tenHD.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "idHD và tenHD không được để trống",
    });
  }

  // Validate soLuongMax if provided
  if (soLuongMax !== undefined && soLuongMax !== null) {
    if (typeof soLuongMax !== "number" || soLuongMax < 0) {
      return res.status(400).json({
        success: false,
        message: "soLuongMax phải là số dương",
      });
    }
  }

  next();
};

const updateActivityValidator = (req, res, next) => {
  const { idHD } = req.params;

  if (!idHD || idHD.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "idHD không hợp lệ",
    });
  }

  next();
};

module.exports = {
  createActivityValidator,
  updateActivityValidator,
};
