const { loginService } = require("../services/auth.service");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt.util");

const login = async (req, res) => {
  try {
    const { tenNguoiDung, matKhau } = req.body;

    const result = await loginService(tenNguoiDung, matKhau);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: result.message,
      });
    }

    const accessToken = generateAccessToken({
      idUser: result.data.idUser,
      tenNguoiDung: result.data.tenNguoiDung,
      type: result.data.type,
      idVaiTro: result.data.idVaiTro,
    });

    const refreshToken = generateRefreshToken({
      idUser: result.data.idUser,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: result.message,
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
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token không được cung cấp",
      });
    }

    const decoded = verifyRefreshToken(refreshToken);

    const newAccessToken = generateAccessToken({
      idUser: decoded.idUser,
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Làm mới token thành công",
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Refresh token không hợp lệ hoặc đã hết hạn",
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Đăng xuất thành công",
  });
};

const getMe = (req, res) => {
  // req.user is populated by verifyToken middleware
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  login,
  refreshTokenHandler,
  logout,
  getMe,
};
