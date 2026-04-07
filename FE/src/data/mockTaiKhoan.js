/**
 * Mock data cho Quản lý Tài khoản (User/Accounts)
 * Bao gồm tài khoản của cán bộ Đoàn Trường, Đoàn Khoa, Lớp
 */

export const MOCK_TAI_KHOAN = [
  {
    idTK: 'user_001',
    username: 'doantruong_admin',
    hoTen: 'Nguyễn Văn Quản Trị',
    role: 'DOANTRUONG',
    donVi: 'Văn phòng Đoàn trường',
    email: 'doantruong@ute.edu.vn',
    trangThai: 'Đang hoạt động', // Đang hoạt động, Đã khóa
    ngayTao: '2023-09-01T08:00:00',
    lastLogin: '2024-04-07T12:30:00'
  },
  {
    idTK: 'user_002',
    username: 'khoa_cntt_sec',
    hoTen: 'Trần Khoa Công',
    role: 'DOANKHOA',
    donVi: 'Khoa Công nghệ thông tin',
    email: 'cntt_doan@ute.edu.vn',
    trangThai: 'Đang hoạt động',
    ngayTao: '2023-09-05T10:00:00',
    lastLogin: '2024-04-06T15:20:00'
  },
  {
    idTK: 'user_003',
    username: 'khoa_ck_sec',
    hoTen: 'Lê Cơ Khí',
    role: 'DOANKHOA',
    donVi: 'Khoa Cơ khí',
    email: 'cokhi_doan@ute.edu.vn',
    trangThai: 'Đã khóa',
    ngayTao: '2023-09-10T09:30:00',
    lastLogin: '2024-03-20T11:00:00'
  },
  {
    idTK: 'user_004',
    username: '23110245',
    hoTen: 'Nguyễn Đăng Việt',
    role: 'BITHU',
    donVi: 'Chi đoàn 231101A',
    email: '23110245@student.ute.edu.vn',
    trangThai: 'Đang hoạt động',
    ngayTao: '2023-10-01T08:00:00',
    lastLogin: '2024-04-07T07:15:00'
  },
  {
    idTK: 'user_005',
    username: 'khoa_kt_sec',
    hoTen: 'Phạm Kinh Tế',
    role: 'DOANKHOA',
    donVi: 'Khoa Kinh tế',
    email: 'kinhte_doan@ute.edu.vn',
    trangThai: 'Đang hoạt động',
    ngayTao: '2023-11-15T14:00:00',
    lastLogin: '2024-04-05T09:45:00'
  }
];

export const ACCOUNT_STATS = {
  tongTaiKhoan: 256,
  dangHoatDong: 248,
  daKhoa: 8,
  moiTrongTuan: 12
};
