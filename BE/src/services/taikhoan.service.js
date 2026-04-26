const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { TaiKhoan, DoanVien, VaiTro, Khoa, ChiDoan, sequelize } = require("../models");

/**
 * Lấy danh sách Đoàn viên chưa có tài khoản (dùng cho dropdown)
 * Nếu truyền excludeIdDV thì đoàn viên đó vẫn được hiển thị (trường hợp edit)
 */
const getDoanVienChuaCoTaiKhoan = async (excludeIdDV = null) => {
  // Lấy tất cả idDV đã có tài khoản
  const dvsHaveTK = await TaiKhoan.findAll({
    where: { idDV: { [Op.ne]: null } },
    attributes: ["idDV"],
  });
  const usedIds = dvsHaveTK.map((tk) => tk.idDV).filter((id) => id !== excludeIdDV);

  return await DoanVien.findAll({
    where: {
      idDV: { [Op.notIn]: usedIds.length > 0 ? usedIds : ["__NONE__"] },
    },
    include: [{ model: ChiDoan, as: "chiDoan", attributes: ["tenChiDoan"] }],
    attributes: ["idDV", "hoTen", "laBiThu", "idChiDoan"],
    order: [["hoTen", "ASC"]],
  });
};

/**
 * Lấy tất cả Khoa (dùng cho dropdown — nhiều tài khoản có thể cùng 1 khoa)
 */
const getAllKhoa = async () => {
  return await Khoa.findAll({ order: [["tenKhoa", "ASC"]] });
};


/**
 * Lấy danh sách tài khoản (có phân trang + tìm kiếm + lọc theo vai trò)
 */
const getAllTaiKhoan = async ({ page = 1, limit = 10, search = "", idVaiTro = "" }) => {
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const whereClause = {};

  if (search) {
    whereClause.tenNguoiDung = { [Op.like]: `%${search}%` };
  }

  if (idVaiTro) {
    whereClause.idVaiTro = idVaiTro;
  }

  const { count, rows } = await TaiKhoan.findAndCountAll({
    where: whereClause,
    include: [
      { model: VaiTro, as: "vaiTro", attributes: ["idVaiTro", "tenVaiTro"] },
      { model: DoanVien, as: "doanVien", attributes: ["idDV", "hoTen", "idChiDoan"] },
      { model: Khoa, as: "khoaTK", attributes: ["idKhoa", "tenKhoa"] },
    ],
    attributes: { exclude: ["matKhau"] },
    limit: parseInt(limit),
    offset,
    order: [["ngayTao", "DESC"]],
  });

  return {
    data: rows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / parseInt(limit)),
    },
  };
};

/**
 * Lấy thông tin một tài khoản theo ID
 */
const getTaiKhoanById = async (idUser) => {
  const taiKhoan = await TaiKhoan.findByPk(idUser, {
    include: [
      { model: VaiTro, as: "vaiTro" },
      { model: DoanVien, as: "doanVien" },
      { model: Khoa, as: "khoaTK" },
    ],
    attributes: { exclude: ["matKhau"] },
  });

  if (!taiKhoan) {
    throw new Error("Tài khoản không tồn tại");
  }

  return taiKhoan;
};

/**
 * Lấy danh sách tất cả vai trò (dùng cho dropdown)
 */
const getAllVaiTro = async () => {
  return await VaiTro.findAll({ order: [["tenVaiTro", "ASC"]] });
};

/**
 * Tạo tài khoản mới
 * - tenNguoiDung: tên đăng nhập (unique)
 * - matKhau: mật khẩu thô (sẽ được hash)
 * - idVaiTro: FK về VaiTro
 * - idDV (optional): FK về DoanVien (nếu là Bí thư / Đoàn viên)
 * - idKhoa (optional): FK về Khoa (nếu là Đoàn khoa)
 */
const createTaiKhoan = async (data) => {
  const { tenNguoiDung, matKhau, idVaiTro, idDV, idKhoa } = data;

  // 1. Kiểm tra trùng tên đăng nhập
  const existing = await TaiKhoan.findOne({ where: { tenNguoiDung } });
  if (existing) {
    throw new Error("Tên đăng nhập đã tồn tại");
  }

  // 2. Kiểm tra vai trò hợp lệ
  const vaiTro = await VaiTro.findByPk(idVaiTro);
  if (!vaiTro) {
    throw new Error("Vai trò không tồn tại");
  }

  // 3. Nếu có idDV → xử lý Foreign Key:
  // Vì TaiKhoan.idDV có Foreign Key references DoanVien.idDV
  // Nên nếu nhập 1 mã sinh viên MỚI HOÀN TOÀN, ta cần tự động tạo 1 hồ sơ Đoàn viên tạm cho họ ngay
  if (idDV) {
    const dvHasTK = await TaiKhoan.findOne({ where: { idDV } });
    if (dvHasTK) throw new Error("Đoàn viên này đã có tài khoản");

    // Xác định laBiThu dựa trên tên vai trò
    const tenVaiTro = vaiTro.tenVaiTro.toLowerCase();
    let laBiThu = null;
    if (tenVaiTro.includes("bí thư") || tenVaiTro.includes("bi thu")) {
      laBiThu = 1;
    }

    // Khởi tạo hồ sơ mặc định nếu chưa tồn tại
    const [dv, created] = await DoanVien.findOrCreate({
      where: { idDV },
      defaults: {
        hoTen: "Sinh viên mới (Tự động tạo)",
        laBiThu: laBiThu,
        // Các trường khác được SQL hỗ trợ null sẽ tự trống
      }
    });

    // Nếu đã tồn tại và có laBiThu mới, cập nhật laBiThu
    if (!created && laBiThu !== null) {
      await dv.update({ laBiThu });
    }
  }

  // 4. Nếu có idKhoa → tự động tạo Khoa tạm nếu chưa tồn tại
  if (idKhoa) {
    const [khoa, created] = await Khoa.findOrCreate({
      where: { idKhoa },
      defaults: { tenKhoa: "Khoa mới (Tự động tạo)" }
    });
  }

  // 5. Hash mật khẩu
  const hashedPassword = await bcrypt.hash(matKhau, 10);

  // 6. Tạo ID: U + 13 chữ số timestamp = tối đa 14 ký tự (vừa CHAR(15))
  const idUser = "U" + Date.now().toString();

  // 7. Tạo tài khoản
  // Dùng sequelize.literal('GETDATE()') để SQL Server tự tính ngày giờ hiện tại
  // Tránh lỗi "Conversion failed" khi driver tedious convert JS Date → DATETIME
  await TaiKhoan.create({
    idUser,
    tenNguoiDung,
    matKhau: hashedPassword,
    trangThai: true,
    ngayTao: sequelize.literal("GETDATE()"),
    idVaiTro,
    idDV: idDV || null,
    idKhoa: idKhoa || null,
  });

  return await getTaiKhoanById(idUser);

};

/**
 * Cập nhật tài khoản (tên đăng nhập, vai trò, trạng thái)
 * Không cho phép cập nhật mật khẩu ở đây (dùng resetPassword)
 */
const updateTaiKhoan = async (idUser, data) => {
  const { tenNguoiDung, idVaiTro, idDV, idKhoa, trangThai } = data;

  // Kiểm tra tài khoản tồn tại
  const taiKhoan = await TaiKhoan.findByPk(idUser);
  if (!taiKhoan) throw new Error("Tài khoản không tồn tại");

  // Kiểm tra trùng tên đăng nhập nếu thay đổi
  if (tenNguoiDung && tenNguoiDung !== taiKhoan.tenNguoiDung) {
    const dup = await TaiKhoan.findOne({ where: { tenNguoiDung } });
    if (dup) throw new Error("Tên đăng nhập đã tồn tại");
  }

  // Kiểm tra vai trò nếu thay đổi
  if (idVaiTro) {
    const vaiTro = await VaiTro.findByPk(idVaiTro);
    if (!vaiTro) throw new Error("Vai trò không tồn tại");
  }

  const updateData = {};
  if (tenNguoiDung !== undefined) updateData.tenNguoiDung = tenNguoiDung;
  if (idVaiTro !== undefined) updateData.idVaiTro = idVaiTro;
  if (idDV !== undefined) updateData.idDV = idDV || null;
  if (idKhoa !== undefined) updateData.idKhoa = idKhoa || null;
  if (trangThai !== undefined) updateData.trangThai = trangThai;

  await taiKhoan.update(updateData);
  return await getTaiKhoanById(idUser);
};

/**
 * Đặt lại mật khẩu cho tài khoản
 */
const resetPassword = async (idUser, matKhauMoi) => {
  const taiKhoan = await TaiKhoan.findByPk(idUser);
  if (!taiKhoan) throw new Error("Tài khoản không tồn tại");

  const hashed = await bcrypt.hash(matKhauMoi, 10);
  await taiKhoan.update({ matKhau: hashed });

  return { success: true, message: "Đặt lại mật khẩu thành công" };
};

/**
 * Khóa / Mở khóa tài khoản
 */
const toggleTrangThai = async (idUser) => {
  const taiKhoan = await TaiKhoan.findByPk(idUser);
  if (!taiKhoan) throw new Error("Tài khoản không tồn tại");

  const newStatus = !taiKhoan.trangThai;
  await taiKhoan.update({ trangThai: newStatus });

  return {
    trangThai: newStatus,
    message: newStatus ? "Mở khóa tài khoản thành công" : "Khóa tài khoản thành công",
  };
};

/**
 * Thống kê tài khoản
 */
const getStats = async () => {
  const total = await TaiKhoan.count();
  const active = await TaiKhoan.count({ where: { trangThai: true } });
  const locked = await TaiKhoan.count({ where: { trangThai: false } });

  return { tongTaiKhoan: total, dangHoatDong: active, daKhoa: locked };
};

module.exports = {
  getDoanVienChuaCoTaiKhoan,
  getAllKhoa,
  getAllTaiKhoan,
  getTaiKhoanById,
  getAllVaiTro,
  createTaiKhoan,
  updateTaiKhoan,
  resetPassword,
  toggleTrangThai,
  getStats,
};
