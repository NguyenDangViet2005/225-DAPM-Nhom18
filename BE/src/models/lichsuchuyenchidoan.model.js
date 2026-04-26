const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/database.config");

const LichSuChuyenChiDoan = sequelize.define(
  "LichSuChuyenChiDoan",
  {
    idLichSu: {
      type: DataTypes.STRING(15),
      primaryKey: true,
      allowNull: false,
    },
    idSoDoan: {
      type: DataTypes.STRING(15),
      allowNull: false,
      references: {
        model: "SoDoan",
        key: "idSoDoan",
      },
    },
    tuDonVi: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    denDonVi: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    ngayBatDau: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    ngayKetThuc: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    lyDo: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
  {
    tableName: "LichSuChuyenChiDoan",
    timestamps: false,
  },
);

module.exports = LichSuChuyenChiDoan;
