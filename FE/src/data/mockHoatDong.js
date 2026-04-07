/**
 * Mock data cho Quản lý Hoạt động Đoàn
 * Ánh xạ theo ERD: HoatDongDoan, DoanVienDangKi, YeuCauHoatDong
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

export const MOCK_YEU_CAU_HOAT_DONG = [
  {
    idYC: 'YC001',
    tenHD: 'Hội trại 26/03 - Khoa CNTT',
    donViYeuCau: 'Khoa Công nghệ thông tin',
    ngayDuKien: '2024-03-24T07:00:00',
    diaDiemDuKien: 'Sân bóng trường',
    moTa: 'Tổ chức các gian hàng trò chơi dân gian và đêm nhạc chủ đề Đoàn.',
    trangThaiYC: 'Chờ duyệt', // Chờ duyệt, Đã duyệt, Từ chối
    ngayGui: '2024-02-15T10:00:00',
    nguoiGui: 'Trần Văn Khoa'
  },
  {
    idYC: 'YC002',
    tenHD: 'Workshop AI & Future Career',
    donViYeuCau: 'Khoa Sư phạm Kỹ thuật',
    ngayDuKien: '2024-04-10T08:00:00',
    diaDiemDuKien: 'Hội trường A',
    moTa: 'Tư vấn hướng nghiệp cho sinh viên sư phạm trong kỷ nguyên AI.',
    trangThaiYC: 'Chờ duyệt',
    ngayGui: '2024-03-01T15:30:00',
    nguoiGui: 'Lê Minh Sư'
  },
  {
    idYC: 'YC003',
    tenHD: 'Giải Marathon Sinh viên 2024',
    donViYeuCau: 'Khoa Cơ khí',
    ngayDuKien: '2024-05-15T06:00:00',
    diaDiemDuKien: 'Công viên bờ sông',
    moTa: 'Chạy bộ gây quỹ học bổng cho sinh viên nghèo vượt khó.',
    trangThaiYC: 'Đã duyệt',
    ngayGui: '2024-03-05T08:00:00',
    nguoiGui: 'Nguyễn Cơ Khí'
  }
];

export const ACTIVITY_STATS = {
  tongHoatDong: 12,
  dangMo: 4,
  sapDienRa: 3,
  choDuyetDK: 125,
  yeuCauMoi: 2 // Thống kê cho Yêu cầu mở hoạt động
};

// Yêu cầu hoạt động do Bí thư chi đoàn gửi lên Đoàn trường
export const MOCK_YEU_CAU_CHI_DOAN = [
  {
    idYC: 'YCCD001',
    tenHD: 'Giao lưu văn nghệ chi đoàn 23110CL1A',
    idChiDoan: '23110CL1A',
    donViYeuCau: 'Chi đoàn 23110CL1A',
    ngayDuKien: '2026-05-10T18:00:00',
    diaDiemDuKien: 'Hội trường B',
    soLuongDuKien: 42,
    moTa: 'Tổ chức đêm giao lưu văn nghệ chào mừng ngày thành lập Đoàn 26/3.',
    trangThaiYC: 'Chờ duyệt',
    ngayGui: '2026-04-05T10:00:00',
    nguoiGui: 'Nguyễn Văn Bí Thư',
  },
  {
    idYC: 'YCCD002',
    tenHD: 'Tham quan thực tế doanh nghiệp',
    idChiDoan: '23110CL1A',
    donViYeuCau: 'Chi đoàn 23110CL1A',
    ngayDuKien: '2026-05-20T07:30:00',
    diaDiemDuKien: 'Khu công nghệ cao TP.HCM',
    soLuongDuKien: 40,
    moTa: 'Tham quan thực tế tại các công ty công nghệ, giúp sinh viên định hướng nghề nghiệp.',
    trangThaiYC: 'Đã duyệt',
    ngayGui: '2026-03-20T09:00:00',
    nguoiGui: 'Nguyễn Văn Bí Thư',
  },
];
