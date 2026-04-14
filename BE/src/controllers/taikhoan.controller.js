const { loginService } = require("../services/taikhoan.service");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt.util");

const login = async (req, res) => {
  try {
    const { tenNguoiDung, matKhau } = req.body;

    // Call login service
    const result = await loginService(tenNguoiDung, matKhau);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: result.message,
      });
    }

    // Generate access token
    const accessToken = generateAccessToken({
      idUser: result.data.idUser,
      tenNguoiDung: result.data.tenNguoiDung,
      type: result.data.type,
      idVaiTro: result.data.idVaiTro,
    });

    // Generate refresh token
    const refreshToken = generateRefreshToken({
      idUser: result.data.idUser,
    });

    // Return success response with tokens and user data
    res.status(200).json({
      success: true,
      message: result.message,
      accessToken,
      refreshToken,
      user: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
    });
  }
};

const refreshTokenHandler = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token không được cung cấp",
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Generate new access token
    const newAccessToken = generateAccessToken({
      idUser: decoded.idUser,
    });

    res.status(200).json({
      success: true,
      message: "Làm mới token thành công",
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Refresh token không hợp lệ hoặc đã hết hạn",
    });
  }
};

module.exports = {
  login,
  refreshTokenHandler,
};
