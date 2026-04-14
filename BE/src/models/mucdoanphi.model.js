const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/database.config");

const MucDoanPhi = sequelize.define(
  "MucDoanPhi",
  {
    idMucDP: {
      type: DataTypes.STRING(15),
      primaryKey: true,
      allowNull: false,
    },
    namHoc: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    soTien: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    trangThai: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "MucDoanPhi",
    timestamps: false,
  },
);

module.exports = MucDoanPhi;
