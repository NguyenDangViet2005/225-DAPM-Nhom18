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

  // Tạo ID tự động
  const count = await MucDoanPhi.count();
  const idMucDP = `MDP${String(count + 1).padStart(3, "0")}`;

  // Đổi tất cả mức hiện tại sang "Đã áp dụng"
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

  // Nếu set Đang áp dụng → đổi cái cũ sang Đã áp dụng
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

  // Search theo hoTen hoặc idDV: lấy idDV match trước rồi dùng IN
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

  const totalPages = Math.max(1, Math.ceil(count / safeLimit));

  return {
    data: rows,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total: count,
      totalPages,
    },
  };
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

    // Nếu duyệt → cập nhật tất cả DoanPhi liên quan sang "Đã đóng"
    if (trangThai === "Đã duyệt") {
      await DoanPhi.update(
        { trangThai: "Đã đóng", ngayDong: new Date() },
        { where: { idPhieuThu }, transaction: t },
      );
    }

    // Nếu từ chối → đổi DoanPhi về "Chưa đóng"
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

const createPhieuThu = async (data) => {
  const { idUser, fileDinhKem, listIdDoanPhi } = data;
  if (!listIdDoanPhi || listIdDoanPhi.length === 0) {
    throw new Error("Không có đoàn phí nào được chọn");
  }

  const t = await sequelize.transaction();
  try {
    const count = await PhieuThuDoanPhi.count();
    const idPhieuThu = `PT${String(count + 1).padStart(4, "0")}`;

    const phieu = await PhieuThuDoanPhi.create(
      {
        idPhieuThu,
        nguoiNop: idUser,
        fileDinhKem: fileDinhKem || null,
        trangThai: "Đang chờ duyệt",
      },
      { transaction: t }
    );

    await DoanPhi.update(
      {
        idPhieuThu,
        trangThai: "Đang chờ duyệt",
      },
      {
        where: { idDoanPhi: listIdDoanPhi },
        transaction: t,
      }
    );

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
  // Lấy mức phí đang áp dụng để lấy soTien hiển thị
  const mucPhi = namHoc
    ? await MucDoanPhi.findOne({ where: { namHoc } })
    : await MucDoanPhi.findOne({ where: { trangThai: "Đang áp dụng" } });

  const soTien = Number(mucPhi?.soTien ?? 0);

  // Lấy idDV thuộc chi đoàn nếu có filter
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

const createPhieuThu = async ({ listIdDoanPhi }, user) => {
  const transaction = await sequelize.transaction();
  try {
    const count = await PhieuThuDoanPhi.count();
    const idPhieuThu = `PT${String(count + 1).padStart(3, "0")}`;

    const phieuThu = await PhieuThuDoanPhi.create(
      {
        idPhieuThu,
        ngayLap: new Date(),
        nguoiNop: user.idUser,
        tongTien: 0,
        trangThai: "Chờ duyệt",
        fileDinhKem: null, // Sẽ cập nhật sau khi tạo HTML
      },
      { transaction },
    );

    let tongTien = 0;
    const dsDoanVien = [];

    for (const idDP of listIdDoanPhi) {
      const doanPhi = await DoanPhi.findByPk(idDP, {
        include: [{ model: MucDoanPhi, as: "mucDoanPhi" }],
        transaction,
      });

      if (!doanPhi) {
        throw new Error(`Không tìm thấy đoàn phí ${idDP}`);
      }

      // Nạp thêm thông tin đoàn viên để hiển thị
      const dv = await DoanVien.findByPk(doanPhi.idDV, { transaction });
      if (dv) dsDoanVien.push({ ...doanPhi.toJSON(), doanVien: dv.toJSON() });

      tongTien += doanPhi.mucDoanPhi.soTien;

      await doanPhi.update(
        {
          idPhieuThu: phieuThu.idPhieuThu,
          trangThai: "Đang chờ duyệt",
          ngayDong: new Date(),
        },
        { transaction },
      );
    }

    // Tự động sinh file HTML danh sách nộp
    const uploadDir = path.join(__dirname, "../../uploads/phieuthu");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    
    const fileName = `${idPhieuThu}_${Date.now()}.html`;
    const filePath = path.join(uploadDir, fileName);
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Danh sách nộp phí - ${idPhieuThu}</title>
<style>
body { font-family: Arial, sans-serif; padding: 20px; }
table { width: 100%; border-collapse: collapse; margin-top: 20px; }
th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
th { background-color: #004f9f; color: white; }
</style>
</head>
<body>
  <h2 style="color: #004f9f; text-align: center; text-transform: uppercase;">Danh sách Đoàn viên nộp phí</h2>
  <p><strong>Mã phiếu:</strong> ${idPhieuThu}</p>
  <p><strong>Người nộp (Bí thư):</strong> ${user.tenNguoiDung}</p>
  <p><strong>Ngày nộp:</strong> ${new Date().toLocaleDateString('vi-VN')}</p>
  <p><strong>Tổng tiền:</strong> ${tongTien.toLocaleString()} VNĐ</p>
  <table>
    <thead><tr><th>STT</th><th>Mã Đoàn viên</th><th>Họ và tên</th><th>Số tiền nộp</th></tr></thead>
    <tbody>
      ${dsDoanVien.map((dp, i) => `<tr><td>${i+1}</td><td>${dp.idDV}</td><td>${dp.doanVien?.hoTen}</td><td>${dp.mucDoanPhi.soTien.toLocaleString()} ₫</td></tr>`).join('')}
    </tbody>
  </table>
</body>
</html>`;
    fs.writeFileSync(filePath, htmlContent);
    const generatedUrl = `http://localhost:8000/uploads/phieuthu/${fileName}`;

    await phieuThu.update({ tongTien, fileDinhKem: generatedUrl }, { transaction });
    await transaction.commit();
    return phieuThu;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  getAllMucDoanPhi,
  createMucDoanPhi,
  updateMucDoanPhi,
  getAllDoanPhi,
  getAllPhieuThu,
  duyetPhieuThu,
  createPhieuThu,
  getAllChiDoan,
  getStats,
  createPhieuThu,
};
