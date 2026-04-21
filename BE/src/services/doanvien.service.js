const { DoanVien, ChiDoan, Khoa } = require("../models");

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
};

module.exports = doanvienService;
