const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/database.config");

const SoDoan = sequelize.define(
  "SoDoan",
  {
    idSoDoan: {
      type: DataTypes.CHAR(15),
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
      type: DataTypes.NVARCHAR(100),
      allowNull: true,
    },
    trangThai: {
      type: DataTypes.NVARCHAR(50),
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
