const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/database.config");

const DoanVien = sequelize.define(
  "DoanVien",
  {
    idDV: {
      type: DataTypes.STRING(15),
      primaryKey: true,
      allowNull: false,
    },
    // Thông tin cá nhân
    hoTen: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    anhThe: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ngaySinh: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gioiTinh: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    CCCD: {
      type: DataTypes.STRING(12),
      allowNull: true,
    },
    ngayCapCCCD: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    noiCapCCCD: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    SDT: {
      type: DataTypes.STRING(11),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    diaChiThuongTru: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    diaChiTamTru: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    danToc: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    tonGiao: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    // Thông tin sinh viên
    heDaoTao: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    trangThaiHoc: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    // Thông tin Đoàn
    idChiDoan: {
      type: DataTypes.STRING(15),
      allowNull: true,
      references: {
        model: "ChiDoan",
        key: "idChiDoan",
      },
    },
    chucVu: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    // Quá trình sinh hoạt
    diemHoatDong: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "DoanVien",
    timestamps: false,
  },
);

module.exports = DoanVien;
