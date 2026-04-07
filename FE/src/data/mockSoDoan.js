/**
 * Mock data cho Sổ Đoàn (Membership Books)
 * Ánh xạ theo ERD: SoDoan liên kết với DoanVien (1-1)
 */

export const MOCK_SO_DOAN = [
  {
    idSoDoan: 'SD23110245',
    idDV: '23110245',
    member: {
      hoTen: 'Nguyễn Đăng Việt',
      ngaySinh: '2005-05-20',
      gioiTinh: 'Nam',
      idChiDoan: '23110CL1A',
      khoa: 'CNTT',
      chucVu: 'Đoàn viên'
    },
    ngayCap: '2023-10-15',
    noiCap: 'Đoàn trường ĐH SPKT TP.HCM',
    trangThai: 'Đang lưu giữ', // Đang lưu giữ, Đã rút, Thất lạc
    ngayRutSo: null,
    ghiChu: 'Hồ sơ đầy đủ'
  },
  {
    idSoDoan: 'SD23110112',
    idDV: '23110112',
    member: {
      hoTen: 'Trần Minh Hải',
      ngaySinh: '2005-02-12',
      gioiTinh: 'Nam',
      idChiDoan: '23110CK2B',
      khoa: 'Cơ khí',
      chucVu: 'Bí thư'
    },
    ngayCap: '2023-11-02',
    noiCap: 'Đoàn trường ĐH SPKT TP.HCM',
    trangThai: 'Đang lưu giữ',
    ngayRutSo: null,
    ghiChu: ''
  },
  {
    idSoDoan: 'SD23110567',
    idDV: '23110567',
    member: {
      hoTen: 'Lê Thị Mai',
      ngaySinh: '2005-08-30',
      gioiTinh: 'Nữ',
      idChiDoan: '23110KT1C',
      khoa: 'Kinh tế',
      chucVu: 'Đoàn viên'
    },
    ngayCap: '2023-09-20',
    noiCap: 'Đoàn trường ĐH SPKT TP.HCM',
    trangThai: 'Đã rút',
    ngayRutSo: '2024-03-01',
    ghiChu: 'Chuyển sinh hoạt Đoàn về địa phương'
  },
  {
    idSoDoan: 'SD23110443',
    idDV: '23110443',
    member: {
      hoTen: 'Phạm Hoàng Nam',
      ngaySinh: '2005-11-11',
      gioiTinh: 'Nam',
      idChiDoan: '23110DT4D',
      khoa: 'Điện tử',
      chucVu: 'Đoàn viên'
    },
    ngayCap: '2023-12-05',
    noiCap: 'Đoàn trường ĐH SPKT TP.HCM',
    trangThai: 'Thất lạc',
    ngayRutSo: null,
    ghiChu: 'Đang làm thủ tục cấp lại'
  },
  {
    idSoDoan: 'SD23110999',
    idDV: '23110999',
    member: {
      hoTen: 'Hoàng Thị Lan',
      ngaySinh: '2005-04-15',
      gioiTinh: 'Nữ',
      idChiDoan: '23110NN1E',
      khoa: 'Ngoại ngữ',
      chucVu: 'Lớp phó'
    },
    ngayCap: '2023-09-10',
    noiCap: 'Đoàn trường ĐH SPKT TP.HCM',
    trangThai: 'Đang lưu giữ',
    ngayRutSo: null,
    ghiChu: ''
  }
];

export const SO_DOAN_STATS = {
  tongSo: 15420,
  dangLuuGiu: 14850,
  daRut: 450,
  thatLac: 120
};
