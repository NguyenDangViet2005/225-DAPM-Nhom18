const { DoanVien, ChiDoan, Khoa, SoDoan, TaiKhoan } = require("../models");
const { Op } = require("sequelize");

const ALLOWED_UPDATE_FIELDS = [
  "hoTen",
  "ngaySinh",
  "SDT",
  "email",
  "diaChiThuongTru",
  "diaChiTamTru",
  "CCCD",
  "ngayCapCCCD",
  "noiCapCCCD",
  "danToc",
  "tonGiao",
];

const doanvienService = {
  /**
   * Lấy thông tin cá nhân của đoàn viên theo idDV
   */
  getProfile: async (idDV) => {
    const doanVien = await DoanVien.findByPk(idDV, {
      attributes: [
        "idDV",
        "hoTen",
        "anhThe",
        "ngaySinh",
        "gioiTinh",
        "CCCD",
        "ngayCapCCCD",
        "noiCapCCCD",
        "SDT",
        "email",
        "diaChiThuongTru",
        "diaChiTamTru",
        "danToc",
        "tonGiao",
        "heDaoTao",
        "trangThaiHoc",
        "idChiDoan",
        "chucVu",
        "diemHoatDong",
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
        {
          model: SoDoan,
          as: "soDoan",
          attributes: ["idSoDoan", "ngayCap", "noiCap", "trangThai", "ngayRutSo", "ngayVaoDoan", "noiKetNap"],
        },
      ],
    });

    if (!doanVien) return null;

    return {
      idDV: doanVien.idDV,
      hoTen: doanVien.hoTen,
      anhThe: doanVien.anhThe,
      ngaySinh: doanVien.ngaySinh,
      gioiTinh: doanVien.gioiTinh,
      CCCD: doanVien.CCCD,
      ngayCapCCCD: doanVien.ngayCapCCCD,
      noiCapCCCD: doanVien.noiCapCCCD,
      SDT: doanVien.SDT,
      email: doanVien.email,
      diaChiThuongTru: doanVien.diaChiThuongTru,
      diaChiTamTru: doanVien.diaChiTamTru,
      danToc: doanVien.danToc,
      tonGiao: doanVien.tonGiao,
      heDaoTao: doanVien.heDaoTao,
      trangThaiHoc: doanVien.trangThaiHoc,
      chucVu: doanVien.chucVu,
      diemHoatDong: doanVien.diemHoatDong,
      idChiDoan: doanVien.idChiDoan,
      tenChiDoan: doanVien.chiDoan?.tenChiDoan || null,
      nienKhoa: doanVien.chiDoan?.nienKhoa || null,
      idKhoa: doanVien.chiDoan?.khoa?.idKhoa || null,
      tenKhoa: doanVien.chiDoan?.khoa?.tenKhoa || null,
      ngayVaoDoan: doanVien.soDoan?.ngayVaoDoan || null,
      noiKetNap: doanVien.soDoan?.noiKetNap || null,
    };
  },

  /**
   * Cập nhật thông tin cá nhân (chỉ các field được phép)
   */
  updateProfile: async (idDV, updateData) => {
    const doanVien = await DoanVien.findByPk(idDV);
    if (!doanVien) return null;

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
      attributes: ["idSoDoan", "ngayCap", "noiCap", "trangThai", "ngayRutSo", "ngayVaoDoan", "noiKetNap"],
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

    const processedData = rows.map(doanVien => ({
      ...doanVien.toJSON(),
    }));

    return {
      data: processedData,
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
    const {
      idDV, hoTen, gioiTinh, ngaySinh, SDT, email,
      diaChiThuongTru, diaChiTamTru,
      CCCD, ngayCapCCCD, noiCapCCCD,
      danToc, tonGiao, heDaoTao, trangThaiHoc, idChiDoan, chucVu,
    } = data;

    const existing = await DoanVien.findByPk(idDV);
    if (existing) throw new Error("Mã đoàn viên đã tồn tại");

    const doanvien = await DoanVien.create({
      idDV, hoTen, gioiTinh, ngaySinh, SDT, email,
      diaChiThuongTru, diaChiTamTru,
      CCCD, ngayCapCCCD, noiCapCCCD,
      danToc, tonGiao, heDaoTao,
      trangThaiHoc: trangThaiHoc || "Đang học",
      idChiDoan, chucVu,
      diemHoatDong: 0,
    });

    return doanvien;
  },

  /**
   * Cập nhật đoàn viên
   */
  update: async (idDV, data) => {
    const doanvien = await DoanVien.findByPk(idDV);
    if (!doanvien) return null;

    const {
      hoTen, gioiTinh, ngaySinh, SDT, email,
      diaChiThuongTru, diaChiTamTru,
      CCCD, ngayCapCCCD, noiCapCCCD,
      danToc, tonGiao, heDaoTao, trangThaiHoc, idChiDoan, chucVu,
    } = data;

    await doanvien.update({
      hoTen, gioiTinh, ngaySinh, SDT, email,
      diaChiThuongTru, diaChiTamTru,
      CCCD, ngayCapCCCD, noiCapCCCD,
      danToc, tonGiao, heDaoTao, trangThaiHoc, idChiDoan, chucVu,
    });

    return doanvien;
  },

  /**
   * Lấy thông tin đầy đủ của đoàn viên bao gồm tất cả quan hệ
   */
  getFullDetail: async (idDV) => {
    const { DoanPhi, MucDoanPhi, PhieuThuDoanPhi, LichSuChuyenChiDoan, DoanVienDangKi, HoatDongDoan } = require("../models");
    
    const doanVien = await DoanVien.findByPk(idDV, {
      include: [
        {
          model: ChiDoan,
          as: "chiDoan",
          attributes: ["idChiDoan", "tenChiDoan", "nienKhoa", "siSo"],
          include: [
            {
              model: Khoa,
              as: "khoa",
              attributes: ["idKhoa", "tenKhoa"],
            },
          ],
        },
        {
          model: SoDoan,
          as: "soDoan",
          attributes: ["idSoDoan", "ngayCap", "noiCap", "trangThai", "ngayRutSo", "ngayVaoDoan", "noiKetNap"],
          include: [
            {
              model: LichSuChuyenChiDoan,
              as: "lichSuChuyenChiDoans",
              attributes: ["idLichSu", "tuDonVi", "denDonVi", "ngayBatDau", "ngayKetThu", "lyDo"],
            },
          ],
        },
        {
          model: DoanPhi,
          as: "doanPhis",
          attributes: ["idDoanPhi", "trangThai", "ngayDong"],
          include: [
            {
              model: MucDoanPhi,
              as: "mucDoanPhi",
              attributes: ["idMucDP", "namHoc", "soTien", "trangThai"],
            },
            {
              model: PhieuThuDoanPhi,
              as: "phieuThuDoanPhi",
              attributes: ["idPhieuThu", "ngayLap", "tongTien", "fileDinhKem", "trangThai"],
            },
          ],
        },
      ],
    });

    if (!doanVien) return null;

    // Lấy lịch sử tham gia hoạt động
    const hoatDongHistory = await DoanVienDangKi.findAll({
      where: { idDV },
      include: [
        {
          model: HoatDongDoan,
          as: "hoatDong",
          attributes: ["idHD", "tenHD", "moTa", "ngayToChuc", "diaDiem", "diemHD", "trangThaiHD"],
        },
      ],
      order: [["ngayDangKi", "DESC"]],
    });

    return {
      // Thông tin cá nhân
      thongTinCaNhan: {
        idDV: doanVien.idDV,
        hoTen: doanVien.hoTen,
        anhThe: doanVien.anhThe,
        ngaySinh: doanVien.ngaySinh,
        gioiTinh: doanVien.gioiTinh,
        CCCD: doanVien.CCCD,
        ngayCapCCCD: doanVien.ngayCapCCCD,
        noiCapCCCD: doanVien.noiCapCCCD,
        SDT: doanVien.SDT,
        email: doanVien.email,
        diaChiThuongTru: doanVien.diaChiThuongTru,
        diaChiTamTru: doanVien.diaChiTamTru,
        danToc: doanVien.danToc,
        tonGiao: doanVien.tonGiao,
        heDaoTao: doanVien.heDaoTao,
        trangThaiHoc: doanVien.trangThaiHoc,
      },
      // Thông tin đoàn
      thongTinDoan: {
        idChiDoan: doanVien.idChiDoan,
        tenChiDoan: doanVien.chiDoan?.tenChiDoan || null,
        nienKhoa: doanVien.chiDoan?.nienKhoa || null,
        siSo: doanVien.chiDoan?.siSo || null,
        idKhoa: doanVien.chiDoan?.khoa?.idKhoa || null,
        tenKhoa: doanVien.chiDoan?.khoa?.tenKhoa || null,
        chucVu: doanVien.chucVu,
        diemHoatDong: doanVien.diemHoatDong,
      },
      // Sổ đoàn
      soDoan: doanVien.soDoan ? {
        idSoDoan: doanVien.soDoan.idSoDoan,
        ngayCap: doanVien.soDoan.ngayCap,
        noiCap: doanVien.soDoan.noiCap,
        trangThai: doanVien.soDoan.trangThai,
        ngayRutSo: doanVien.soDoan.ngayRutSo,
        ngayVaoDoan: doanVien.soDoan.ngayVaoDoan,
        noiKetNap: doanVien.soDoan.noiKetNap,
      } : null,
      // Lịch sử chuyển chi đoàn
      lichSuChuyenChiDoan: doanVien.soDoan?.lichSuChuyenChiDoans || [],
      // Đoàn phí
      doanPhis: doanVien.doanPhis.map(dp => ({
        idDoanPhi: dp.idDoanPhi,
        trangThai: dp.trangThai,
        ngayDong: dp.ngayDong,
        namHoc: dp.mucDoanPhi?.namHoc,
        soTien: dp.mucDoanPhi?.soTien,
        ngayLapPhieu: dp.phieuThuDoanPhi?.ngayLap,
        fileDinhKem: dp.phieuThuDoanPhi?.fileDinhKem,
      })),
      // Lịch sử hoạt động
      lichSuHoatDong: hoatDongHistory.map(dk => ({
        idHD: dk.idHD,
        tenHD: dk.hoatDong?.tenHD,
        moTa: dk.hoatDong?.moTa,
        ngayToChuc: dk.hoatDong?.ngayToChuc,
        diaDiem: dk.hoatDong?.diaDiem,
        diemHD: dk.hoatDong?.diemHD,
        trangThaiHD: dk.hoatDong?.trangThaiHD,
        ngayDangKi: dk.ngayDangKi,
        trangThaiDuyet: dk.trangThaiDuyet,
        lyDoTuChoi: dk.lyDoTuChoi,
      })),
    };
  },
};

module.exports = doanvienService;
