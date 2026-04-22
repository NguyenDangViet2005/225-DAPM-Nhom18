const { sequelize } = require('./src/configs/database.config');
async function fix() {
  await sequelize.query(`
    UPDATE PhieuThuDoanPhi
    SET ngayLap = GETDATE(),
        tongTien = (
          SELECT ISNULL(SUM(m.soTien), 0)
          FROM DoanPhi d
          JOIN MucDoanPhi m ON d.idMucDP = m.idMucDP
          WHERE d.idPhieuThu = PhieuThuDoanPhi.idPhieuThu
        )
    WHERE ngayLap IS NULL
  `);
  console.log('Fixed old records data');
}
fix();
