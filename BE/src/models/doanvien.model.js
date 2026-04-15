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
    hoTen: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    ngaySinh: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gioiTinh: {
      type: DataTypes.STRING(10),
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
    diaChi: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    idChiDoan: {
      type: DataTypes.STRING(15),
      allowNull: true,
      references: {
        model: "ChiDoan",
        key: "idChiDoan",
      },
    },
    ngayVaoDoan: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    noiChuyenDen: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ngayChuyenDen: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    trangThaiSH: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    diemHD: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    chucVu: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "DoanVien",
    timestamps: false,
  },
);

module.exports = DoanVien;
