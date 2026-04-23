const { DoanVien, ChiDoan, Khoa, SoDoan, TaiKhoan } = require("../models");
const { sequelize } = require("../models");
const { Op } = require("sequelize");

const ALLOWED_UPDATE_FIELDS = ["hoTen", "ngaySinh", "SDT", "email", "diaChi"];

const doanvienService = {
  /**
   * Lấy thông tin cá nhân của đoàn viên theo idDV
   */
  getProfile: async (idDV) => {
    const doanVien = await DoanVien.findByPk(idDV, {
      attributes: [
        "idDV",
        "hoTen",
        "ngaySinh",
        "gioiTinh",
        "SDT",
        "email",
        "diaChi",
        "idChiDoan",
        "ngayVaoDoan",
        "trangThaiSH",
        "diemHD",
        "chucVu",
      ],
      include: [
        {
          model: ChiDoan,
          as: "chiDoan",
          attributes: ["idChiDoan", "tenChiDoan", "nienKhoa"],
          include: [
            {
              model: Khoa,
              as: "khoa",
              attributes: ["idKhoa", "tenKhoa"],
            },
          ],
        },
      ],
    });

    if (!doanVien) return null;

    return {
      idDV: doanVien.idDV,
      hoTen: doanVien.hoTen,
      ngaySinh: doanVien.ngaySinh,
      gioiTinh: doanVien.gioiTinh,
      SDT: doanVien.SDT,
      email: doanVien.email,
      diaChi: doanVien.diaChi,
      ngayVaoDoan: doanVien.ngayVaoDoan,
      trangThaiSH: doanVien.trangThaiSH,
      diemHD: doanVien.diemHD,
      chucVu: doanVien.chucVu,
      idChiDoan: doanVien.idChiDoan,
      tenChiDoan: doanVien.chiDoan?.tenChiDoan || null,
      nienKhoa: doanVien.chiDoan?.nienKhoa || null,
      idKhoa: doanVien.chiDoan?.khoa?.idKhoa || null,
      tenKhoa: doanVien.chiDoan?.khoa?.tenKhoa || null,
    };
  },

  /**
   * Cập nhật thông tin cá nhân (chỉ các field được phép)
   */
  updateProfile: async (idDV, updateData) => {
    const doanVien = await DoanVien.findByPk(idDV);
    if (!doanVien) return null;

    // Chỉ cho phép cập nhật các field trong whitelist
    const safeData = {};
    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (updateData[field] !== undefined) {
        safeData[field] = updateData[field];
      }
    }

    if (Object.keys(safeData).length === 0) {
      throw new Error("Không có trường hợp lệ để cập nhật");
    }

    await doanVien.update(safeData);
    return doanVien;
  },

  /**
   * Lấy thông tin sổ đoàn của đoàn viên
   */
  getMySoDoan: async (idDV) => {
    const soDoan = await SoDoan.findOne({
      where: { idDV },
      attributes: ["idSoDoan", "ngayCap", "noiCap", "trangThai", "ngayRutSo"],
    });

    return soDoan;
  },

  /**
   * Lấy danh sách đoàn viên với phân trang và tìm kiếm
   */
  getAll: async (page = 1, limit = 10, search = "") => {
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { idDV: { [Op.like]: `%${search}%` } },
        { hoTen: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await DoanVien.findAndCountAll({
      where,
      include: [
        {
          model: ChiDoan,
          as: "chiDoan",
          attributes: ["idChiDoan", "tenChiDoan"],
          include: [
            {
              model: Khoa,
              as: "khoa",
              attributes: ["idKhoa", "tenKhoa"],
            },
          ],
        },
      ],
      limit,
      offset,
      order: [["idDV", "ASC"]],
    });

    return {
      data: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
      },
    };
  },

  /**
   * Lấy thống kê đoàn viên
   */
  getStats: async () => {
    const total = await DoanVien.count();
    const male = await DoanVien.count({ where: { gioiTinh: "Nam" } });
    const female = await DoanVien.count({ where: { gioiTinh: "Nữ" } });
    
    // Count đoàn viên có tài khoản
    const withAccount = await TaiKhoan.count({
      where: {
        idDV: { [Op.ne]: null },
      },
    });

    return { total, male, female, withAccount };
  },

  /**
   * Lấy danh sách chi đoàn
   */
  getChiDoanList: async () => {
    const list = await ChiDoan.findAll({
      attributes: ["idChiDoan", "tenChiDoan"],
      include: [
        {
          model: Khoa,
          as: "khoa",
          attributes: ["idKhoa", "tenKhoa"],
        },
      ],
      order: [["idChiDoan", "ASC"]],
    });

    return list;
  },

  /**
   * Tạo đoàn viên mới
   */
  create: async (data) => {
    const { idDV, hoTen, gioiTinh, ngaySinh, SDT, email, diaChi, idChiDoan } = data;

    // Check if idDV already exists
    const existing = await DoanVien.findByPk(idDV);
    if (existing) {
      throw new Error("Mã đoàn viên đã tồn tại");
    }

    const doanvien = await DoanVien.create({
      idDV,
      hoTen,
      gioiTinh,
      ngaySinh,
      SDT,
      email,
      diaChi,
      idChiDoan,
      trangThaiSH: "Đang sinh hoạt",
      diemHD: 0,
    });

    return doanvien;
  },

  /**
   * Cập nhật đoàn viên
   */
  update: async (idDV, data) => {
    const doanvien = await DoanVien.findByPk(idDV);
    if (!doanvien) return null;

    const { hoTen, gioiTinh, ngaySinh, SDT, email, diaChi, idChiDoan } = data;

    await doanvien.update({
      hoTen,
      gioiTinh,
      ngaySinh,
      SDT,
      email,
      diaChi,
      idChiDoan,
    });

    return doanvien;
  },
};

module.exports = doanvienService;
