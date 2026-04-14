const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/database.config");

const DoanVienDangKi = sequelize.define(
  "DoanVienDangKi",
  {
    idDV: {
      type: DataTypes.CHAR(15),
      primaryKey: true,
      references: {
        model: "DoanVien",
        key: "idDV",
      },
    },
    idHD: {
      type: DataTypes.CHAR(15),
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
      type: DataTypes.NVARCHAR(50),
      allowNull: true,
    },
    lyDoTuChoi: {
      type: DataTypes.NVARCHAR(500),
      allowNull: true,
    },
  },
  {
    tableName: "DoanVienDangKi",
    timestamps: false,
  },
);

module.exports = DoanVienDangKi;
