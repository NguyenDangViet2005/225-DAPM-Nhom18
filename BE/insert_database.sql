USE QuanLyDoanVien
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
INSERT INTO DoanVien (idDV, hoTen, ngaySinh, gioiTinh, SDT, email, diaChi, idChiDoan, ngayVaoDoan, trangThaiSH, diemHD, chucVu) VALUES
-- CD001 - Người 201 là Bí thư
('23115053122201', N'Nguyễn Văn An', '2005-01-15', N'Nam', '0901234501', 'an01@student.ute.udn.vn', N'Đà Nẵng', 'CD001', '2021-09-15', N'Đang sinh hoạt', 85, N'Bí thư Chi đoàn'),
('23115053122202', N'Trần Thị Bình', '2005-03-20', N'Nữ', '0901234502', 'binh02@student.ute.udn.vn', N'Đà Nẵng', 'CD001', '2021-09-15', N'Đang sinh hoạt', 90, NULL),
('23115053122203', N'Lê Hoàng Cường', '2005-05-10', N'Nam', '0901234503', 'cuong03@student.ute.udn.vn', N'Đà Nẵng', 'CD001', '2021-09-15', N'Đang sinh hoạt', 78, NULL),
('23115053122204', N'Phạm Thị Dung', '2005-07-25', N'Nữ', '0901234504', 'dung04@student.ute.udn.vn', N'Đà Nẵng', 'CD001', '2021-09-15', N'Đang sinh hoạt', 92, NULL),
-- CD002 - Người 205 là Bí thư
('23115053122205', N'Hoàng Văn Em', '2005-02-14', N'Nam', '0901234505', 'em05@student.ute.udn.vn', N'Quảng Nam', 'CD002', '2021-09-15', N'Đang sinh hoạt', 88, N'Bí thư Chi đoàn'),
('23115053122206', N'Võ Thị Phương', '2005-01-20', N'Nữ', '0901234506', 'phuong06@student.ute.udn.vn', N'Quảng Nam', 'CD002', '2022-09-15', N'Đang sinh hoạt', 86, NULL),
('23115053122207', N'Đặng Văn Giang', '2005-03-15', N'Nam', '0901234507', 'giang07@student.ute.udn.vn', N'Quảng Nam', 'CD002', '2022-09-15', N'Đang sinh hoạt', 91, NULL),
('23115053122208', N'Bùi Thị Hà', '2005-05-22', N'Nữ', '0901234508', 'ha08@student.ute.udn.vn', N'Quảng Nam', 'CD002', '2022-09-15', N'Đang sinh hoạt', 84, NULL),
-- CD003 - Người 209 là Bí thư
('23115053122209', N'Trương Văn Ích', '2005-07-30', N'Nam', '0901234509', 'ich09@student.ute.udn.vn', N'Huế', 'CD003', '2022-09-15', N'Đang sinh hoạt', 89, N'Bí thư Chi đoàn'),
('23115053122210', N'Lý Thị Kim', '2005-09-12', N'Nữ', '0901234510', 'kim10@student.ute.udn.vn', N'Huế', 'CD003', '2022-09-15', N'Đang sinh hoạt', 93, NULL),
('23115053122211', N'Phan Văn Long', '2005-01-18', N'Nam', '0901234511', 'long11@student.ute.udn.vn', N'Huế', 'CD003', '2023-09-15', N'Đang sinh hoạt', 87, NULL),
('23115053122212', N'Ngô Thị Mai', '2005-03-25', N'Nữ', '0901234512', 'mai12@student.ute.udn.vn', N'Huế', 'CD003', '2023-09-15', N'Đang sinh hoạt', 90, NULL),
-- CD004 - Người 213 là Bí thư
('23115053122213', N'Đinh Văn Nam', '2005-05-14', N'Nam', '0901234513', 'nam13@student.ute.udn.vn', N'Quảng Ngãi', 'CD004', '2023-09-15', N'Đang sinh hoạt', 82, N'Bí thư Chi đoàn'),
('23115053122214', N'Huỳnh Thị Oanh', '2005-07-20', N'Nữ', '0901234514', 'oanh14@student.ute.udn.vn', N'Quảng Ngãi', 'CD004', '2023-09-15', N'Đang sinh hoạt', 94, NULL),
('23115053122215', N'Vũ Văn Phúc', '2005-09-08', N'Nam', '0901234515', 'phuc15@student.ute.udn.vn', N'Quảng Ngãi', 'CD004', '2023-09-15', N'Đang sinh hoạt', 88, NULL),
('23115053122216', N'Dương Thị Quỳnh', '2005-01-12', N'Nữ', '0901234516', 'quynh16@student.ute.udn.vn', N'Quảng Ngãi', 'CD004', '2024-09-15', N'Đang sinh hoạt', 85, NULL),
-- CD005 - Người 217 là Bí thư
('23115053122217', N'Tô Văn Rồng', '2005-03-19', N'Nam', '0901234517', 'rong17@student.ute.udn.vn', N'Bình Định', 'CD005', '2024-09-15', N'Đang sinh hoạt', 91, N'Bí thư Chi đoàn'),
('23115053122218', N'Mai Thị Sương', '2005-05-27', N'Nữ', '0901234518', 'suong18@student.ute.udn.vn', N'Bình Định', 'CD005', '2024-09-15', N'Đang sinh hoạt', 89, NULL),
('23115053122219', N'Lâm Văn Tài', '2005-07-15', N'Nam', '0901234519', 'tai19@student.ute.udn.vn', N'Bình Định', 'CD005', '2024-09-15', N'Đang sinh hoạt', 86, NULL),
('23115053122220', N'Cao Thị Uyên', '2005-09-22', N'Nữ', '0901234520', 'uyen20@student.ute.udn.vn', N'Bình Định', 'CD005', '2024-09-15', N'Đang sinh hoạt', 92, NULL),
-- CD006 - Người 221 là Bí thư
('23115053122221', N'Đỗ Văn Vinh', '2005-02-10', N'Nam', '0901234521', 'vinh21@student.ute.udn.vn', N'Gia Lai', 'CD006', '2021-09-15', N'Đang sinh hoạt', 87, N'Bí thư Chi đoàn'),
('23115053122222', N'Hồ Thị Xuân', '2005-04-18', N'Nữ', '0901234522', 'xuan22@student.ute.udn.vn', N'Gia Lai', 'CD006', '2021-09-15', N'Đang sinh hoạt', 90, NULL),
('23115053122223', N'Trịnh Văn Yên', '2005-06-25', N'Nam', '0901234523', 'yen23@student.ute.udn.vn', N'Gia Lai', 'CD006', '2021-09-15', N'Đang sinh hoạt', 83, NULL),
('23115053122224', N'Lưu Thị Ánh', '2005-08-30', N'Nữ', '0901234524', 'anh24@student.ute.udn.vn', N'Gia Lai', 'CD006', '2021-09-15', N'Đang sinh hoạt', 95, NULL),
-- CD007 - Người 225 là Bí thư
('23115053122225', N'Kiều Văn Bảo', '2005-10-05', N'Nam', '0901234525', 'bao25@student.ute.udn.vn', N'Đắk Lắk', 'CD007', '2021-09-15', N'Đang sinh hoạt', 88, N'Bí thư Chi đoàn'),
('23115053122226', N'Ông Thị Chi', '2005-02-14', N'Nữ', '0901234526', 'chi26@student.ute.udn.vn', N'Đắk Lắk', 'CD007', '2022-09-15', N'Đang sinh hoạt', 86, NULL),
('23115053122227', N'Tạ Văn Đức', '2005-04-20', N'Nam', '0901234527', 'duc27@student.ute.udn.vn', N'Đắk Lắk', 'CD007', '2022-09-15', N'Đang sinh hoạt', 91, NULL),
('23115053122228', N'Lương Thị Ê', '2005-06-28', N'Nữ', '0901234528', 'e28@student.ute.udn.vn', N'Đắk Lắk', 'CD007', '2022-09-15', N'Đang sinh hoạt', 84, NULL),
-- CD008 - Người 229 là Bí thư
('23115053122229', N'Hà Văn Phong', '2005-08-15', N'Nam', '0901234529', 'phong29@student.ute.udn.vn', N'Ninh Thuận', 'CD008', '2022-09-15', N'Đang sinh hoạt', 89, N'Bí thư Chi đoàn'),
('23115053122230', N'Thái Thị Giang', '2005-10-22', N'Nữ', '0901234530', 'giang30@student.ute.udn.vn', N'Ninh Thuận', 'CD008', '2022-09-15', N'Đang sinh hoạt', 93, NULL),
('23115053122231', N'Quách Văn Hải', '2005-02-16', N'Nam', '0901234531', 'hai31@student.ute.udn.vn', N'Ninh Thuận', 'CD008', '2023-09-15', N'Đang sinh hoạt', 87, NULL),
('23115053122232', N'Từ Thị Ích', '2005-04-23', N'Nữ', '0901234532', 'ich32@student.ute.udn.vn', N'Ninh Thuận', 'CD008', '2023-09-15', N'Đang sinh hoạt', 90, NULL),
-- CD009 - Người 233 là Bí thư
('23115053122233', N'Ứng Văn Khang', '2005-06-30', N'Nam', '0901234533', 'khang33@student.ute.udn.vn', N'Khánh Hòa', 'CD009', '2023-09-15', N'Đang sinh hoạt', 82, N'Bí thư Chi đoàn'),
('23115053122234', N'Vương Thị Linh', '2005-08-17', N'Nữ', '0901234534', 'linh34@student.ute.udn.vn', N'Khánh Hòa', 'CD009', '2023-09-15', N'Đang sinh hoạt', 94, NULL),
('23115053122235', N'Xa Văn Minh', '2005-10-24', N'Nam', '0901234535', 'minh35@student.ute.udn.vn', N'Khánh Hòa', 'CD009', '2023-09-15', N'Đang sinh hoạt', 88, NULL),
('23115053122236', N'Yên Thị Nga', '2005-03-11', N'Nữ', '0901234536', 'nga36@student.ute.udn.vn', N'Khánh Hòa', 'CD009', '2022-09-15', N'Đang sinh hoạt', 85, NULL),
-- CD010 - Người 237 là Bí thư
('23115053122237', N'Gia Văn Oanh', '2005-05-19', N'Nam', '0901234537', 'oanh37@student.ute.udn.vn', N'Đà Lạt', 'CD010', '2022-09-15', N'Đang sinh hoạt', 91, N'Bí thư Chi đoàn'),
('23115053122238', N'Âu Thị Phượng', '2005-07-26', N'Nữ', '0901234538', 'phuong38@student.ute.udn.vn', N'Đà Lạt', 'CD010', '2022-09-15', N'Đang sinh hoạt', 89, NULL),
('23115053122239', N'Ê Văn Quang', '2005-09-13', N'Nam', '0901234539', 'quang39@student.ute.udn.vn', N'Đà Lạt', 'CD010', '2022-09-15', N'Đang sinh hoạt', 86, NULL),
('23115053122240', N'Ô Thị Rạng', '2005-11-20', N'Nữ', '0901234540', 'rang40@student.ute.udn.vn', N'Đà Lạt', 'CD010', '2022-09-15', N'Đang sinh hoạt', 92, NULL);
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

-- 4. Chèn Sổ đoàn & Tiểu sử
INSERT INTO SoDoan (idSoDoan, idDV, ngayCap, noiCap, trangThai)
SELECT 'SD' + RIGHT('00' + CAST(ROW_NUMBER() OVER (ORDER BY idDV) AS VARCHAR), 3), idDV, '2023-09-01', N'Đoàn Trường ĐH Sư phạm Kỹ thuật', N'Đang hoạt động'
FROM DoanVien;

INSERT INTO TieuSu (idTieuSu, idDV, tuThoiGian, denThoiGian, donViCongTac, chucVuCu)
SELECT 'TS' + RIGHT('00' + CAST(ROW_NUMBER() OVER (ORDER BY idDV) AS VARCHAR), 3), idDV, '2021-09-01', '2023-06-30', N'THPT Việt Đức', N'Đoàn viên'
FROM DoanVien;
GO

-- 5. Chèn Mức đoàn phí
INSERT INTO MucDoanPhi (idMucDP, namHoc, soTien, trangThai) VALUES
('MDP001', '2021-2022', 50000, N'Đã áp dụng'),
('MDP002', '2022-2023', 55000, N'Đã áp dụng'),
('MDP003', '2023-2024', 60000, N'Đã áp dụng'),
('MDP004', '2024-2025', 65000, N'Đang áp dụng');
GO

-- 6. Chèn Hoạt động đoàn (Hơn 20 hoạt động)
INSERT INTO HoatDongDoan (idHD, tenHD, moTa, ngayToChuc, diaDiem, soLuongMax, soLuongDaDK, trangThai, trangThaiHD, donViToChuc, diemHD, idKhoa, idChiDoan) VALUES
-- Đoàn trường
('HD001', N'Mùa hè xanh 2024', N'Tình nguyện tại Quảng Nam', '2024-07-15', N'Nam Trà My', 100, 85, N'Đang mở', N'Đã duyệt', N'Đoàn Trường', 10, NULL, NULL),
('HD002', N'Hiến máu nhân đạo đợt 1', N'Giọt hồng UTE', '2024-05-20', N'Hội trường A', 200, 150, N'Đã đóng', N'Đã duyệt', N'Đoàn Trường', 5, NULL, NULL),
('HD003', N'Tiếp sức mùa thi 2024', N'Hỗ trợ sĩ tử', '2024-06-25', N'Điểm thi UTE', 50, 50, N'Đã đóng', N'Đã duyệt', N'Đoàn Trường', 8, NULL, NULL),
('HD004', N'Hội thảo Du học & Học bổng', N'Cơ hội vươn xa', '2024-10-30', N'Hội trường lớn', 300, 0, N'Đang mở', N'Chưa duyệt', N'Đoàn Trường', 7, NULL, NULL),
('HD005', N'Ngày hội sách 2024', N'Lan tỏa văn hóa đọc', '2024-04-21', N'Sân trường', 150, 150, N'Đã đóng', N'Đã duyệt', N'Đoàn Trường', 6, NULL, NULL),
('HD006', N'Workshop Kỹ năng lãnh đạo', N'Dành cho cán bộ Đoàn', '2024-11-20', N'Hội trường D', 100, 0, N'Đang mở', N'Chưa duyệt', N'Đoàn Trường', 5, NULL, NULL),
('HD007', N'Giải chạy UTE Marthon', N'Rèn luyện thể chất', '2024-09-26', N'Đường ven biển', 500, 0, N'Đang mở', N'Chưa duyệt', N'Đoàn Trường', 10, NULL, NULL),
('HD008', N'Tập huấn Đoàn vụ 2024', N'Kỹ năng quản lý sổ sách', '2024-08-25', N'Hội trường D', 50, 0, N'Đang mở', N'Chưa duyệt', N'Đoàn Trường', 4, NULL, NULL),
-- Khoa Công nghệ Số
('HD011', N'Hackathon CNS 2024', N'Thi lập trình 24h', '2024-08-10', N'Phòng Lab Tòa E', 50, 0, N'Đang mở', N'Đã duyệt', N'Đoàn Khoa', 15, 'KHOA001', NULL),
('HD012', N'Workshop AI Tools', N'Ứng dụng AI vào học tập', '2024-09-15', N'Phòng 201-E', 100, 0, N'Đang mở', N'Chưa duyệt', N'Đoàn Khoa', 8, 'KHOA001', NULL),
('HD013', N'Giải bóng đá CNS Cup', N'Giao lưu các chi đoàn', '2024-11-05', N'Sân bóng Hòa Xuân', 120, 0, N'Đang mở', N'Chưa duyệt', N'Đoàn Khoa', 12, 'KHOA001', NULL),
('HD014', N'Tọa đàm Tuyển dụng IT', N'Phỏng vấn giả định', '2024-12-10', N'Hội trường B', 150, 0, N'Đang mở', N'Chưa duyệt', N'Đoàn Khoa', 5, 'KHOA001', NULL),
('HD015', N'Workshop Photoshop & Canva', N'Kỹ năng thiết kế cơ bản', '2024-11-12', N'Phòng 403-E', 50, 0, N'Đang mở', N'Chưa duyệt', N'Đoàn Khoa', 7, 'KHOA001', NULL),
-- Khoa Điện - Điện tử
('HD021', N'Robot Fighting 2024', N'Thi tài robot', '2024-09-20', N'Sảnh khu C', 40, 0, N'Đang mở', N'Đã duyệt', N'Đoàn Khoa', 14, 'KHOA002', NULL),
('HD022', N'Triển lãm Đồ án xuất sắc', N'Trưng bày sản phẩm', '2024-10-05', N'Khu C', 60, 0, N'Đang mở', N'Chưa duyệt', N'Đoàn Khoa', 6, 'KHOA002', NULL),
('HD023', N'Workshop IoT căn bản', N'Thực hành ESP32', '2024-11-25', N'Phòng Lab 402', 30, 0, N'Đang mở', N'Chưa duyệt', N'Đoàn Khoa', 10, 'KHOA002', NULL),
-- Khoa Sư phạm Công nghiệp
('HD031', N'Giáo viên tương lai', N'Thi nghiệp vụ sư phạm', '2024-11-20', N'Phòng 505', 40, 0, N'Đang mở', N'Đã duyệt', N'Đoàn Khoa', 9, 'KHOA003', NULL),
('HD032', N'Tình nguyện đêm trung thu', N'Phát quà trẻ em nghèo', '2024-09-17', N'Quận Liên Chiểu', 60, 0, N'Đang mở', N'Chưa duyệt', N'Đoàn Khoa', 8, 'KHOA003', NULL),
-- Khoa Cơ khí
('HD041', N'Đua xe mô hình tự chế', N'Ứng dụng khí động học', '2024-12-05', N'Sân vận động', 20, 0, N'Đang mở', N'Đã duyệt', N'Đoàn Khoa', 13, 'KHOA004', NULL),
('HD042', N'Workshop AutoCAD nâng cao', N'Kỹ năng thiết kế máy', '2024-10-15', N'Xưởng Cơ khí', 35, 0, N'Đang mở', N'Chưa duyệt', N'Đoàn Khoa', 7, 'KHOA004', NULL),
-- Chi đoàn
('HD051', N'Vệ sinh phòng học 23T1', N'Lao động tập thể', '2024-05-05', N'Phòng 301-E', 15, 15, N'Đã đóng', N'Đã duyệt', N'Chi đoàn', 3, 'KHOA001', 'CD001'),
('HD052', N'Team Building CD001', N'Gắn kết thành viên', '2024-12-15', N'Công viên Biển Đông', 30, 0, N'Đang mở', N'Chưa duyệt', N'Chi đoàn', 5, 'KHOA001', 'CD001'),
('HD053', N'Học nhóm Giải tích 2', N'Ôn thi cuối kỳ', '2024-06-12', N'Thư viện', 20, 0, N'Đang mở', N'Chưa duyệt', N'Chi đoàn', 4, 'KHOA002', 'CD003'),
('HD054', N'Tham quan Bảo tàng Đà Nẵng', N'Tìm hiểu lịch sử', '2024-11-10', N'Bảo tàng ĐN', 30, 0, N'Đang mở', N'Chưa duyệt', N'Chi đoàn', 6, 'KHOA002', 'CD003');
GO

-- 7. Chèn Phiếu thu đoàn phí
INSERT INTO PhieuThuDoanPhi (idPhieuThu, nguoiNop, fileDinhKem, trangThai) VALUES
('PT001', 'USER01', 'receipt_01.jpg', N'Đã duyệt'),
('PT002', 'USER02', 'receipt_02.jpg', N'Đã duyệt'),
('PT003', 'USER03', 'receipt_03.jpg', N'Đã duyệt'),
('PT004', 'USER04', 'receipt_04.jpg', N'Đã duyệt'),
('PT005', 'USER05', 'receipt_05.jpg', N'Chờ duyệt'),
('PT006', 'USER06', 'receipt_06.jpg', N'Chờ duyệt'),
('PT007', 'USER17', 'receipt_17.jpg', N'Chờ duyệt'),
('PT008', 'USER21', 'receipt_21.jpg', N'Chờ duyệt'),
('PT009', 'USER25', 'receipt_25.jpg', N'Chờ duyệt'),
('PT010', 'USER10', 'receipt_10.jpg', N'Từ chối'),
('PT011', 'USER29', 'receipt_29.jpg', N'Chờ duyệt'),
('PT012', 'USER33', 'receipt_33.jpg', N'Chờ duyệt'),
('PT013', 'USER13', 'receipt_13.jpg', N'Đã duyệt');
GO

-- 8. Chèn Đoàn phí
INSERT INTO DoanPhi (idDoanPhi, idDV, trangThai, ngayDong, idPhieuThu, idMucDP) VALUES
('DP001', '23115053122201', N'Đã đóng', '2023-10-15', 'PT001', 'MDP003'),
('DP002', '23115053122202', N'Đã đóng', '2023-10-16', 'PT002', 'MDP003'),
('DP003', '23115053122203', N'Đã đóng', '2023-10-17', 'PT003', 'MDP003'),
('DP004', '23115053122204', N'Đã đóng', '2023-10-18', 'PT004', 'MDP003');

INSERT INTO DoanPhi (idDoanPhi, idDV, trangThai, ngayDong, idPhieuThu, idMucDP)
SELECT 'DP' + RIGHT('000' + CAST(ROW_NUMBER() OVER (ORDER BY idDV) + 10 AS VARCHAR), 4), idDV, N'Chưa đóng', NULL, NULL, 'MDP004'
FROM DoanVien;

UPDATE DoanPhi SET trangThai = N'Đang chờ duyệt', idPhieuThu = 'PT005' WHERE idDV = '23115053122205' AND idMucDP = 'MDP004';
UPDATE DoanPhi SET trangThai = N'Đang chờ duyệt', idPhieuThu = 'PT006' WHERE idDV = '23115053122206' AND idMucDP = 'MDP004';
UPDATE DoanPhi SET trangThai = N'Đang chờ duyệt', idPhieuThu = 'PT007' WHERE idDV = '23115053122217' AND idMucDP = 'MDP004';
UPDATE DoanPhi SET trangThai = N'Đang chờ duyệt', idPhieuThu = 'PT008' WHERE idDV = '23115053122221' AND idMucDP = 'MDP004';
GO

-- 9. Chèn Đăng ký hoạt động (DoanVienDangKi)
-- Chỉ đăng ký vào các hoạt động có trangThaiHD = N'Đã duyệt' (HD001, HD002, HD003, HD005, HD011, HD021, HD031, HD041, HD051)
INSERT INTO DoanVienDangKi (idDV, idHD, ngayDangKi, trangThaiDuyet, lyDoTuChoi) VALUES
-- Hoạt động HD001 (Mùa hè xanh)
('23115053122201', 'HD001', '2024-06-01', N'Đã duyệt', NULL),
('23115053122202', 'HD001', '2024-06-02', N'Đã duyệt', NULL),
('23115053122205', 'HD001', '2024-06-03', N'Đã duyệt', NULL),
-- Hoạt động HD011 (Hackathon CNS)
('23115053122201', 'HD011', '2024-07-01', N'Đã duyệt', NULL),
('23115053122202', 'HD011', '2024-07-02', N'Chờ duyệt', NULL),
('23115053122203', 'HD011', '2024-07-03', N'Chờ duyệt', NULL),
-- Hoạt động HD021 (Robot Fighting)
('23115053122209', 'HD021', '2024-08-10', N'Đã duyệt', NULL),
('23115053122210', 'HD021', '2024-08-11', N'Chờ duyệt', NULL),
-- Hoạt động HD031 (Giáo viên tương lai)
('23115053122217', 'HD031', '2024-10-01', N'Đã duyệt', NULL),
('23115053122218', 'HD031', '2024-10-02', N'Chờ duyệt', NULL),
-- Hoạt động HD005 (Ngày hội sách)
('23115053122221', 'HD005', '2024-04-10', N'Đã duyệt', NULL),
('23115053122222', 'HD005', '2024-04-11', N'Đã duyệt', NULL),
-- Hoạt động HD041 (Đua xe mô hình)
('23115053122225', 'HD041', '2024-11-20', N'Chờ duyệt', NULL),
('23115053122226', 'HD041', '2024-11-21', N'Từ chối', N'Hết số lượng đăng ký tối đa');
GO
