const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/database.config");

const PhieuThuDoanPhi = sequelize.define(
  "PhieuThuDoanPhi",
  {
    idPhieuThu: {
      type: DataTypes.STRING(15),
      primaryKey: true,
      allowNull: false,
    },
    nguoiNop: {
      type: DataTypes.STRING(15),
      allowNull: true,
      references: {
        model: "TaiKhoan",
        key: "idUser",
      },
    },
    fileDinhKem: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    trangThai: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    ngayLap: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tongTien: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "PhieuThuDoanPhi",
    timestamps: false,
  },
);

module.exports = PhieuThuDoanPhi;
