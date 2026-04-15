const loginValidator = (req, res, next) => {
  // Check if body exists
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message:
        "Request body không được để trống. Vui lòng gửi JSON với tenNguoiDung và matKhau",
    });
  }

  const { tenNguoiDung, matKhau } = req.body;

  // Validate input
  if (!tenNguoiDung || !matKhau) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập tên đăng nhập và mật khẩu",
    });
  }

  if (typeof tenNguoiDung !== "string" || typeof matKhau !== "string") {
    return res.status(400).json({
      success: false,
      message: "Tên đăng nhập và mật khẩu phải là chuỗi ký tự",
    });
  }

  if (tenNguoiDung.trim().length === 0 || matKhau.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Tên đăng nhập và mật khẩu không được để trống",
    });
  }

  next();
};

module.exports = {
  loginValidator,
};
