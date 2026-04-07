/**
 * Mock data cho Quản lý Hoạt động Đoàn
 * Ánh xạ theo ERD: HoatDongDoan, DoanVienDangKi
 */

export const MOCK_HOAT_DONG = [
  {
    idHD: 'HD001',
    tenHD: 'Mùa hè xanh 2024',
    moTa: 'Chiến dịch tình nguyện hè cấp trường tại các địa bàn khó khăn.',
    ngayToChuc: '2024-07-01T07:00:00',
    diaDiem: 'Tỉnh Đắk Lắk',
    soLuongMax: 100,
    soLuongDaDK: 85,
    diemHD: 15,
    trangThaiHD: 'Đang diễn ra', // Đang mở đăng ký, Đã đóng đăng ký, Đang diễn ra, Đã kết thúc
    donViToChuc: 'Đoàn Trường',
    idKhoa: null,
    idChiDoan: null
  },
  {
    idHD: 'HD002',
    tenHD: 'Hội thảo Kỹ năng khởi nghiệp',
    moTa: 'Chia sẻ kinh nghiệm khởi nghiệp từ các chuyên gia hàng đầu.',
    ngayToChuc: '2024-11-15T08:30:00',
    diaDiem: 'Hội trường A',
    soLuongMax: 200,
    soLuongDaDK: 150,
    diemHD: 5,
    trangThaiHD: 'Đang mở đăng ký',
    donViToChuc: 'Khoa Công nghệ thông tin',
    idKhoa: 'KHOA_CNTT',
    idChiDoan: null
  },
  {
    idHD: 'HD003',
    tenHD: 'Ngày chủ nhật xanh tháng 10',
    moTa: 'Dọn dẹp vệ sinh khuôn viên trường và ký túc xá.',
    ngayToChuc: '2024-10-10T07:30:00',
    diaDiem: 'Khuôn viên UTE',
    soLuongMax: 500,
    soLuongDaDK: 480,
    diemHD: 2,
    trangThaiHD: 'Đã kết thúc',
    donViToChuc: 'Đoàn Trường',
    idKhoa: null,
    idChiDoan: null
  },
  {
    idHD: 'HD004',
    tenHD: 'Giải bóng đá Nam sinh viên UTE',
    moTa: 'Giải bóng đá truyền thống hằng năm của trường.',
    ngayToChuc: '2024-12-20T14:00:00',
    diaDiem: 'Sân bóng UTE',
    soLuongMax: 320,
    soLuongDaDK: 50,
    diemHD: 10,
    trangThaiHD: 'Đang mở đăng ký',
    donViToChuc: 'Hội sinh viên',
    idKhoa: null,
    idChiDoan: null
  }
];

export const MOCK_DANG_KY_HOAT_DONG = [
  {
    idDV: '23110245',
    hoTen: 'Nguyễn Đăng Việt',
    idHD: 'HD001',
    tenHD: 'Mùa hè xanh 2024',
    ngayDangKi: '2024-06-15T10:00:00',
    trangThaiDuyet: 'Đã duyệt', // Chờ duyệt, Đã duyệt, Từ chối
    liDoTuChoi: null
  },
  {
    idDV: '23110112',
    hoTen: 'Trần Minh Hải',
    idHD: 'HD001',
    tenHD: 'Mùa hè xanh 2024',
    ngayDangKi: '2024-06-16T14:20:00',
    trangThaiDuyet: 'Chờ duyệt',
    liDoTuChoi: null
  },
  {
    idDV: '23110567',
    hoTen: 'Lê Thị Mai',
    idHD: 'HD002',
    tenHD: 'Hội thảo Kỹ năng khởi nghiệp',
    ngayDangKi: '2024-10-20T09:00:00',
    trangThaiDuyet: 'Từ chối',
    liDoTuChoi: 'Sinh viên không thuộc đối tượng ưu tiên của hội thảo.'
  }
];

export const ACTIVITY_STATS = {
  tongHoatDong: 12,
  dangMo: 4,
  sapDienRa: 3,
  choDuyetDK: 125
};
