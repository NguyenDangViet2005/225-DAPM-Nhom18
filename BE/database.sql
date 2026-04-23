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
    idDV CHAR(15) PRIMARY KEY,
    hoTen NVARCHAR(100) NOT NULL,
    ngaySinh DATE,
    gioiTinh NVARCHAR(10),
    SDT VARCHAR(11),
    email VARCHAR(50),
    diaChi NVARCHAR(200),
    idChiDoan CHAR(15),
    ngayVaoDoan DATE,
    noiChuyenDen NVARCHAR(100),
    ngayChuyenDen DATE, 
    trangThaiSH NVARCHAR(50),
    diemHD INT,
    chucVu NVARCHAR(100),
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

-- Tạo Index unique cho idDV nhưng cho phép NHIỀU giá trị NULL (dành cho Admin/Khoa)
-- SQL Server quy định: UNIQUE constraint chỉ cho phép 1 giá trị NULL. 
-- Do đó phải dùng Filtered Index này thay thế.
CREATE UNIQUE INDEX UIX_TaiKhoan_idDV ON TaiKhoan(idDV) WHERE idDV IS NOT NULL;
GO

CREATE TABLE SoDoan (
    idSoDoan CHAR(15) PRIMARY KEY,
    idDV CHAR(15) UNIQUE NOT NULL,
    ngayCap DATE,
    noiCap NVARCHAR(100),
    trangThai NVARCHAR(50),
    ngayRutSo DATE,
    CONSTRAINT FK_SoDoan_DoanVien FOREIGN KEY (idDV) REFERENCES DoanVien(idDV)
);
GO

CREATE TABLE TieuSu (
    idTieuSu CHAR(15) PRIMARY KEY,
    idDV CHAR(15),
    tuThoiGian DATE,
    denThoiGian DATE,
    donViCongTac NVARCHAR(200),
    chucVuCu NVARCHAR(200),
    CONSTRAINT FK_TieuSu_DoanVien FOREIGN KEY (idDV) REFERENCES DoanVien(idDV)
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