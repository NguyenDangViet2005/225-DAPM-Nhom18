const { DoanVien, ChiDoan, Khoa } = require("../models");
const { Op } = require("sequelize");

const ALLOWED_UPDATE_FIELDS = ["hoTen", "ngaySinh", "SDT", "email", "diaChi"];

const doanvienService = {
  /**
   * Lấy thông tin cá nhân của đoàn viên theo idDV
   */
  getProfile: async (idDV) => {
    const doanVien = await DoanVien.findByPk(idDV, {
      attributes: [
        "idDV", "hoTen", "ngaySinh", "gioiTinh",
        "SDT", "email", "diaChi", "idChiDoan",
        "ngayVaoDoan", "trangThaiSH", "diemHD", "chucVu",
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
   * Lấy danh sách đoàn viên (có phân trang, tìm kiếm)
   */
  getAllDoanVien: async ({ page = 1, limit = 10, search = "" }) => {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { idDV: { [Op.like]: `%${search}%` } },
        { hoTen: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await DoanVien.findAndCountAll({
      where: whereClause,
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
      limit: parseInt(limit),
      offset,
      order: [["hoTen", "ASC"]],
    });

    return {
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
    };
  },

  /**
   * Tạo đoàn viên mới
   */
  createDoanVien: async (data) => {
    const { idDV, hoTen, gioiTinh, ngaySinh, SDT, email, diaChi, idChiDoan } = data;

    // Kiểm tra trùng mã đoàn viên
    const existing = await DoanVien.findByPk(idDV);
    if (existing) {
      throw new Error("Mã đoàn viên đã tồn tại");
    }

    const newDoanVien = await DoanVien.create({
      idDV,
      hoTen,
      gioiTinh: gioiTinh || "Nam",
      ngaySinh: ngaySinh || null,
      SDT: SDT || null,
      email: email || null,
      diaChi: diaChi || null,
      idChiDoan: idChiDoan || null,
    });

    return newDoanVien;
  },

  /**
   * Cập nhật đoàn viên
   */
  updateDoanVien: async (idDV, updateData) => {
    const doanVien = await DoanVien.findByPk(idDV);
    if (!doanVien) return null;

    const { hoTen, gioiTinh, ngaySinh, SDT, email, diaChi, idChiDoan } = updateData;
    
    const dataToUpdate = {};
    if (hoTen !== undefined) dataToUpdate.hoTen = hoTen;
    if (gioiTinh !== undefined) dataToUpdate.gioiTinh = gioiTinh;
    if (ngaySinh !== undefined) dataToUpdate.ngaySinh = ngaySinh;
    if (SDT !== undefined) dataToUpdate.SDT = SDT;
    if (email !== undefined) dataToUpdate.email = email;
    if (diaChi !== undefined) dataToUpdate.diaChi = diaChi;
    if (idChiDoan !== undefined) dataToUpdate.idChiDoan = idChiDoan;

    await doanVien.update(dataToUpdate);
    return doanVien;
  },

  /**
   * Lấy thống kê đoàn viên
   */
  getStats: async () => {
    const total = await DoanVien.count();
    const male = await DoanVien.count({ where: { gioiTinh: "Nam" } });
    const female = await DoanVien.count({ where: { gioiTinh: "Nữ" } });
    
    // Đếm số đoàn viên đã có tài khoản
    const { TaiKhoan } = require("../models");
    const withAccount = await TaiKhoan.count({
      where: { idDV: { [Op.ne]: null } }
    });

    return { total, male, female, withAccount };
  },

  /**
   * Lấy danh sách chi đoàn
   */
  getChiDoanList: async () => {
    return await ChiDoan.findAll({
      include: [
        {
          model: Khoa,
          as: "khoa",
          attributes: ["idKhoa", "tenKhoa"],
        },
      ],
      order: [["tenChiDoan", "ASC"]],
    });
  },
};

module.exports = doanvienService;
