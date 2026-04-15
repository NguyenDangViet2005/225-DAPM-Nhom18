const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/database.config");

const TieuSu = sequelize.define(
  "TieuSu",
  {
    idTieuSu: {
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
    tuThoiGian: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    denThoiGian: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    donViCongTac: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    chucVuCu: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
  {
    tableName: "TieuSu",
    timestamps: false,
  },
);

module.exports = TieuSu;
