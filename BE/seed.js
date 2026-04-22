const { sequelize } = require('./src/configs/database.config');
async function seed() {
  try {
    await sequelize.query(`
      IF NOT EXISTS (SELECT 1 FROM HoatDongDoan WHERE idHD = 'HDCD_TEST_01')
      BEGIN
        INSERT INTO HoatDongDoan (idHD, tenHD, moTa, ngayToChuc, diaDiem, soLuongMax, soLuongDaDK, trangThai, trangThaiHD, donViToChuc, diemHD, idChiDoan)
        VALUES ('HDCD_TEST_01', N'Dọn vệ sinh (Test)', N'Data test', '2026-05-01', N'Sân trường', 50, 0, N'Đang mở', N'Đã duyệt', N'Chi Đoàn CD001', 10, 'CD001  ');
      END
    `);
    
    await sequelize.query(`
      IF NOT EXISTS (SELECT 1 FROM DoanVienDangKi WHERE idHD = 'HDCD_TEST_01' AND idDV = '23115053122201 ')
      BEGIN
        INSERT INTO DoanVienDangKi (idHD, idDV, ngayDangKi, trangThaiDuyet, lyDoTuChoi)
        VALUES ('HDCD_TEST_01', '23115053122201 ', '2026-04-22', N'Đã duyệt', NULL);
        
        INSERT INTO DoanVienDangKi (idHD, idDV, ngayDangKi, trangThaiDuyet, lyDoTuChoi)
        VALUES ('HDCD_TEST_01', '23115053122202 ', '2026-04-22', N'Chờ duyệt', NULL);
        
        INSERT INTO DoanVienDangKi (idHD, idDV, ngayDangKi, trangThaiDuyet, lyDoTuChoi)
        VALUES ('HDCD_TEST_01', '23115053122203 ', '2026-04-22', N'Từ chối', N'Không đủ điều kiện');
      END
    `);
    console.log('Seeded perfectly!');
    process.exit(0);
  } catch(e) { console.error(e); process.exit(1); }
}
seed();
