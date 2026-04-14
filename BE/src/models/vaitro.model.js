const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/database.config");

const VaiTro = sequelize.define(
  "VaiTro",
  {
    idVaiTro: {
      type: DataTypes.STRING(15),
      primaryKey: true,
      allowNull: false,
    },
    tenVaiTro: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "VaiTro",
    timestamps: false,
  },
);

module.exports = VaiTro;
