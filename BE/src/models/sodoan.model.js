const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/database.config");

const SoDoan = sequelize.define(
  "SoDoan",
  {
    idSoDoan: {
      type: DataTypes.STRING(15),
      primaryKey: true,
      allowNull: false,
    },
    idDV: {
      type: DataTypes.CHAR(15),
      allowNull: false,
      unique: true,
      references: {
        model: "DoanVien",
        key: "idDV",
      },
    },
    ngayCap: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    noiCap: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    trangThai: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    ngayRutSo: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "SoDoan",
    timestamps: false,
  },
);

module.exports = SoDoan;
