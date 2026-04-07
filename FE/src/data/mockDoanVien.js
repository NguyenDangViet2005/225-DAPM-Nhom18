/**
 * Mock data cho Đoàn viên (self-service portal)
 * Ánh xạ theo ERD: DoanVien, SoDoan, DoanPhi, HoatDongDoan, DoanVienDangKi
 */

// Thông tin cá nhân đoàn viên đang đăng nhập
export const MOCK_PROFILE = {
  idDV: '23110245',
  hoTen: 'Nguyễn Thị Khánh Ly',
  ngaySinh: '2005-05-20',
  gioiTinh: 'Nam',
  SDT: '0901234567',
  email: 'viet.nguyen@student.hcmute.edu.vn',
  diaChi: '123 Đường Lê Văn Việt, Quận 9, TP.HCM',
  idChiDoan: '23110CL1A',
  tenChiDoan: 'Công nghệ thông tin 01',
  khoa: 'Công nghệ thông tin',
  ngayVaoDoan: '2023-09-01',
  chucVu: 'Đoàn viên',
  trangThaiSH: 'Đang hoạt động',
  diemHD: 42,
};

// Sổ đoàn của đoàn viên
export const MOCK_MY_SO_DOAN = {
  idSoDoan: 'SD23110245',
  idDV: '23110245',
  ngayCap: '2023-10-15',
  noiCap: 'Đoàn trường ĐH SPKT TP.HCM',
  trangThai: 'Đang lưu giữ', // Đang lưu giữ | Đã rút | Thất lạc
  ngayRutSo: null,
  ghiChu: 'Hồ sơ đầy đủ',
};

// Lịch sử đóng đoàn phí
export const MOCK_MY_DOAN_PHI = [
  {
    idDoanPhi: 'DP001',
    namHoc: '2024-2025',
    soTien: 60000,
    ngayDong: '2024-10-20',
    idPhieuThu: 'PT01',
    trangThai: 'Đã đóng',
  },
  {
    idDoanPhi: 'DP_2023',
    namHoc: '2023-2024',
    soTien: 50000,
    ngayDong: '2023-11-05',
    idPhieuThu: 'PT_2023',
    trangThai: 'Đã đóng',
  },
  {
    idDoanPhi: 'DP_2022',
    namHoc: '2022-2023',
    soTien: 50000,
    ngayDong: null,
    idPhieuThu: null,
    trangThai: 'Chưa đóng',
  },
];

// Danh sách hoạt động có thể đăng ký
export const MOCK_AVAILABLE_HOAT_DONG = [
  {
    idHD: 'HD002',
    tenHD: 'Hội thảo Kỹ năng khởi nghiệp',
    moTa: 'Chia sẻ kinh nghiệm khởi nghiệp từ các chuyên gia hàng đầu.',
    ngayToChuc: '2026-05-15T08:30:00',
    diaDiem: 'Hội trường A',
    soLuongMax: 200,
    soLuongDaDK: 150,
    diemHD: 5,
    trangThaiHD: 'Đang mở đăng ký',
    donViToChuc: 'Khoa Công nghệ thông tin',
    daDangKy: false,
  },
  {
    idHD: 'HD004',
    tenHD: 'Giải bóng đá Nam sinh viên UTE',
    moTa: 'Giải bóng đá truyền thống hằng năm của trường.',
    ngayToChuc: '2026-06-20T14:00:00',
    diaDiem: 'Sân bóng UTE',
    soLuongMax: 320,
    soLuongDaDK: 50,
    diemHD: 10,
    trangThaiHD: 'Đang mở đăng ký',
    donViToChuc: 'Hội sinh viên',
    daDangKy: false,
  },
  {
    idHD: 'HD005',
    tenHD: 'Ngày hội Hiến máu nhân đạo 2026',
    moTa: 'Hiến máu tình nguyện – Một giọt máu cho đi, một cuộc đời ở lại.',
    ngayToChuc: '2026-04-12T07:00:00',
    diaDiem: 'Sân trường UTE',
    soLuongMax: 500,
    soLuongDaDK: 320,
    diemHD: 8,
    trangThaiHD: 'Đang mở đăng ký',
    donViToChuc: 'Đoàn Trường',
    daDangKy: true,
  },
];

// Lịch sử đăng ký hoạt động
export const MOCK_MY_DANG_KY = [
  {
    idHD: 'HD001',
    tenHD: 'Mùa hè xanh 2024',
    ngayToChuc: '2024-07-01T07:00:00',
    diaDiem: 'Tỉnh Đắk Lắk',
    donViToChuc: 'Đoàn Trường',
    diemHD: 15,
    ngayDangKi: '2024-06-15T10:00:00',
    trangThaiDuyet: 'Đã duyệt',
    trangThaiHoanThanh: 'Đã hoàn thành',
    diemDat: 15,
  },
  {
    idHD: 'HD003',
    tenHD: 'Ngày chủ nhật xanh tháng 10',
    ngayToChuc: '2024-10-10T07:30:00',
    diaDiem: 'Khuôn viên UTE',
    donViToChuc: 'Đoàn Trường',
    diemHD: 2,
    ngayDangKi: '2024-10-01T09:00:00',
    trangThaiDuyet: 'Đã duyệt',
    trangThaiHoanThanh: 'Đã hoàn thành',
    diemDat: 2,
  },
  {
    idHD: 'HD005',
    tenHD: 'Ngày hội Hiến máu nhân đạo 2026',
    ngayToChuc: '2026-04-12T07:00:00',
    diaDiem: 'Sân trường UTE',
    donViToChuc: 'Đoàn Trường',
    diemHD: 8,
    ngayDangKi: '2026-04-01T10:00:00',
    trangThaiDuyet: 'Chờ duyệt',
    trangThaiHoanThanh: null,
    diemDat: null,
  },
  {
    idHD: 'HD006',
    tenHD: 'Workshop AI & Future Career',
    ngayToChuc: '2025-04-10T08:00:00',
    diaDiem: 'Hội trường A',
    donViToChuc: 'Khoa Sư phạm Kỹ thuật',
    diemHD: 5,
    ngayDangKi: '2025-03-20T14:00:00',
    trangThaiDuyet: 'Từ chối',
    trangThaiHoanThanh: null,
    diemDat: null,
    liDoTuChoi: 'Sinh viên không thuộc đối tượng ưu tiên.',
  },
];
