const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/database.config");

const PhieuThuDoanPhi = sequelize.define(
  "PhieuThuDoanPhi",
  {
    idPhieuThu: {
      type: DataTypes.CHAR(15),
      primaryKey: true,
      allowNull: false,
    },
    nguoiNop: {
      type: DataTypes.CHAR(15),
      allowNull: true,
      references: {
        model: "TaiKhoan",
        key: "idUser",
      },
    },
    fileDinhKem: {
      type: DataTypes.NVARCHAR(200),
      allowNull: true,
    },
    trangThai: {
      type: DataTypes.NVARCHAR(50),
      allowNull: true,
    },
  },
  {
    tableName: "PhieuThuDoanPhi",
    timestamps: false,
  },
);

module.exports = PhieuThuDoanPhi;
