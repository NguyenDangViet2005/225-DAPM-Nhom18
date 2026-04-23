const {
  MucDoanPhi,
  DoanPhi,
  PhieuThuDoanPhi,
  DoanVien,
  TaiKhoan,
  ChiDoan,
} = require("../models");
const { sequelize } = require("../models");

// ── MUC DOAN PHI ─────────────────────────────────────────

const getAllMucDoanPhi = async () => {
  return await MucDoanPhi.findAll({ order: [["namHoc", "DESC"]] });
};

const createMucDoanPhi = async (data) => {
  const { namHoc, soTien } = data;
  const count = await MucDoanPhi.count();
  const idMucDP = `MDP${String(count + 1).padStart(3, "0")}`;
  await MucDoanPhi.update(
    { trangThai: "Đã áp dụng" },
    { where: { trangThai: "Đang áp dụng" } },
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
  if (data.trangThai === "Đang áp dụng") {
    await MucDoanPhi.update(
      { trangThai: "Đã áp dụng" },
      { where: { trangThai: "Đang áp dụng" } },
    );
  }
  await muc.update(data);
  return muc;
};

// ── DOAN PHI (tình trạng nộp) ────────────────────────────

const getAllDoanPhi = async ({
  search,
  trangThai,
  idChiDoan,
  page = 1,
  limit = 10,
}) => {
  const { Op } = require("sequelize");
  const parsedPage = Number.parseInt(page, 10) || 1;
  const parsedLimit = Number.parseInt(limit, 10) || 10;
  const safePage = parsedPage > 0 ? parsedPage : 1;
  const safeLimit = parsedLimit > 0 ? parsedLimit : 10;
  const offset = (safePage - 1) * safeLimit;

  const whereDP = {};
  if (trangThai && trangThai !== "all") whereDP.trangThai = trangThai;

  if (search) {
    const matchDV = await DoanVien.findAll({
      where: {
        [Op.or]: [
          { hoTen: { [Op.like]: `%${search}%` } },
          sequelize.where(sequelize.fn("RTRIM", sequelize.col("idDV")), {
            [Op.like]: `%${search}%`,
          }),
        ],
      },
      attributes: ["idDV"],
    });
    whereDP.idDV = matchDV.map((dv) => dv.idDV);
  }

  const whereDVFinal = {};
  if (idChiDoan && idChiDoan !== "all") whereDVFinal.idChiDoan = idChiDoan;

  const { count, rows } = await DoanPhi.findAndCountAll({
    where: whereDP,
    include: [
      {
        model: DoanVien,
        as: "doanVien",
        where: Object.keys(whereDVFinal).length ? whereDVFinal : undefined,
        attributes: ["idDV", "hoTen", "idChiDoan"],
        include: [
          { model: ChiDoan, as: "chiDoan", attributes: ["tenChiDoan"] },
        ],
      },
      { model: MucDoanPhi, as: "mucDoanPhi", attributes: ["namHoc", "soTien"] },
    ],
    limit: safeLimit,
    offset,
    order: [["ngayDong", "DESC"]],
  });

  return {
    data: rows,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total: count,
      totalPages: Math.max(1, Math.ceil(count / safeLimit)),
    },
  };
};

/**
 * Lấy lịch sử đóng đoàn phí của đoàn viên đang đăng nhập
 */
const getMyDoanPhi = async (idDV) => {
  const rows = await DoanPhi.findAll({
    where: { idDV },
    include: [
      {
        model: MucDoanPhi,
        as: "mucDoanPhi",
        attributes: ["namHoc", "soTien"],
      },
    ],
    order: [["idMucDP", "DESC"]],
  });

  return rows.map((dp) => {
    const data = dp.toJSON();
    for (const key in data) {
      if (typeof data[key] === "string") data[key] = data[key].trim();
    }
    return {
      idDoanPhi: data.idDoanPhi,
      trangThai: data.trangThai,
      ngayDong: data.ngayDong,
      idPhieuThu: data.idPhieuThu,
      namHoc: data.mucDoanPhi?.namHoc || null,
      soTien: data.mucDoanPhi?.soTien || null,
    };
  });
};

// ── PHIEU THU ────────────────────────────────────────────

const getAllPhieuThu = async ({ trangThai }, user) => {
  const where = {};
  if (trangThai && trangThai !== "all") where.trangThai = trangThai;

  if (user && user.type === "BITHU") {
    where.nguoiNop = user.idUser;
  }

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
            include: [
              { model: ChiDoan, as: "chiDoan", attributes: ["tenChiDoan"] },
            ],
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
    if (trangThai === "Đã duyệt") {
      await DoanPhi.update(
        { trangThai: "Đã đóng", ngayDong: sequelize.literal('CAST(GETDATE() AS DATE)') },
        { where: { idPhieuThu }, transaction: t },
      );
    }
    if (trangThai === "Từ chối") {
      await DoanPhi.update(
        { trangThai: "Chưa đóng", idPhieuThu: null },
        { where: { idPhieuThu }, transaction: t },
      );
    }
    await t.commit();
    return phieu;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const getAllChiDoan = async () => {
  return await ChiDoan.findAll({
    attributes: ["idChiDoan", "tenChiDoan"],
    order: [["idChiDoan", "ASC"]],
  });
};

const getStats = async ({ idChiDoan, namHoc } = {}) => {
  const mucPhi = namHoc
    ? await MucDoanPhi.findOne({ where: { namHoc } })
    : await MucDoanPhi.findOne({ where: { trangThai: "Đang áp dụng" } });
  const soTien = Number(mucPhi?.soTien ?? 0);

  let whereDP = {};
  if (idChiDoan && idChiDoan !== "all") {
    const dvList = await DoanVien.findAll({
      where: { idChiDoan },
      attributes: ["idDV"],
    });
    whereDP.idDV = dvList.map((dv) => dv.idDV);
  }

  const [tongDoanVien, daDong, dangChoDuyet] = await Promise.all([
    DoanPhi.count({ where: whereDP }),
    DoanPhi.count({ where: { ...whereDP, trangThai: "Đã đóng" } }),
    DoanPhi.count({ where: { ...whereDP, trangThai: "Đang chờ duyệt" } }),
  ]);

  return {
    tongDoanVien,
    daDong,
    chuaDong: tongDoanVien - daDong - dangChoDuyet,
    dangChoDuyet,
    tongDaThu: daDong * soTien,
    tongPhaiThu: tongDoanVien * soTien,
    tyLe: tongDoanVien ? Math.round((daDong / tongDoanVien) * 100) : 0,
    namHoc: mucPhi?.namHoc ?? null,
    soTien,
  };
};

const fs = require("fs");
const path = require("path");

const createPhieuThu = async (data, user, file) => {
  const { listIdDoanPhi } = data;

  // Validation
  if (
    !listIdDoanPhi ||
    !Array.isArray(listIdDoanPhi) ||
    listIdDoanPhi.length === 0
  ) {
    throw new Error("Danh sách đoàn phí không hợp lệ");
  }

  // Validate file
  if (!file) {
    throw new Error("Vui lòng đính kèm file chứng từ");
  }

  // Validate user info
  if (!user || !user.idUser) {
    throw new Error("Thông tin người dùng không hợp lệ");
  }

  const transaction = await sequelize.transaction();
  try {
    // Kiểm tra user tồn tại trong TaiKhoan
    const existingUser = await TaiKhoan.findByPk(user.idUser.trim(), { transaction });
    if (!existingUser) {
      throw new Error("Người dùng không tồn tại trong hệ thống");
    }

    // Tạo ID phiếu thu - use raw query to avoid ORDER BY conflict with MAX()
    const results = await sequelize.query(
      'SELECT MAX(idPhieuThu) as maxId FROM PhieuThuDoanPhi',
      { transaction, type: sequelize.QueryTypes.SELECT }
    );
    
    let nextNum = 1;
    if (results && results[0] && results[0].maxId) {
      const lastNum = parseInt(results[0].maxId.substring(2));
      nextNum = lastNum + 1;
    }
    
    const idPhieuThu = `PT${String(nextNum).padStart(3, "0")}`;

    // Generate file URL from uploaded file
    const fileDinhKem = file ? `http://localhost:8000/uploads/phieuthu/${file.filename}` : null;

    const phieuThuData = {
      idPhieuThu,
      nguoiNop: user.idUser.trim(),
      ngayLap: sequelize.literal('GETDATE()'),
      tongTien: 0,
      trangThai: "Chờ duyệt",
      fileDinhKem: fileDinhKem,
    };

    const phieuThu = await PhieuThuDoanPhi.create(phieuThuData, { transaction });

    let tongTien = 0;
    const dsDoanVien = [];

    for (const idDP of listIdDoanPhi) {
      // Include mucDoanPhi relationship
      const doanPhi = await DoanPhi.findByPk(idDP, {
        transaction,
        include: [
          { model: MucDoanPhi, as: "mucDoanPhi", attributes: ["idMucDP", "soTien", "namHoc"] }
        ]
      });

      if (!doanPhi) {
        throw new Error(`Không tìm thấy đoàn phí ${idDP}`);
      }

      // Kiểm tra mức đoàn phí
      const mucDoanPhi = doanPhi.mucDoanPhi;
      if (!mucDoanPhi) {
        throw new Error(`Không tìm thấy mức đoàn phí cho đoàn phí ${idDP}`);
      }

      if (!mucDoanPhi.soTien) {
        throw new Error(`Mức đoàn phí ${mucDoanPhi.idMucDP} chưa có số tiền`);
      }

      // Nạp thêm thông tin đoàn viên để hiển thị
      const dv = await DoanVien.findByPk(doanPhi.idDV, { transaction });
      if (dv) {
        dsDoanVien.push({
          idDV: doanPhi.idDV,
          hoTen: dv.hoTen,
          soTien: mucDoanPhi.soTien,
        });
      }

      tongTien += mucDoanPhi.soTien;

      await doanPhi.update(
        {
          idPhieuThu: phieuThu.idPhieuThu,
          trangThai: "Đang chờ duyệt",
          ngayDong: sequelize.literal('CAST(GETDATE() AS DATE)'),
        },
        { transaction },
      );
    }

    // Update tongTien
    await phieuThu.update({ tongTien }, { transaction });
    
    await transaction.commit();
    return phieuThu;
  } catch (error) {
    await transaction.rollback();
    // Delete uploaded file if transaction fails
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw error;
  }
};

module.exports = {
  getAllMucDoanPhi,
  createMucDoanPhi,
  updateMucDoanPhi,
  getAllDoanPhi,
  getMyDoanPhi,
  getAllPhieuThu,
  duyetPhieuThu,
  createPhieuThu,
  getAllChiDoan,
  getStats,
};
