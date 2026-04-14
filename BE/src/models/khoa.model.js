const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/database.config");

const Khoa = sequelize.define(
  "Khoa",
  {
    idKhoa: {
      type: DataTypes.CHAR(15),
      primaryKey: true,
      allowNull: false,
    },
    tenKhoa: {
      type: DataTypes.NVARCHAR(100),
      allowNull: false,
    },
  },
  {
    tableName: "Khoa",
    timestamps: false,
  },
);

module.exports = Khoa;
