const bcrypt = require("bcryptjs");
const { TaiKhoan, DoanVien, Khoa, VaiTro } = require("../models");

const loginService = async (tenNguoiDung, matKhau) => {
  try {
    // 1. Find account by username
    const account = await TaiKhoan.findOne({
      where: { tenNguoiDung },
      include: [
        { model: VaiTro, as: "vaiTro" },
        { model: DoanVien, as: "doanVien" },
        { model: Khoa, as: "khoaTK" },
      ],
    });

    if (!account) {
      return {
        success: false,
        message: "Tên đăng nhập không tồn tại",
      };
    }

    // 2. Check if account is active
    if (!account.trangThai) {
      return {
        success: false,
        message: "Tài khoản này đã bị khóa",
      };
    }

    // 3. Check password using bcrypt
    const isPasswordValid = await bcrypt.compare(matKhau, account.matKhau);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Mật khẩu không chính xác",
      };
    }

    // 4. Determine role and get related info
    let roleInfo = {};

    if (account.idDV) {
      // Has idDV -> Bí thư Chi đoàn or Đoàn viên
      const doanVien = account.doanVien;
      const role =
        doanVien.chucVu === "Bí thư Chi đoàn" ? "BITHU" : "DOANVIEN";
      roleInfo = {
        type: role,
        idDV: account.idDV,
        hoTen: doanVien.hoTen,
        chucVu: doanVien.chucVu, // 'Bí thư Chi đoàn' or 'Đoàn viên'
        idChiDoan: doanVien.idChiDoan,
        chiDoan: doanVien.chiDoan,
      };
    } else if (account.idKhoa) {
      // Has idKhoa -> Đoàn Khoa
      const khoa = account.khoaTK;
      roleInfo = {
        type: "DOANKHOA",
        idKhoa: account.idKhoa,
        tenKhoa: khoa.tenKhoa,
      };
    } else {
      // No idDV, no idKhoa -> Đoàn Trưởng (Admin)
      roleInfo = {
        type: "DOANTRUONG",
      };
    }

    // 5. Build response with user data
    const userData = {
      idUser: account.idUser,
      tenNguoiDung: account.tenNguoiDung,
      idVaiTro: account.idVaiTro,
      tenVaiTro: account.vaiTro?.tenVaiTro,
      ngayTao: account.ngayTao,
      ...roleInfo,
    };

    return {
      success: true,
      message: "Đăng nhập thành công",
      data: userData,
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi hệ thống",
    };
  }
};

module.exports = {
  loginService,
};
