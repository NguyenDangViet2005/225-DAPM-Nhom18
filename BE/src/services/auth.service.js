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
      // Use include result or direct query
      const doanVien = account.doanVien || await DoanVien.findOne({
        where: { idDV: account.idDV },
      });
      
      console.log("=== AUTH DEBUG ===");
      console.log("account.idDV:", account.idDV);
      console.log("doanVien:", doanVien?.toJSON?.() || doanVien);
      console.log("laBiThu value:", doanVien?.laBiThu);
      console.log("laBiThu type:", typeof doanVien?.laBiThu);
      console.log("laBiThu === 1:", doanVien?.laBiThu === 1);
      console.log("!!laBiThu:", !!doanVien?.laBiThu);
      console.log("==================");
      
      const role = doanVien && !!doanVien.laBiThu ? "BITHU" : "DOANVIEN";
      roleInfo = {
        type: role,
        idDV: account.idDV,
        hoTen: doanVien?.hoTen || "Unknown",
        laBiThu: doanVien?.laBiThu ?? 0,
        idChiDoan: doanVien?.idChiDoan || null,
        chiDoan: doanVien?.chiDoan?.tenChiDoan || null,
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
