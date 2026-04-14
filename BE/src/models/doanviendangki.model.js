const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/database.config");

const DoanVienDangKi = sequelize.define(
  "DoanVienDangKi",
  {
    idDV: {
      type: DataTypes.STRING(15),
      primaryKey: true,
      references: {
        model: "DoanVien",
        key: "idDV",
      },
    },
    idHD: {
      type: DataTypes.STRING(15),
      primaryKey: true,
      references: {
        model: "HoatDongDoan",
        key: "idHD",
      },
    },
    ngayDangKi: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    trangThaiDuyet: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    lyDoTuChoi: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "DoanVienDangKi",
    timestamps: false,
  },
);

module.exports = DoanVienDangKi;
