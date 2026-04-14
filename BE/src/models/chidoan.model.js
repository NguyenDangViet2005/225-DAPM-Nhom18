const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/database.config");

const ChiDoan = sequelize.define(
  "ChiDoan",
  {
    idChiDoan: {
      type: DataTypes.CHAR(15),
      primaryKey: true,
      allowNull: false,
    },
    tenChiDoan: {
      type: DataTypes.NVARCHAR(100),
      allowNull: false,
    },
    nienKhoa: {
      type: DataTypes.VARCHAR(20),
      allowNull: true,
    },
    siSo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idKhoa: {
      type: DataTypes.CHAR(15),
      allowNull: true,
      references: {
        model: "Khoa",
        key: "idKhoa",
      },
    },
  },
  {
    tableName: "ChiDoan",
    timestamps: false,
  },
);

module.exports = ChiDoan;
