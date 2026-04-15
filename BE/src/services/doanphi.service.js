const {
  MucDoanPhi,
  DoanPhi,
  PhieuThuDoanPhi,
  DoanVien,
  TaiKhoan,
} = require("../models");
const { sequelize } = require("../models");

// ── MUC DOAN PHI ─────────────────────────────────────────

const getAllMucDoanPhi = async () => {
  return await MucDoanPhi.findAll({ order: [["namHoc", "DESC"]] });
};

const createMucDoanPhi = async (data) => {
  const { namHoc, soTien } = data;

  // Tạo ID tự động
  const count = await MucDoanPhi.count();
  const idMucDP = `MDP${String(count + 1).padStart(3, "0")}`;

  // Đổi tất cả mức hiện tại sang "Đã áp dụng"
  await MucDoanPhi.update(
    { trangThai: "Đã áp dụng" },
    { where: { trangThai: "Đang áp dụng" } }
  );

  return await MucDoanPhi.create({
    idMucDP,
    namHoc,
    soTien,
    trangThai: "Đang áp dụng",
  });
};

const updateMucDoanPhi = async (idMucDP, data) => {
  const muc = await MucDoanPhi.findByPk(idMucDP);
  if (!muc) throw new Error("Không tìm thấy mức đoàn phí");

  // Nếu set Đang áp dụng → đổi cái cũ sang Đã áp dụng
  if (data.trangThai === "Đang áp dụng") {
    await MucDoanPhi.update(
      { trangThai: "Đã áp dụng" },
      { where: { trangThai: "Đang áp dụng" } }
    );
  }

  await muc.update(data);
  return muc;
};

// ── DOAN PHI (tình trạng nộp) ────────────────────────────

const getAllDoanPhi = async ({ search, trangThai, page = 1, limit = 20 }) => {
  const { Op } = require("sequelize");
  const offset = (page - 1) * limit;

  const whereDP = {};
  if (trangThai && trangThai !== "all") whereDP.trangThai = trangThai;

  const whereDV = {};
  if (search) {
    whereDV[Op.or] = [
      { hoTen: { [Op.like]: `%${search}%` } },
      { idDV: { [Op.like]: `%${search}%` } },
    ];
  }

  const { count, rows } = await DoanPhi.findAndCountAll({
    where: whereDP,
    include: [
      {
        model: DoanVien,
        as: "doanVien",
        where: Object.keys(whereDV).length ? whereDV : undefined,
        attributes: ["idDV", "hoTen", "idChiDoan"],
      },
      { model: MucDoanPhi, as: "mucDoanPhi", attributes: ["namHoc", "soTien"] },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["ngayDong", "DESC"]],
  });

  return {
    data: rows,
    pagination: { page: parseInt(page), limit: parseInt(limit), total: count },
  };
};

// ── PHIEU THU ────────────────────────────────────────────

const getAllPhieuThu = async ({ trangThai }) => {
  const where = {};
  if (trangThai && trangThai !== "all") where.trangThai = trangThai;

  return await PhieuThuDoanPhi.findAll({
    where,
    include: [
      {
        model: TaiKhoan,
        as: "nguoiNopTK",
        attributes: ["tenNguoiDung"],
        include: [
          {
            model: DoanVien,
            as: "doanVien",
            attributes: ["hoTen", "idChiDoan"],
          },
        ],
      },
    ],
    order: [["idPhieuThu", "ASC"]],
  });
};

const duyetPhieuThu = async (idPhieuThu, trangThai) => {
  const phieu = await PhieuThuDoanPhi.findByPk(idPhieuThu);
  if (!phieu) throw new Error("Không tìm thấy phiếu thu");

  const t = await sequelize.transaction();
  try {
    await phieu.update({ trangThai }, { transaction: t });

    // Nếu duyệt → cập nhật tất cả DoanPhi liên quan sang "Đã đóng"
    if (trangThai === "Đã duyệt") {
      await DoanPhi.update(
        { trangThai: "Đã đóng", ngayDong: new Date() },
        { where: { idPhieuThu }, transaction: t }
      );
    }

    // Nếu từ chối → đổi DoanPhi về "Chưa đóng"
    if (trangThai === "Từ chối") {
      await DoanPhi.update(
        { trangThai: "Chưa đóng", idPhieuThu: null },
        { where: { idPhieuThu }, transaction: t }
      );
    }

    await t.commit();
    return phieu;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

module.exports = {
  getAllMucDoanPhi,
  createMucDoanPhi,
  updateMucDoanPhi,
  getAllDoanPhi,
  getAllPhieuThu,
  duyetPhieuThu,
};
