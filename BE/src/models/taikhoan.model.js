const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs/database.config");

const TaiKhoan = sequelize.define(
  "TaiKhoan",
  {
    idUser: {
      type: DataTypes.CHAR(15),
      primaryKey: true,
      allowNull: false,
    },
    tenNguoiDung: {
      type: DataTypes.NVARCHAR(100),
      allowNull: false,
    },
    matKhau: {
      type: DataTypes.NVARCHAR(100),
      allowNull: false,
    },
    trangThai: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    ngayTao: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    idVaiTro: {
      type: DataTypes.CHAR(15),
      allowNull: true,
      references: {
        model: "VaiTro",
        key: "idVaiTro",
      },
    },
    idDV: {
      type: DataTypes.CHAR(15),
      allowNull: true,
      references: {
        model: "DoanVien",
        key: "idDV",
      },
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
    tableName: "TaiKhoan",
    timestamps: false,
  },
);

module.exports = TaiKhoan;
