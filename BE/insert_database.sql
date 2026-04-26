USE QuanLyDoanVien
GO

-- DELETE existing data (in correct order to avoid foreign key conflicts)
DELETE FROM DoanVienDangKi;
DELETE FROM DoanPhi;
DELETE FROM PhieuThuDoanPhi;
DELETE FROM LichSuChuyenChiDoan;
DELETE FROM SoDoan;
DELETE FROM HoatDongDoan;
DELETE FROM MucDoanPhi;
DELETE FROM TaiKhoan;
DELETE FROM DoanVien;
DELETE FROM ChiDoan;
DELETE FROM VaiTro;
DELETE FROM Khoa;
GO

-- 1. Chèn dữ liệu danh mục Khoa, Vai trò, Chi đoàn
INSERT INTO Khoa (idKhoa, tenKhoa) VALUES
('KHOA001', N'Khoa Công nghệ Số'),
('KHOA002', N'Khoa Điện - Điện tử'),
('KHOA003', N'Khoa Sư phạm Công nghiệp'),
('KHOA004', N'Khoa Cơ khí'),
('KHOA005', N'Khoa Kỹ thuật Xây dựng'),
('KHOA006', N'Khoa Công nghệ Hóa học - Thực phẩm');

INSERT INTO VaiTro (idVaiTro, tenVaiTro) VALUES
('VT001', N'Đoàn trường'),
('VT002', N'Đoàn khoa'),
('VT003', N'Bí thư Chi đoàn'),
('VT004', N'Đoàn viên');

INSERT INTO ChiDoan (idChiDoan, tenChiDoan, nienKhoa, siSo, idKhoa) VALUES
('CD001', N'Chi đoàn 23T1', '2023-2027', 4, 'KHOA001'),
('CD002', N'Chi đoàn 23T2', '2023-2027', 4, 'KHOA001'),
('CD003', N'Chi đoàn 23D1', '2023-2027', 4, 'KHOA002'),
('CD004', N'Chi đoàn 23D2', '2023-2027', 4, 'KHOA002'),
('CD005', N'Chi đoàn 23SP1', '2023-2027', 4, 'KHOA003'),
('CD006', N'Chi đoàn 23CK1', '2023-2027', 4, 'KHOA004'),
('CD007', N'Chi đoàn 23XD1', '2023-2027', 4, 'KHOA005'),
('CD008', N'Chi đoàn 23HH1', '2023-2027', 4, 'KHOA006'),
('CD009', N'Chi đoàn 23T3', '2023-2027', 4, 'KHOA001'),
('CD010', N'Chi đoàn 23D3', '2023-2027', 4, 'KHOA002');
GO

-- 2. Chèn Đoàn viên (40 người) - Người thứ nhất mỗi chi đoàn là Bí thư
INSERT INTO DoanVien (
    idDV, hoTen, anhThe, ngaySinh, gioiTinh, CCCD, ngayCapCCCD, noiCapCCCD, 
    SDT, email, diaChiThuongTru, diaChiTamTru, danToc, tonGiao,
    heDaoTao, trangThaiHoc, idChiDoan, chucVu, diemHoatDong
) VALUES
-- CD001 - Người 201 là Bí thư
('23115053122201', N'Nguyễn Văn An', NULL, '2005-01-15', N'Nam', '079205001234', '2020-01-15', N'Công an Thành phố Đà Nẵng',
 '0901234501', 'an01@student.ute.udn.vn', N'123 Lê Duẩn, Hải Châu, Thành phố Đà Nẵng', N'45 Nguyễn Văn Linh, Thanh Khê, Thành phố Đà Nẵng', N'Kinh', N'Không',
 N'Chính quy', N'Đang học', 'CD001', N'Bí thư Chi đoàn', 85),
('23115053122202', N'Trần Thị Bình', NULL, '2005-03-20', N'Nữ', '079205002345', '2020-03-20', N'Công an Thành phố Đà Nẵng',
 '0901234502', 'binh02@student.ute.udn.vn', N'456 Trần Phú, Hải Châu, Thành phố Đà Nẵng', NULL, N'Kinh', N'Phật giáo',
 N'Chính quy', N'Đang học', 'CD001', NULL, 90),
('23115053122203', N'Lê Hoàng Cường', NULL, '2005-05-10', N'Nam', '079205003456', '2020-05-10', N'Công an Thành phố Đà Nẵng',
 '0901234503', 'cuong03@student.ute.udn.vn', N'789 Hùng Vương, Thanh Khê, Thành phố Đà Nẵng', NULL, N'Kinh', N'Không',
 N'Chính quy', N'Đang học', 'CD001', NULL, 78),
('23115053122204', N'Phạm Thị Dung', NULL, '2005-07-25', N'Nữ', '079205004567', '2020-07-25', N'Công an Thành phố Đà Nẵng',
 '0901234504', 'dung04@student.ute.udn.vn', N'321 Ngô Quyền, Sơn Trà, Thành phố Đà Nẵng', NULL, N'Kinh', N'Công giáo',
 N'Chính quy', N'Đang học', 'CD001', NULL, 92),
-- CD002 - Người 205 là Bí thư
('23115053122205', N'Hoàng Văn Em', NULL, '2005-02-14', N'Nam', '051205005678', '2020-02-14', N'Công an Thành phố Đà Nẵng',
 '0901234505', 'em05@student.ute.udn.vn', N'234 Hùng Vương, Tam Kỳ, Thành phố Đà Nẵng', N'67 Ông Ích Khiêm, Hải Châu, Thành phố Đà Nẵng', N'Kinh', N'Không',
 N'Chính quy', N'Đang học', 'CD002', N'Bí thư Chi đoàn', 88),
('23115053122206', N'Võ Thị Phương', NULL, '2005-01-20', N'Nữ', '051205006789', '2020-01-20', N'Công an Thành phố Đà Nẵng',
 '0901234506', 'phuong06@student.ute.udn.vn', N'567 Phan Bội Châu, Hội An, Thành phố Đà Nẵng', NULL, N'Kinh', N'Phật giáo',
 N'Chính quy', N'Đang học', 'CD002', NULL, 86),
('23115053122207', N'Đặng Văn Giang', NULL, '2005-03-15', N'Nam', '051205007890', '2020-03-15', N'Công an Thành phố Đà Nẵng',
 '0901234507', 'giang07@student.ute.udn.vn', N'890 Trần Hưng Đạo, Tam Kỳ, Thành phố Đà Nẵng', NULL, N'Kinh', N'Không',
 N'Chính quy', N'Đang học', 'CD002', NULL, 91),
('23115053122208', N'Bùi Thị Hà', NULL, '2005-05-22', N'Nữ', '051205008901', '2020-05-22', N'Công an Thành phố Đà Nẵng',
 '0901234508', 'ha08@student.ute.udn.vn', N'123 Lê Lợi, Hội An, Thành phố Đà Nẵng', NULL, N'Kinh', N'Công giáo',
 N'Chính quy', N'Đang học', 'CD002', NULL, 84),
-- CD003 - Người 209 là Bí thư
('23115053122209', N'Trương Văn Ích', NULL, '2005-07-30', N'Nam', '046205009012', '2020-07-30', N'Công an Thừa Thiên Huế',
 '0901234509', 'ich09@student.ute.udn.vn', N'456 Lê Duẩn, Thành phố Huế', N'89 Điện Biên Phủ, Thanh Khê, Thành phố Đà Nẵng', N'Kinh', N'Không',
 N'Chính quy', N'Đang học', 'CD003', N'Bí thư Chi đoàn', 89),
('23115053122210', N'Lý Thị Kim', NULL, '2005-09-12', N'Nữ', '046205010123', '2020-09-12', N'Công an Thừa Thiên Huế',
 '0901234510', 'kim10@student.ute.udn.vn', N'789 Trần Hưng Đạo, Thành phố Huế', NULL, N'Kinh', N'Phật giáo',
 N'Chính quy', N'Đang học', 'CD003', NULL, 93),
('23115053122211', N'Phan Văn Long', NULL, '2005-01-18', N'Nam', '046205011234', '2020-01-18', N'Công an Thừa Thiên Huế',
 '0901234511', 'long11@student.ute.udn.vn', N'321 Nguyễn Huệ, Thành phố Huế', NULL, N'Kinh', N'Không',
 N'Chính quy', N'Đang học', 'CD003', NULL, 87),
('23115053122212', N'Ngô Thị Mai', NULL, '2005-03-25', N'Nữ', '046205012345', '2020-03-25', N'Công an Thừa Thiên Huế',
 '0901234512', 'mai12@student.ute.udn.vn', N'654 Hai Bà Trưng, Thành phố Huế', NULL, N'Kinh', N'Công giáo',
 N'Chính quy', N'Đang học', 'CD003', NULL, 90),
-- CD004 - Người 213 là Bí thư
('23115053122213', N'Đinh Văn Nam', NULL, '2005-05-14', N'Nam', '055205013456', '2020-05-14', N'Công an Quảng Ngãi',
 '0901234513', 'nam13@student.ute.udn.vn', N'123 Quang Trung, TP Quảng Ngãi', NULL, N'Kinh', N'Không',
 N'Chính quy', N'Đang học', 'CD004', N'Bí thư Chi đoàn', 82),
('23115053122214', N'Huỳnh Thị Oanh', NULL, '2005-07-20', N'Nữ', '055205014567', '2020-07-20', N'Công an Quảng Ngãi',
 '0901234514', 'oanh14@student.ute.udn.vn', N'456 Phan Đình Phùng, TP Quảng Ngãi', NULL, N'Kinh', N'Phật giáo',
 N'Chính quy', N'Đang học', 'CD004', NULL, 94),
('23115053122215', N'Vũ Văn Phúc', NULL, '2005-09-08', N'Nam', '055205015678', '2020-09-08', N'Công an Quảng Ngãi',
 '0901234515', 'phuc15@student.ute.udn.vn', N'789 Hùng Vương, TP Quảng Ngãi', NULL, N'Kinh', N'Không',
 N'Chính quy', N'Đang học', 'CD004', NULL, 88),
('23115053122216', N'Dương Thị Quỳnh', NULL, '2005-01-12', N'Nữ', '055205016789', '2020-01-12', N'Công an Quảng Ngãi',
 '0901234516', 'quynh16@student.ute.udn.vn', N'321 Trần Phú, TP Quảng Ngãi', NULL, N'Kinh', N'Công giáo',
 N'Chính quy', N'Đang học', 'CD004', NULL, 85),
-- CD005 - Người 217 là Bí thư
('23115053122217', N'Tô Văn Rồng', NULL, '2005-03-19', N'Nam', '047205017890', '2020-03-19', N'Công an Bình Định',
 '0901234517', 'rong17@student.ute.udn.vn', N'123 Lê Lợi, Quy Nhơn, Bình Định', NULL, N'Kinh', N'Không',
 N'Chính quy', N'Đang học', 'CD005', N'Bí thư Chi đoàn', 91),
('23115053122218', N'Mai Thị Sương', NULL, '2005-05-27', N'Nữ', '047205018901', '2020-05-27', N'Công an Bình Định',
 '0901234518', 'suong18@student.ute.udn.vn', N'456 Trần Hưng Đạo, Quy Nhơn, Bình Định', NULL, N'Kinh', N'Phật giáo',
 N'Chính quy', N'Đang học', 'CD005', NULL, 89),
('23115053122219', N'Lâm Văn Tài', NULL, '2005-07-15', N'Nam', '047205019012', '2020-07-15', N'Công an Bình Định',
 '0901234519', 'tai19@student.ute.udn.vn', N'789 Hùng Vương, Quy Nhơn, Bình Định', NULL, N'Kinh', N'Không',
 N'Chính quy', N'Đang học', 'CD005', NULL, 86),
('23115053122220', N'Cao Thị Uyên', NULL, '2005-09-22', N'Nữ', '047205020123', '2020-09-22', N'Công an Bình Định',
 '0901234520', 'uyen20@student.ute.udn.vn', N'321 Ngô Quyền, Quy Nhơn, Bình Định', NULL, N'Kinh', N'Công giáo',
 N'Chính quy', N'Đang học', 'CD005', NULL, 92),
-- CD006 - Người 221 là Bí thư
('23115053122221', N'Đỗ Văn Vinh', NULL, '2005-02-10', N'Nam', '060205021234', '2020-02-10', N'Công an Gia Lai',
 '0901234521', 'vinh21@student.ute.udn.vn', N'123 Lê Duẩn, Pleiku, Gia Lai', NULL, N'Kinh', N'Không',
 N'Chính quy', N'Đang học', 'CD006', N'Bí thư Chi đoàn', 87),
('23115053122222', N'Hồ Thị Xuân', NULL, '2005-04-18', N'Nữ', '060205022345', '2020-04-18', N'Công an Gia Lai',
 '0901234522', 'xuan22@student.ute.udn.vn', N'456 Trần Phú, Pleiku, Gia Lai', NULL, N'Kinh', N'Phật giáo',
 N'Chính quy', N'Đang học', 'CD006', NULL, 90),
('23115053122223', N'Trịnh Văn Yên', NULL, '2005-06-25', N'Nam', '060205023456', '2020-06-25', N'Công an Gia Lai',
 '0901234523', 'yen23@student.ute.udn.vn', N'789 Hùng Vương, Pleiku, Gia Lai', NULL, N'Kinh', N'Không',
 N'Chính quy', N'Đang học', 'CD006', NULL, 83),
('23115053122224', N'Lưu Thị Ánh', NULL, '2005-08-30', N'Nữ', '060205024567', '2020-08-30', N'Công an Gia Lai',
 '0901234524', 'anh24@student.ute.udn.vn', N'321 Ngô Quyền, Pleiku, Gia Lai', NULL, N'Kinh', N'Công giáo',
 N'Chính quy', N'Đang học', 'CD006', NULL, 95),
-- CD007 - Người 225 là Bí thư
('23115053122225', N'Kiều Văn Bảo', NULL, '2005-10-05', N'Nam', '061205025678', '2020-10-05', N'Công an Đắk Lắk',
 '0901234525', 'bao25@student.ute.udn.vn', N'123 Lê Lợi, Buôn Ma Thuột, Đắk Lắk', NULL, N'Kinh', N'Không',
 N'Chính quy', N'Đang học', 'CD007', N'Bí thư Chi đoàn', 88),
('23115053122226', N'Ông Thị Chi', NULL, '2005-02-14', N'Nữ', '061205026789', '2020-02-14', N'Công an Đắk Lắk',
 '0901234526', 'chi26@student.ute.udn.vn', N'456 Trần Hưng Đạo, Buôn Ma Thuột, Đắk Lắk', NULL, N'Kinh', N'Phật giáo',
 N'Chính quy', N'Đang học', 'CD007', NULL, 86),
('23115053122227', N'Tạ Văn Đức', NULL, '2005-04-20', N'Nam', '061205027890', '2020-04-20', N'Công an Đắk Lắk',
 '0901234527', 'duc27@student.ute.udn.vn', N'789 Hùng Vương, Buôn Ma Thuột, Đắk Lắk', NULL, N'Kinh', N'Không',
 N'Chính quy', N'Đang học', 'CD007', NULL, 91),
('23115053122228', N'Lương Thị Ê', NULL, '2005-06-28', N'Nữ', '061205028901', '2020-06-28', N'Công an Đắk Lắk',
 '0901234528', 'e28@student.ute.udn.vn', N'321 Ngô Quyền, Buôn Ma Thuột, Đắk Lắk', NULL, N'Kinh', N'Công giáo',
 N'Chính quy', N'Đang học', 'CD007', NULL, 84),
-- CD008 - Người 229 là Bí thư
('23115053122229', N'Hà Văn Phong', NULL, '2005-08-15', N'Nam', '068205029012', '2020-08-15', N'Công an Ninh Thuận',
 '0901234529', 'phong29@student.ute.udn.vn', N'123 Lê Duẩn, Phan Rang, Ninh Thuận', NULL, N'Kinh', N'Không',
 N'Chính quy', N'Đang học', 'CD008', N'Bí thư Chi đoàn', 89),
('23115053122230', N'Thái Thị Giang', NULL, '2005-10-22', N'Nữ', '068205030123', '2020-10-22', N'Công an Ninh Thuận',
 '0901234530', 'giang30@student.ute.udn.vn', N'456 Trần Phú, Phan Rang, Ninh Thuận', NULL, N'Kinh', N'Phật giáo',
 N'Chính quy', N'Đang học', 'CD008', NULL, 93),
('23115053122231', N'Quách Văn Hải', NULL, '2005-02-16', N'Nam', '068205031234', '2020-02-16', N'Công an Ninh Thuận',
 '0901234531', 'hai31@student.ute.udn.vn', N'789 Hùng Vương, Phan Rang, Ninh Thuận', NULL, N'Kinh', N'Không',
 N'Chính quy', N'Đang học', 'CD008', NULL, 87),
('23115053122232', N'Từ Thị Ích', NULL, '2005-04-23', N'Nữ', '068205032345', '2020-04-23', N'Công an Ninh Thuận',
 '0901234532', 'ich32@student.ute.udn.vn', N'321 Ngô Quyền, Phan Rang, Ninh Thuận', NULL, N'Kinh', N'Công giáo',
 N'Chính quy', N'Đang học', 'CD008', NULL, 90),
-- CD009 - Người 233 là Bí thư
('23115053122233', N'Ứng Văn Khang', NULL, '2005-06-30', N'Nam', '058205033456', '2020-06-30', N'Công an Khánh Hòa',
 '0901234533', 'khang33@student.ute.udn.vn', N'123 Lê Lợi, Nha Trang, Khánh Hòa', NULL, N'Kinh', N'Không',
 N'Chính quy', N'Đang học', 'CD009', N'Bí thư Chi đoàn', 82),
('23115053122234', N'Vương Thị Linh', NULL, '2005-08-17', N'Nữ', '058205034567', '2020-08-17', N'Công an Khánh Hòa',
 '0901234534', 'linh34@student.ute.udn.vn', N'456 Trần Hưng Đạo, Nha Trang, Khánh Hòa', NULL, N'Kinh', N'Phật giáo',
 N'Chính quy', N'Đang học', 'CD009', NULL, 94),
('23115053122235', N'Xa Văn Minh', NULL, '2005-10-24', N'Nam', '058205035678', '2020-10-24', N'Công an Khánh Hòa',
 '0901234535', 'minh35@student.ute.udn.vn', N'789 Hùng Vương, Nha Trang, Khánh Hòa', NULL, N'Kinh', N'Không',
 N'Chính quy', N'Đang học', 'CD009', NULL, 88),
('23115053122236', N'Yên Thị Nga', NULL, '2005-03-11', N'Nữ', '058205036789', '2020-03-11', N'Công an Khánh Hòa',
 '0901234536', 'nga36@student.ute.udn.vn', N'321 Ngô Quyền, Nha Trang, Khánh Hòa', NULL, N'Kinh', N'Công giáo',
 N'Chính quy', N'Đang học', 'CD009', NULL, 85),
-- CD010 - Người 237 là Bí thư
('23115053122237', N'Gia Văn Oanh', NULL, '2005-05-19', N'Nam', '067205037890', '2020-05-19', N'Công an Lâm Đồng',
 '0901234537', 'oanh37@student.ute.udn.vn', N'123 Lê Duẩn, Đà Lạt, Lâm Đồng', NULL, N'Kinh', N'Không',
 N'Chính quy', N'Đang học', 'CD010', N'Bí thư Chi đoàn', 91),
('23115053122238', N'Âu Thị Phượng', NULL, '2005-07-26', N'Nữ', '067205038901', '2020-07-26', N'Công an Lâm Đồng',
 '0901234538', 'phuong38@student.ute.udn.vn', N'456 Trần Phú, Đà Lạt, Lâm Đồng', NULL, N'Kinh', N'Phật giáo',
 N'Chính quy', N'Đang học', 'CD010', NULL, 89),
('23115053122239', N'Ê Văn Quang', NULL, '2005-09-13', N'Nam', '067205039012', '2020-09-13', N'Công an Lâm Đồng',
 '0901234539', 'quang39@student.ute.udn.vn', N'789 Hùng Vương, Đà Lạt, Lâm Đồng', NULL, N'Kinh', N'Không',
 N'Chính quy', N'Đang học', 'CD010', NULL, 86),
('23115053122240', N'Ô Thị Rạng', NULL, '2005-11-20', N'Nữ', '067205040123', '2020-11-20', N'Công an Lâm Đồng',
 '0901234540', 'rang40@student.ute.udn.vn', N'321 Ngô Quyền, Đà Lạt, Lâm Đồng', NULL, N'Kinh', N'Công giáo',
 N'Chính quy', N'Đang học', 'CD010', NULL, 92);
GO

-- 3. Chèn Tài khoản (Admin, Đoàn khoa, Đoàn viên/Bí thư)
-- Password hash: $2b$10$JfRl4R4YdXKCf2RjJMOYH.xv.z2uMNqPt1Y6FGpJkPf2DrPvx8FaC (password: 123456)
INSERT INTO TaiKhoan (idUser, tenNguoiDung, matKhau, trangThai, ngayTao, idVaiTro, idDV, idKhoa) VALUES
-- Admin
('ADMIN01', N'doantruong', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT001', NULL, NULL),

-- Đoàn khoa
('KHOA_CNS', N'khoacns', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT002', NULL, 'KHOA001'),
('KHOA_DDT', N'khoaddt', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT002', NULL, 'KHOA002'),
('KHOA_SPCN', N'khoaspcn', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT002', NULL, 'KHOA003'),
('KHOA_CK', N'khoack', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT002', NULL, 'KHOA004'),
('KHOA_XD', N'khoaxd', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT002', NULL, 'KHOA005'),
('KHOA_HH', N'khoahh', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT002', NULL, 'KHOA006'),

-- Tài khoản đoàn viên và bí thư
-- CD001
('USER01', N'23115053122201', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT003', '23115053122201', NULL),
('USER02', N'23115053122202', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122202', NULL),
('USER03', N'23115053122203', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122203', NULL),
('USER04', N'23115053122204', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122204', NULL),
-- CD002
('USER05', N'23115053122205', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT003', '23115053122205', NULL),
('USER06', N'23115053122206', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122206', NULL),
('USER07', N'23115053122207', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122207', NULL),
('USER08', N'23115053122208', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122208', NULL),
-- CD003
('USER09', N'23115053122209', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT003', '23115053122209', NULL),
('USER10', N'23115053122210', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122210', NULL),
('USER11', N'23115053122211', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122211', NULL),
('USER12', N'23115053122212', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122212', NULL),
-- CD004
('USER13', N'23115053122213', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT003', '23115053122213', NULL),
('USER14', N'23115053122214', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122214', NULL),
('USER15', N'23115053122215', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122215', NULL),
('USER16', N'23115053122216', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122216', NULL),
-- CD005
('USER17', N'23115053122217', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT003', '23115053122217', NULL),
('USER18', N'23115053122218', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122218', NULL),
('USER19', N'23115053122219', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122219', NULL),
('USER20', N'23115053122220', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122220', NULL),
-- CD006
('USER21', N'23115053122221', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT003', '23115053122221', NULL),
('USER22', N'23115053122222', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122222', NULL),
('USER23', N'23115053122223', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122223', NULL),
('USER24', N'23115053122224', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122224', NULL),
-- CD007
('USER25', N'23115053122225', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT003', '23115053122225', NULL),
('USER26', N'23115053122226', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122226', NULL),
('USER27', N'23115053122227', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122227', NULL),
('USER28', N'23115053122228', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122228', NULL),
-- CD008
('USER29', N'23115053122229', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT003', '23115053122229', NULL),
('USER30', N'23115053122230', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122230', NULL),
('USER31', N'23115053122231', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122231', NULL),
('USER32', N'23115053122232', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122232', NULL),
-- CD009
('USER33', N'23115053122233', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT003', '23115053122233', NULL),
('USER34', N'23115053122234', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122234', NULL),
('USER35', N'23115053122235', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122235', NULL),
('USER36', N'23115053122236', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122236', NULL),
-- CD010
('USER37', N'23115053122237', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT003', '23115053122237', NULL),
('USER38', N'23115053122238', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122238', NULL),
('USER39', N'23115053122239', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122239', NULL),
('USER40', N'23115053122240', '$2b$10$IVkEDROpkvh1uNb9qFGieOuQi/VVWBNWa0/VPQSPlPLbJy/jHcFBq', 1, GETDATE(), 'VT004', '23115053122240', NULL);
GO

-- 4. Chèn Sổ đoàn
INSERT INTO SoDoan (idSoDoan, idDV, ngayCap, noiCap, trangThai, ngayRutSo, ngayVaoDoan, noiKetNap)
SELECT 'SD' + RIGHT('00' + CAST(ROW_NUMBER() OVER (ORDER BY idDV) AS VARCHAR), 3), idDV, '2023-09-01', N'Đoàn Trường ĐH Sư phạm Kỹ thuật', 
       CASE 
         WHEN (ROW_NUMBER() OVER (ORDER BY idDV) % 3) = 0 THEN N'Chưa nộp sổ'
         WHEN (ROW_NUMBER() OVER (ORDER BY idDV) % 4) = 0 THEN N'Đã rút sổ'
         ELSE N'Đã nộp sổ' 
       END,
       CASE 
         WHEN (ROW_NUMBER() OVER (ORDER BY idDV) % 4) = 0 THEN '2024-01-15'
         ELSE NULL 
       END,
       '2023-09-15',
       CASE 
         WHEN (ROW_NUMBER() OVER (ORDER BY idDV) % 5) = 1 THEN N'THPT Việt Đức, Thành phố Đà Nẵng'
         WHEN (ROW_NUMBER() OVER (ORDER BY idDV) % 5) = 2 THEN N'THPT Lê Quý Đôn, Thành phố Đà Nẵng'
         WHEN (ROW_NUMBER() OVER (ORDER BY idDV) % 5) = 3 THEN N'THPT Nguyễn Huệ, Thành phố Huế'
         WHEN (ROW_NUMBER() OVER (ORDER BY idDV) % 5) = 4 THEN N'THPT Trần Phú, Thành phố Đà Nẵng'
         ELSE N'THPT Phan Bội Châu, Quảng Ngãi'
       END
FROM DoanVien;
GO

-- 4.1 Chèn Lịch sử chuyển chi đoàn (từ THCS → THPT → ĐH)
INSERT INTO LichSuChuyenChiDoan (idLichSu, idSoDoan, tuDonVi, denDonVi, ngayBatDau, ngayKetThu, lyDo) VALUES
-- Nhóm 1-4: Từ THPT Việt Đức sang ĐH Sư phạm Kỹ thuật (Chi đoàn 23T1)
('LS001', 'SD001', N'Chi đoàn THPT Việt Đức', N'Chi đoàn 23T1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS002', 'SD002', N'Chi đoàn THPT Việt Đức', N'Chi đoàn 23T1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS003', 'SD003', N'Chi đoàn THPT Việt Đức', N'Chi đoàn 23T1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS004', 'SD004', N'Chi đoàn THPT Việt Đức', N'Chi đoàn 23T1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
-- Nhóm 5-8: Từ THPT Lê Quý Đôn sang ĐH Sư phạm Kỹ thuật (Chi đoàn 23T2)
('LS005', 'SD005', N'Chi đoàn THPT Lê Quý Đôn', N'Chi đoàn 23T2 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS006', 'SD006', N'Chi đoàn THPT Lê Quý Đôn', N'Chi đoàn 23T2 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS007', 'SD007', N'Chi đoàn THPT Lê Quý Đôn', N'Chi đoàn 23T2 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS008', 'SD008', N'Chi đoàn THPT Lê Quý Đôn', N'Chi đoàn 23T2 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
-- Nhóm 9-12: Từ THPT Nguyễn Huệ sang ĐH Sư phạm Kỹ thuật (Chi đoàn 23D1)
('LS009', 'SD009', N'Chi đoàn THPT Nguyễn Huệ', N'Chi đoàn 23D1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS010', 'SD010', N'Chi đoàn THPT Nguyễn Huệ', N'Chi đoàn 23D1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS011', 'SD011', N'Chi đoàn THPT Nguyễn Huệ', N'Chi đoàn 23D1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS012', 'SD012', N'Chi đoàn THPT Nguyễn Huệ', N'Chi đoàn 23D1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
-- Nhóm 13-16: Từ THPT Trần Phú sang ĐH Sư phạm Kỹ thuật (Chi đoàn 23D2)
('LS013', 'SD013', N'Chi đoàn THPT Trần Phú', N'Chi đoàn 23D2 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS014', 'SD014', N'Chi đoàn THPT Trần Phú', N'Chi đoàn 23D2 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS015', 'SD015', N'Chi đoàn THPT Trần Phú', N'Chi đoàn 23D2 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS016', 'SD016', N'Chi đoàn THPT Trần Phú', N'Chi đoàn 23D2 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
-- Nhóm 17-20: Từ THPT Phan Bội Châu sang ĐH Sư phạm Kỹ thuật (Chi đoàn 23SP1)
('LS017', 'SD017', N'Chi đoàn THPT Phan Bội Châu', N'Chi đoàn 23SP1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS018', 'SD018', N'Chi đoàn THPT Phan Bội Châu', N'Chi đoàn 23SP1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS019', 'SD019', N'Chi đoàn THPT Phan Bội Châu', N'Chi đoàn 23SP1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS020', 'SD020', N'Chi đoàn THPT Phan Bội Châu', N'Chi đoàn 23SP1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
-- Nhóm 21-24: Từ THPT Việt Đức sang ĐH Sư phạm Kỹ thuật (Chi đoàn 23CK1)
('LS021', 'SD021', N'Chi đoàn THPT Việt Đức', N'Chi đoàn 23CK1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS022', 'SD022', N'Chi đoàn THPT Việt Đức', N'Chi đoàn 23CK1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS023', 'SD023', N'Chi đoàn THPT Việt Đức', N'Chi đoàn 23CK1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS024', 'SD024', N'Chi đoàn THPT Việt Đức', N'Chi đoàn 23CK1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
-- Nhóm 25-28: Từ THPT Lê Quý Đôn sang ĐH Sư phạm Kỹ thuật (Chi đoàn 23XD1)
('LS025', 'SD025', N'Chi đoàn THPT Lê Quý Đôn', N'Chi đoàn 23XD1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS026', 'SD026', N'Chi đoàn THPT Lê Quý Đôn', N'Chi đoàn 23XD1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS027', 'SD027', N'Chi đoàn THPT Lê Quý Đôn', N'Chi đoàn 23XD1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS028', 'SD028', N'Chi đoàn THPT Lê Quý Đôn', N'Chi đoàn 23XD1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
-- Nhóm 29-32: Từ THPT Nguyễn Huệ sang ĐH Sư phạm Kỹ thuật (Chi đoàn 23HH1)
('LS029', 'SD029', N'Chi đoàn THPT Nguyễn Huệ', N'Chi đoàn 23HH1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS030', 'SD030', N'Chi đoàn THPT Nguyễn Huệ', N'Chi đoàn 23HH1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS031', 'SD031', N'Chi đoàn THPT Nguyễn Huệ', N'Chi đoàn 23HH1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS032', 'SD032', N'Chi đoàn THPT Nguyễn Huệ', N'Chi đoàn 23HH1 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
-- Nhóm 33-36: Từ THPT Trần Phú sang ĐH Sư phạm Kỹ thuật (Chi đoàn 23T3)
('LS033', 'SD033', N'Chi đoàn THPT Trần Phú', N'Chi đoàn 23T3 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS034', 'SD034', N'Chi đoàn THPT Trần Phú', N'Chi đoàn 23T3 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS035', 'SD035', N'Chi đoàn THPT Trần Phú', N'Chi đoàn 23T3 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS036', 'SD036', N'Chi đoàn THPT Trần Phú', N'Chi đoàn 23T3 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
-- Nhóm 37-40: Từ THPT Phan Bội Châu sang ĐH Sư phạm Kỹ thuật (Chi đoàn 23D3)
('LS037', 'SD037', N'Chi đoàn THPT Phan Bội Châu', N'Chi đoàn 23D3 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS038', 'SD038', N'Chi đoàn THPT Phan Bội Châu', N'Chi đoàn 23D3 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS039', 'SD039', N'Chi đoàn THPT Phan Bội Châu', N'Chi đoàn 23D3 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH'),
('LS040', 'SD040', N'Chi đoàn THPT Phan Bội Châu', N'Chi đoàn 23D3 - ĐH Sư phạm Kỹ thuật', '2021-09-01', '2023-06-30', N'Tốt nghiệp THPT, nhập học ĐH');
GO

-- 5. Chèn Mức đoàn phí
INSERT INTO MucDoanPhi (idMucDP, namHoc, soTien, trangThai) VALUES
('MDP001', '2021-2022', 50000, N'Đã áp dụng'),
('MDP002', '2022-2023', 55000, N'Đã áp dụng'),
('MDP003', '2023-2024', 60000, N'Đã áp dụng'),
('MDP004', '2024-2025', 65000, N'Đang áp dụng');
GO

-- 6. Chèn Hoạt động đoàn (Hơn 20 hoạt động)
-- soLuongDaDK được tính từ số lượng bản ghi "Đã duyệt" trong bảng DoanVienDangKi
INSERT INTO HoatDongDoan (idHD, tenHD, moTa, ngayToChuc, diaDiem, soLuongMax, soLuongDaDK, trangThai, trangThaiHD, donViToChuc, diemHD, idKhoa, idChiDoan) VALUES
-- Đoàn trường
('HD001', N'Mùa hè xanh 2024', N'Tình nguyện tại Thành phố Đà Nẵng', '2026-07-15', N'Nam Trà My', 100, 3, N'Đang mở', N'Đã duyệt', N'Đoàn Trường', 10, NULL, NULL),
('HD002', N'Hiến máu nhân đạo đợt 1', N'Giọt hồng UTE', '2026-05-20', N'Hội trường A', 200, 0, N'Đã đóng', N'Đã kết thúc', N'Đoàn Trường', 5, NULL, NULL),
('HD003', N'Tiếp sức mùa thi 2024', N'Hỗ trợ sĩ tử', '2026-06-25', N'Điểm thi UTE', 50, 0, N'Đã đóng', N'Đã kết thúc', N'Đoàn Trường', 8, NULL, NULL),
('HD004', N'Hội thảo Du học & Học bổng', N'Cơ hội vươn xa', '2026-10-30', N'Hội trường lớn', 300, 0, N'Đang mở', N'Đã duyệt', N'Đoàn Trường', 7, NULL, NULL),
('HD005', N'Ngày hội sách 2024', N'Lan tỏa văn hóa đọc', '2026-08-21', N'Sân trường', 150, 2, N'Đang mở', N'Đã duyệt', N'Đoàn Trường', 6, NULL, NULL),
('HD006', N'Workshop Kỹ năng lãnh đạo', N'Dành cho cán bộ Đoàn', '2026-11-20', N'Hội trường D', 100, 0, N'Đang mở', N'Đã duyệt', N'Đoàn Trường', 5, NULL, NULL),
('HD007', N'Giải chạy UTE Marthon', N'Rèn luyện thể chất', '2026-09-26', N'Đường ven biển', 500, 0, N'Đang mở', N'Đã duyệt', N'Đoàn Trường', 10, NULL, NULL),
('HD008', N'Tập huấn Đoàn vụ 2024', N'Kỹ năng quản lý sổ sách', '2026-08-25', N'Hội trường D', 50, 0, N'Đang mở', N'Đã duyệt', N'Đoàn Trường', 4, NULL, NULL),
-- Khoa Công nghệ Số
('HD011', N'Hackathon CNS 2024', N'Thi lập trình 24h', '2026-08-10', N'Phòng Lab Tòa E', 50, 1, N'Đang mở', N'Đã duyệt', N'Đoàn Khoa', 15, 'KHOA001', NULL),
('HD012', N'Workshop AI Tools', N'Ứng dụng AI vào học tập', '2026-09-15', N'Phòng 201-E', 100, 0, N'Chưa mở', N'Chưa duyệt', N'Đoàn Khoa', 8, 'KHOA001', NULL),
('HD013', N'Giải bóng đá CNS Cup', N'Giao lưu các chi đoàn', '2026-11-05', N'Sân bóng Hòa Xuân', 120, 0, N'Chưa mở', N'Chưa duyệt', N'Đoàn Khoa', 12, 'KHOA001', NULL),
('HD014', N'Tọa đàm Tuyển dụng IT', N'Phỏng vấn giả định', '2026-12-10', N'Hội trường B', 150, 0, N'Chưa mở', N'Chưa duyệt', N'Đoàn Khoa', 5, 'KHOA001', NULL),
('HD015', N'Workshop Photoshop & Canva', N'Kỹ năng thiết kế cơ bản', '2026-11-12', N'Phòng 403-E', 50, 0, N'Chưa mở', N'Chưa duyệt', N'Đoàn Khoa', 7, 'KHOA001', NULL),
-- Khoa Điện - Điện tử
('HD021', N'Robot Fighting 2024', N'Thi tài robot', '2026-09-20', N'Sảnh khu C', 40, 1, N'Đang mở', N'Đã duyệt', N'Đoàn Khoa', 14, 'KHOA002', NULL),
('HD022', N'Triển lãm Đồ án xuất sắc', N'Trưng bày sản phẩm', '2026-10-05', N'Khu C', 60, 0, N'Chưa mở', N'Chưa duyệt', N'Đoàn Khoa', 6, 'KHOA002', NULL),
('HD023', N'Workshop IoT căn bản', N'Thực hành ESP32', '2026-11-25', N'Phòng Lab 402', 30, 0, N'Chưa mở', N'Chưa duyệt', N'Đoàn Khoa', 10, 'KHOA002', NULL),
-- Khoa Sư phạm Công nghiệp
('HD031', N'Giáo viên tương lai', N'Thi nghiệp vụ sư phạm', '2026-11-20', N'Phòng 505', 40, 1, N'Đang mở', N'Đã duyệt', N'Đoàn Khoa', 9, 'KHOA003', NULL),
('HD032', N'Tình nguyện đêm trung thu', N'Phát quà trẻ em nghèo', '2026-09-17', N'Quận Liên Chiểu', 60, 0, N'Chưa mở', N'Chưa duyệt', N'Đoàn Khoa', 8, 'KHOA003', NULL),
-- Khoa Cơ khí
('HD041', N'Đua xe mô hình tự chế', N'Ứng dụng khí động học', '2026-12-05', N'Sân vận động', 20, 0, N'Đang mở', N'Đã duyệt', N'Đoàn Khoa', 13, 'KHOA004', NULL),
('HD042', N'Workshop AutoCAD nâng cao', N'Kỹ năng thiết kế máy', '2026-10-15', N'Xưởng Cơ khí', 35, 0, N'Chưa mở', N'Chưa duyệt', N'Đoàn Khoa', 7, 'KHOA004', NULL),
-- Chi đoàn
('HD051', N'Vệ sinh phòng học 23T1', N'Lao động tập thể', '2026-05-05', N'Phòng 301-E', 15, 0, N'Đã đóng', N'Đã kết thúc', N'Chi đoàn', 3, 'KHOA001', 'CD001'),
('HD052', N'Team Building CD001', N'Gắn kết thành viên', '2026-12-15', N'Công viên Biển Đông', 30, 0, N'Chưa mở', N'Chưa duyệt', N'Chi đoàn', 5, 'KHOA001', 'CD001'),
('HD053', N'Học nhóm Giải tích 2', N'Ôn thi cuối kỳ', '2026-06-12', N'Thư viện', 20, 0, N'Chưa mở', N'Chưa duyệt', N'Chi đoàn', 4, 'KHOA002', 'CD003'),
('HD054', N'Tham quan Bảo tàng Thành phố Đà Nẵng', N'Tìm hiểu lịch sử', '2026-11-10', N'Bảo tàng Thành phố Đà Nẵng', 30, 0, N'Chưa mở', N'Chưa duyệt', N'Chi đoàn', 6, 'KHOA002', 'CD003');
GO

-- 7. Chèn Phiếu thu đoàn phí
INSERT INTO PhieuThuDoanPhi (idPhieuThu, nguoiNop, ngayLap, tongTien, fileDinhKem, trangThai) VALUES
('PT001', 'USER01', '2023-10-15', 60000, 'receipt_01.jpg', N'Đã duyệt'),
('PT002', 'USER02', '2023-10-16', 60000, 'receipt_02.jpg', N'Đã duyệt'),
('PT003', 'USER03', '2023-10-17', 60000, 'receipt_03.jpg', N'Đã duyệt'),
('PT004', 'USER04', '2023-10-18', 60000, 'receipt_04.jpg', N'Đã duyệt'),
('PT005', 'USER05', '2024-10-01', 65000, 'receipt_05.jpg', N'Chờ duyệt'),
('PT006', 'USER06', '2024-10-02', 65000, 'receipt_06.jpg', N'Chờ duyệt'),
('PT007', 'USER17', '2024-10-03', 65000, 'receipt_17.jpg', N'Chờ duyệt'),
('PT008', 'USER21', '2024-10-04', 65000, 'receipt_21.jpg', N'Chờ duyệt'),
('PT009', 'USER25', '2024-10-05', 65000, 'receipt_25.jpg', N'Chờ duyệt'),
('PT010', 'USER10', '2024-09-20', 65000, 'receipt_10.jpg', N'Từ chối'),
('PT011', 'USER29', '2024-10-06', 65000, 'receipt_29.jpg', N'Chờ duyệt'),
('PT012', 'USER33', '2024-10-07', 65000, 'receipt_33.jpg', N'Chờ duyệt'),
('PT013', 'USER13', '2024-09-25', 65000, 'receipt_13.jpg', N'Đã duyệt');
GO

-- 8. Chèn Đoàn phí
INSERT INTO DoanPhi (idDoanPhi, idDV, trangThai, ngayDong, idPhieuThu, idMucDP) VALUES
('DP001', '23115053122201', N'Đã đóng', '2023-10-15', 'PT001', 'MDP003'),
('DP002', '23115053122202', N'Đã đóng', '2023-10-16', 'PT002', 'MDP003'),
('DP003', '23115053122203', N'Đã đóng', '2023-10-17', 'PT003', 'MDP003'),
('DP004', '23115053122204', N'Đã đóng', '2023-10-18', 'PT004', 'MDP003'),
('DP005', '23115053122205', N'Đang chờ duyệt', NULL, 'PT005', 'MDP004'),
('DP006', '23115053122206', N'Đang chờ duyệt', NULL, 'PT006', 'MDP004'),
('DP007', '23115053122217', N'Đang chờ duyệt', NULL, 'PT007', 'MDP004'),
('DP008', '23115053122221', N'Đang chờ duyệt', NULL, 'PT008', 'MDP004'),
('DP009', '23115053122225', N'Đang chờ duyệt', NULL, 'PT009', 'MDP004'),
('DP010', '23115053122210', N'Từ chối', NULL, 'PT010', 'MDP004'),
('DP011', '23115053122229', N'Đang chờ duyệt', NULL, 'PT011', 'MDP004'),
('DP012', '23115053122233', N'Đang chờ duyệt', NULL, 'PT012', 'MDP004'),
('DP013', '23115053122213', N'Đã đóng', '2024-09-25', 'PT013', 'MDP004');

-- Chèn các đoàn phí chưa đóng cho các đoàn viên còn lại
INSERT INTO DoanPhi (idDoanPhi, idDV, trangThai, ngayDong, idPhieuThu, idMucDP)
SELECT 'DP' + RIGHT('000' + CAST(ROW_NUMBER() OVER (ORDER BY dv.idDV) + 20 AS VARCHAR), 4), dv.idDV, N'Chưa đóng', NULL, NULL, 'MDP004'
FROM DoanVien dv
WHERE dv.idDV NOT IN ('23115053122201', '23115053122202', '23115053122203', '23115053122204', 
                       '23115053122205', '23115053122206', '23115053122217', '23115053122221',
                       '23115053122225', '23115053122210', '23115053122229', '23115053122233', '23115053122213');
GO

-- 9. Chèn Đăng ký hoạt động (DoanVienDangKi)
-- Chỉ đăng ký vào các hoạt động có trangThaiHD = N'Đã duyệt' (HD001, HD002, HD003, HD004, HD005, HD006, HD007, HD008, HD011, HD021, HD031, HD041, HD051)
INSERT INTO DoanVienDangKi (idDV, idHD, ngayDangKi, trangThaiDuyet, lyDoTuChoi) VALUES
-- Hoạt động HD001 (Mùa hè xanh - 2026-07-15)
('23115053122201', 'HD001', '2026-06-01', N'Đã duyệt', NULL),
('23115053122202', 'HD001', '2026-06-02', N'Đã duyệt', NULL),
('23115053122205', 'HD001', '2026-06-03', N'Đã duyệt', NULL),
('23115053122203', 'HD001', GETDATE(), N'Chờ duyệt', NULL),
('23115053122204', 'HD001', GETDATE(), N'Chờ duyệt', NULL),
('23115053122206', 'HD001', GETDATE(), N'Chờ duyệt', NULL),
-- Hoạt động HD011 (Hackathon CNS - 2026-08-10)
('23115053122201', 'HD011', '2026-07-01', N'Đã duyệt', NULL),
('23115053122202', 'HD011', '2026-07-02', N'Chờ duyệt', NULL),
('23115053122203', 'HD011', '2026-07-03', N'Chờ duyệt', NULL),
-- Hoạt động HD021 (Robot Fighting - 2026-09-20)
('23115053122209', 'HD021', '2026-08-10', N'Đã duyệt', NULL),
('23115053122210', 'HD021', '2026-08-11', N'Chờ duyệt', NULL),
-- Hoạt động HD031 (Giáo viên tương lai - 2026-11-20)
('23115053122217', 'HD031', '2026-10-01', N'Đã duyệt', NULL),
('23115053122218', 'HD031', '2026-10-02', N'Chờ duyệt', NULL),
-- Hoạt động HD005 (Ngày hội sách - 2026-08-21)
('23115053122221', 'HD005', '2026-07-10', N'Đã duyệt', NULL),
('23115053122222', 'HD005', '2026-07-11', N'Đã duyệt', NULL),
-- Hoạt động HD041 (Đua xe mô hình - 2026-12-05)
('23115053122225', 'HD041', '2026-11-20', N'Chờ duyệt', NULL),
('23115053122226', 'HD041', '2026-11-21', N'Từ chối', N'Hết số lượng đăng ký tối đa'),
-- Hoạt động HD004 (Hội thảo Du học - 2026-10-30)
('23115053122207', 'HD004', GETDATE(), N'Chờ duyệt', NULL),
('23115053122208', 'HD004', GETDATE(), N'Chờ duyệt', NULL),
-- Hoạt động HD006 (Workshop Kỹ năng - 2026-11-20)
('23115053122211', 'HD006', GETDATE(), N'Chờ duyệt', NULL),
-- Hoạt động HD007 (Giải chạy - 2026-09-26)
('23115053122213', 'HD007', GETDATE(), N'Chờ duyệt', NULL),
-- Hoạt động HD008 (Tập huấn Đoàn vụ - 2026-08-25)
('23115053122214', 'HD008', GETDATE(), N'Chờ duyệt', NULL);
