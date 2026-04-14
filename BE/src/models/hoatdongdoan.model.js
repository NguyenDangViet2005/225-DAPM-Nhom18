const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/database.config");

const HoatDongDoan = sequelize.define(
  "HoatDongDoan",
  {
    idHD: {
      type: DataTypes.STRING(15),
      primaryKey: true,
      allowNull: false,
    },
    tenHD: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    moTa: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    ngayToChuc: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    diaDiem: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    soLuongMax: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    soLuongDaDK: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    trangThai: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    trangThaiHD: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    donViToChuc: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    diemHD: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idKhoa: {
      type: DataTypes.STRING(15),
      allowNull: true,
      references: {
        model: "Khoa",
        key: "idKhoa",
      },
    },
    idChiDoan: {
      type: DataTypes.STRING(15),
      allowNull: true,
      references: {
        model: "ChiDoan",
        key: "idChiDoan",
      },
    },
  },
  {
    tableName: "HoatDongDoan",
    timestamps: false,
  },
);

module.exports = HoatDongDoan;
