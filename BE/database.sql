USE [master]
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = N'QuanLyDoanVien')
BEGIN
    ALTER DATABASE QuanLyDoanVien SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE QuanLyDoanVien;
END
GO

CREATE DATABASE QuanLyDoanVien
GO 

USE QuanLyDoanVien
GO

CREATE TABLE Khoa (
    idKhoa CHAR(15) PRIMARY KEY,
    tenKhoa NVARCHAR(100) NOT NULL
);
GO

CREATE TABLE VaiTro (
    idVaiTro CHAR(15) PRIMARY KEY,
    tenVaiTro NVARCHAR(100) NOT NULL
);
GO

CREATE TABLE ChiDoan (
    idChiDoan CHAR(15) PRIMARY KEY,
    tenChiDoan NVARCHAR(100) NOT NULL,
    nienKhoa VARCHAR(20),
    siSo INT,
    idKhoa CHAR(15),
    CONSTRAINT FK_ChiDoan_Khoa FOREIGN KEY (idKhoa) REFERENCES Khoa(idKhoa)
);
GO

CREATE TABLE DoanVien (
    idDV CHAR(15) PRIMARY KEY, -- idDV và maSV là cùng một field
    -- Thông tin cá nhân
    hoTen NVARCHAR(100) NOT NULL,
    anhThe TEXT,
    ngaySinh DATE,
    gioiTinh NVARCHAR(10),
    CCCD VARCHAR(12),
    ngayCapCCCD DATE,
    noiCapCCCD NVARCHAR(100),
    SDT VARCHAR(11),
    email VARCHAR(50),
    diaChiThuongTru NVARCHAR(200),
    diaChiTamTru NVARCHAR(200),
    danToc NVARCHAR(50),
    tonGiao NVARCHAR(50),
    -- Thông tin sinh viên
    heDaoTao NVARCHAR(50),
    trangThaiHoc NVARCHAR(50),
    -- Thông tin Đoàn (chỉ giữ thông tin cơ bản)
    idChiDoan CHAR(15),
    chucVu NVARCHAR(100),
    -- Quá trình sinh hoạt
    diemHoatDong INT,
    CONSTRAINT FK_DoanVien_ChiDoan FOREIGN KEY (idChiDoan) REFERENCES ChiDoan(idChiDoan)
);
GO

CREATE TABLE TaiKhoan (
    idUser CHAR(15) PRIMARY KEY,
    tenNguoiDung NVARCHAR(100) NOT NULL,
    matKhau NVARCHAR(100) NOT NULL,
    trangThai BIT DEFAULT 1,
    ngayTao DATETIME, 
    idVaiTro CHAR(15),
    idDV CHAR(15),
    idKhoa CHAR(15),
    CONSTRAINT FK_TaiKhoan_VaiTro FOREIGN KEY (idVaiTro) REFERENCES VaiTro(idVaiTro),
    CONSTRAINT FK_TaiKhoan_DoanVien FOREIGN KEY (idDV) REFERENCES DoanVien(idDV),
    CONSTRAINT FK_TaiKhoan_Khoa FOREIGN KEY (idKhoa) REFERENCES Khoa(idKhoa)
);
GO


CREATE TABLE SoDoan (
    idSoDoan CHAR(15) PRIMARY KEY,
    idDV CHAR(15) UNIQUE NOT NULL,
    ngayCap DATE,
    noiCap NVARCHAR(100),
    trangThai NVARCHAR(50),
    ngayRutSo DATE,
    -- Thông tin Đoàn
    ngayVaoDoan DATE,
    noiKetNap NVARCHAR(100),
    CONSTRAINT FK_SoDoan_DoanVien FOREIGN KEY (idDV) REFERENCES DoanVien(idDV)
);
GO


-- Bảng lưu lịch sử chuyển chi đoàn
CREATE TABLE LichSuChuyenChiDoan (
    idLichSu CHAR(15) PRIMARY KEY,
    idSoDoan CHAR(15) NOT NULL,
    tuDonVi NVARCHAR(150),
    denDonVi NVARCHAR(150),
    ngayBatDau DATE,
    ngayKetThu DATE,
    lyDo NVARCHAR(200),
    CONSTRAINT FK_LichSuChuyenChiDoan_SoDoan FOREIGN KEY (idSoDoan) REFERENCES SoDoan(idSoDoan),
);
GO


CREATE TABLE HoatDongDoan (
    idHD CHAR(15) PRIMARY KEY,
    tenHD NVARCHAR(100) NOT NULL,
    moTa NVARCHAR(500),
    ngayToChuc DATETIME,
    diaDiem NVARCHAR(200),
    soLuongMax INT,
    soLuongDaDK INT,
    trangThai NVARCHAR(50),
    trangThaiHD NVARCHAR(50),
    donViToChuc NVARCHAR(50),
    diemHD INT,
    idKhoa CHAR(15),
    idChiDoan CHAR(15),
    CONSTRAINT FK_HoatDongDoan_Khoa FOREIGN KEY (idKhoa) REFERENCES Khoa(idKhoa),
    CONSTRAINT FK_HoatDongDoan_ChiDoan FOREIGN KEY (idChiDoan) REFERENCES ChiDoan(idChiDoan)
);
GO

CREATE TABLE DoanVienDangKi (
    idDV CHAR(15),
    idHD CHAR(15),
    ngayDangKi DATETIME,
    trangThaiDuyet NVARCHAR(50),
    lyDoTuChoi NVARCHAR(500), 
    PRIMARY KEY (idDV, idHD),
    CONSTRAINT FK_DoanVienDangKi_DoanVien FOREIGN KEY (idDV) REFERENCES DoanVien(idDV),
    CONSTRAINT FK_DoanVienDangKi_HoatDongDoan FOREIGN KEY (idHD) REFERENCES HoatDongDoan(idHD)
);
GO

CREATE TABLE MucDoanPhi (
    idMucDP CHAR(15) PRIMARY KEY,
    namHoc VARCHAR(10),
    soTien MONEY,
    trangThai NVARCHAR(50)
);
GO

CREATE TABLE PhieuThuDoanPhi (
    idPhieuThu CHAR(15) PRIMARY KEY,
    nguoiNop CHAR(15),
    ngayLap DATETIME,
    tongTien INT,
    fileDinhKem NVARCHAR(200),
    trangThai NVARCHAR(50),
    CONSTRAINT FK_PhieuThuDoanPhi_TaiKhoan FOREIGN KEY (nguoiNop) REFERENCES TaiKhoan(idUser)
);
GO

CREATE TABLE DoanPhi (
    idDoanPhi CHAR(15) PRIMARY KEY,
    idDV CHAR(15),
    trangThai NVARCHAR(50),
    ngayDong DATE,
    idPhieuThu CHAR(15),
    idMucDP CHAR(15),
    CONSTRAINT FK_DoanPhi_DoanVien FOREIGN KEY (idDV) REFERENCES DoanVien(idDV),
    CONSTRAINT FK_DoanPhi_MucDoanPhi FOREIGN KEY (idMucDP) REFERENCES MucDoanPhi(idMucDP),
    CONSTRAINT FK_DoanPhi_PhieuThuDoanPhi FOREIGN KEY (idPhieuThu) REFERENCES PhieuThuDoanPhi(idPhieuThu)
);
GO