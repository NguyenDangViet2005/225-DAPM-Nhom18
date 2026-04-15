const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/database.config");

const DoanPhi = sequelize.define(
  "DoanPhi",
  {
    idDoanPhi: {
      type: DataTypes.STRING(15),
      primaryKey: true,
      allowNull: false,
    },
    idDV: {
      type: DataTypes.STRING(15),
      allowNull: true,
      references: {
        model: "DoanVien",
        key: "idDV",
      },
    },
    trangThai: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    ngayDong: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    idPhieuThu: {
      type: DataTypes.STRING(15),
      allowNull: true,
      references: {
        model: "PhieuThuDoanPhi",
        key: "idPhieuThu",
      },
    },
    idMucDP: {
      type: DataTypes.STRING(15),
      allowNull: true,
      references: {
        model: "MucDoanPhi",
        key: "idMucDP",
      },
    },
  },
  {
    tableName: "DoanPhi",
    timestamps: false,
  },
);

module.exports = DoanPhi;
