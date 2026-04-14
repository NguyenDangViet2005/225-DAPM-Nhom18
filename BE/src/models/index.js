const { sequelize } = require("../configs/database.config");

// Import all models
const Khoa = require("./khoa.model");
const VaiTro = require("./vaitro.model");
const ChiDoan = require("./chidoan.model");
const DoanVien = require("./doanvien.model");
const TaiKhoan = require("./taikhoan.model");
const SoDoan = require("./sodoan.model");
const TieuSu = require("./tieusu.model");
const HoatDongDoan = require("./hoatdongdoan.model");
const DoanVienDangKi = require("./doanviendangki.model");
const MucDoanPhi = require("./mucdoanphi.model");
const PhieuThuDoanPhi = require("./phieuthudoanphi.model");
const DoanPhi = require("./doanphi.model");

// ========================================
// Define Relationships (1-N and M-N)
// ========================================

/**
 * 1. Khoa - ChiDoan (1:N)
 * One Khoa has many ChiDoans
 */
Khoa.hasMany(ChiDoan, {
  foreignKey: "idKhoa",
  as: "chiDoans",
});
ChiDoan.belongsTo(Khoa, {
  foreignKey: "idKhoa",
  as: "khoa",
});

/**
 * 2. ChiDoan - DoanVien (1:N)
 * One ChiDoan has many DoanViens
 */
ChiDoan.hasMany(DoanVien, {
  foreignKey: "idChiDoan",
  as: "doanViens",
});
DoanVien.belongsTo(ChiDoan, {
  foreignKey: "idChiDoan",
  as: "chiDoan",
});

/**
 * 3. DoanVien - TaiKhoan (1:1)
 * One DoanVien has one TaiKhoan
 */
DoanVien.hasOne(TaiKhoan, {
  foreignKey: "idDV",
  as: "taiKhoan",
});
TaiKhoan.belongsTo(DoanVien, {
  foreignKey: "idDV",
  as: "doanVien",
});

/**
 * 4. VaiTro - TaiKhoan (1:N)
 * One VaiTro has many TaiKhoans
 */
VaiTro.hasMany(TaiKhoan, {
  foreignKey: "idVaiTro",
  as: "taiKhoans",
});
TaiKhoan.belongsTo(VaiTro, {
  foreignKey: "idVaiTro",
  as: "vaiTro",
});

/**
 * 5. Khoa - TaiKhoan (1:N)
 * One Khoa has many TaiKhoans (for Đoàn Khoa roles)
 */
Khoa.hasMany(TaiKhoan, {
  foreignKey: "idKhoa",
  as: "taiKhoansKhoa",
});
TaiKhoan.belongsTo(Khoa, {
  foreignKey: "idKhoa",
  as: "khoaTK",
});

/**
 * 6. DoanVien - SoDoan (1:1)
 * One DoanVien has one SoDoan
 */
DoanVien.hasOne(SoDoan, {
  foreignKey: "idDV",
  as: "soDoan",
});
SoDoan.belongsTo(DoanVien, {
  foreignKey: "idDV",
  as: "doanVien",
});

/**
 * 7. DoanVien - TieuSu (1:N)
 * One DoanVien has many TieuSus
 */
DoanVien.hasMany(TieuSu, {
  foreignKey: "idDV",
  as: "tieuSus",
});
TieuSu.belongsTo(DoanVien, {
  foreignKey: "idDV",
  as: "doanVien",
});

/**
 * 8. Khoa - HoatDongDoan (1:N)
 * One Khoa has many HoatDongDoans
 */
Khoa.hasMany(HoatDongDoan, {
  foreignKey: "idKhoa",
  as: "hoatDongsKhoa",
});
HoatDongDoan.belongsTo(Khoa, {
  foreignKey: "idKhoa",
  as: "khoaHD",
});

/**
 * 9. ChiDoan - HoatDongDoan (1:N)
 * One ChiDoan has many HoatDongDoans
 */
ChiDoan.hasMany(HoatDongDoan, {
  foreignKey: "idChiDoan",
  as: "hoatDongsChiDoan",
});
HoatDongDoan.belongsTo(ChiDoan, {
  foreignKey: "idChiDoan",
  as: "chiDoanHD",
});

/**
 * 10. DoanVien - HoatDongDoan (M:N)
 * Many DoanViens have many HoatDongDoans
 * Through: DoanVienDangKi
 */
DoanVien.belongsToMany(HoatDongDoan, {
  through: DoanVienDangKi,
  foreignKey: "idDV",
  otherKey: "idHD",
  as: "hoatDongs",
});
HoatDongDoan.belongsToMany(DoanVien, {
  through: DoanVienDangKi,
  foreignKey: "idHD",
  otherKey: "idDV",
  as: "doanViensDK",
});

/**
 * 10a. DoanVienDangKi - DoanVien (N:1)
 * DoanVienDangKi belongs to DoanVien
 */
DoanVienDangKi.belongsTo(DoanVien, {
  foreignKey: "idDV",
  as: "doanVien",
});

/**
 * 10b. DoanVienDangKi - HoatDongDoan (N:1)
 * DoanVienDangKi belongs to HoatDongDoan
 */
DoanVienDangKi.belongsTo(HoatDongDoan, {
  foreignKey: "idHD",
  as: "hoatDong",
});

/**
 * 11. DoanVien - DoanPhi (1:N)
 * One DoanVien has many DoanPhis
 */
DoanVien.hasMany(DoanPhi, {
  foreignKey: "idDV",
  as: "doanPhis",
});
DoanPhi.belongsTo(DoanVien, {
  foreignKey: "idDV",
  as: "doanVien",
});

/**
 * 12. MucDoanPhi - DoanPhi (1:N)
 * One MucDoanPhi has many DoanPhis
 */
MucDoanPhi.hasMany(DoanPhi, {
  foreignKey: "idMucDP",
  as: "doanPhis",
});
DoanPhi.belongsTo(MucDoanPhi, {
  foreignKey: "idMucDP",
  as: "mucDoanPhi",
});

/**
 * 13. PhieuThuDoanPhi - DoanPhi (1:N)
 * One PhieuThuDoanPhi has many DoanPhis
 */
PhieuThuDoanPhi.hasMany(DoanPhi, {
  foreignKey: "idPhieuThu",
  as: "doanPhis",
});
DoanPhi.belongsTo(PhieuThuDoanPhi, {
  foreignKey: "idPhieuThu",
  as: "phieuThuDoanPhi",
});

/**
 * 14. TaiKhoan - PhieuThuDoanPhi (1:N)
 * One TaiKhoan can create many PhieuThuDoanPhis
 */
TaiKhoan.hasMany(PhieuThuDoanPhi, {
  foreignKey: "nguoiNop",
  as: "phieuThuDoanPhis",
});
PhieuThuDoanPhi.belongsTo(TaiKhoan, {
  foreignKey: "nguoiNop",
  as: "nguoiNopTK",
});

// ========================================
// Export all models and sequelize instance
// ========================================
module.exports = {
  sequelize,
  Khoa,
  VaiTro,
  ChiDoan,
  DoanVien,
  TaiKhoan,
  SoDoan,
  TieuSu,
  HoatDongDoan,
  DoanVienDangKi,
  MucDoanPhi,
  PhieuThuDoanPhi,
  DoanPhi,
};
