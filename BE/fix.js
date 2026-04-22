const { sequelize } = require('./src/configs/database.config');
async function fix() {
  await sequelize.query("UPDATE PhieuThuDoanPhi SET trangThai = N'Chờ duyệt' WHERE trangThai = N'Đang chờ duyệt'");
  console.log('Fixed DB records');
}
fix();
