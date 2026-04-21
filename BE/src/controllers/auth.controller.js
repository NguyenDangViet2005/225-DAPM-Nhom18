const { loginService } = require("../services/auth.service");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt.util");
const { TaiKhoan, DoanVien, Khoa, VaiTro } = require("../models");

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
      idDV: result.data.idDV || null,
      idKhoa: result.data.idKhoa || null,
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

    // Get full user info from database to determine role
    const account = await TaiKhoan.findOne({
      where: { idUser: decoded.idUser },
      include: [
        { model: VaiTro, as: "vaiTro" },
        { model: DoanVien, as: "doanVien" },
        { model: Khoa, as: "khoaTK" },
      ],
    });

    if (!account) {
      return res.status(401).json({
        success: false,
        message: "Tài khoản không tồn tại",
      });
    }

    // Determine role
    let userType = "DOANTRUONG";
    if (account.idDV) {
      const doanVien = account.doanVien;
      userType = doanVien.chucVu === "Bí thư Chi đoàn" ? "BITHU" : "DOANVIEN";
    } else if (account.idKhoa) {
      userType = "DOANKHOA";
    }

    // Create new access token with full user info (including type)
    const newAccessToken = generateAccessToken({
      idUser: account.idUser,
      tenNguoiDung: account.tenNguoiDung,
      type: userType,
      idVaiTro: account.idVaiTro,
      idDV: account.idDV || null,
      idKhoa: account.idKhoa || null,
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
