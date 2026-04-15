const { SoDoan, DoanVien, ChiDoan, Khoa } = require("../models");

const sodoanService = {
  getAllSoDoan: async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    return await SoDoan.findAndCountAll({
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      include: [
        {
          model: DoanVien,
          as: "doanVien",
          include: [
            {
              model: ChiDoan,
              as: "chiDoan",
              include: [{ model: Khoa, as: "khoa" }],
            },
          ],
        },
      ],
      order: [["idSoDoan", "ASC"]],
    });
  },

  getSoDoanById: async (idSoDoan) => {
    return await SoDoan.findOne({
      where: { idSoDoan },
      include: [
        {
          model: DoanVien,
          as: "doanVien",
          include: [
            {
              model: ChiDoan,
              as: "chiDoan",
              include: [{ model: Khoa, as: "khoa" }],
            },
          ],
        },
      ],
    });
  },

  updateTrangThai: async (idSoDoan, trangThai) => {
    const soDoan = await SoDoan.findByPk(idSoDoan);
    if (!soDoan) throw new Error("Không tìm thấy sổ đoàn");

    const updateData = { trangThai };
    if (trangThai === "Đã rút sổ") {
      updateData.ngayRutSo = new Date();
    } else {
      updateData.ngayRutSo = null;
    }

    await soDoan.update(updateData);
    return soDoan;
  },
};

module.exports = sodoanService;
