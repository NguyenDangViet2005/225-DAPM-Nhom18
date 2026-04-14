const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/database.config");

const DoanPhi = sequelize.define(
  "DoanPhi",
  {
    idDoanPhi: {
      type: DataTypes.CHAR(15),
      primaryKey: true,
      allowNull: false,
    },
    idDV: {
      type: DataTypes.CHAR(15),
      allowNull: true,
      references: {
        model: "DoanVien",
        key: "idDV",
      },
    },
    trangThai: {
      type: DataTypes.NVARCHAR(50),
      allowNull: true,
    },
    ngayDong: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    idPhieuThu: {
      type: DataTypes.CHAR(15),
      allowNull: true,
      references: {
        model: "PhieuThuDoanPhi",
        key: "idPhieuThu",
      },
    },
    idMucDP: {
      type: DataTypes.CHAR(15),
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
