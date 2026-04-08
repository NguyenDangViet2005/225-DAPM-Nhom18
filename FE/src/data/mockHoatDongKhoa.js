/**
 * Mock data cho Đoàn Khoa
 * Ánh xạ theo ERD: HoatDongDoan, DoanVienDangKi
 * Bao gồm: hoạt động cấp khoa, đăng ký, yêu cầu từ chi đoàn, yêu cầu gửi lên đoàn trường
 */

// ─────────────────────────────────────────────────────────
//  Hoạt động cấp Khoa (donViToChuc = 'Khoa')
// ─────────────────────────────────────────────────────────
export const MOCK_HOAT_DONG_KHOA = [
  {
    idHD: 'HDK001',
    tenHD: 'Hội thảo Kỹ năng khởi nghiệp 2025',
    moTa: 'Chia sẻ kinh nghiệm khởi nghiệp từ các chuyên gia và cựu sinh viên tiêu biểu.',
    ngayToChuc: '2025-04-15T08:30:00',
    diaDiem: 'Hội trường A – Khoa CNTT',
    soLuongMax: 200,
    soLuongDaDK: 152,
    diemHD: 5,
    trangThaiHD: 'Đang mở đăng ký', // Đang mở đăng ký | Đã đóng đăng ký | Đang diễn ra | Đã kết thúc
    donViToChuc: 'Khoa',
    idKhoa: 'KHOA_CNTT',
    idChiDoan: null,
  },
  {
    idHD: 'HDK002',
    tenHD: 'Ngày hội Việc làm CNTT 2025',
    moTa: 'Kết nối sinh viên với các doanh nghiệp công nghệ hàng đầu tại TP.HCM.',
    ngayToChuc: '2025-05-20T07:00:00',
    diaDiem: 'Sân A – Trường UTE',
    soLuongMax: 500,
    soLuongDaDK: 480,
    diemHD: 10,
    trangThaiHD: 'Đang mở đăng ký',
    donViToChuc: 'Khoa',
    idKhoa: 'KHOA_CNTT',
    idChiDoan: null,
  },
  {
    idHD: 'HDK003',
    tenHD: 'Cuộc thi Lập trình UTE Hackathon',
    moTa: 'Thi lập trình 24 giờ giải quyết bài toán thực tế từ doanh nghiệp.',
    ngayToChuc: '2025-03-10T06:00:00',
    diaDiem: 'Phòng máy tính – Tòa B',
    soLuongMax: 120,
    soLuongDaDK: 120,
    diemHD: 15,
    trangThaiHD: 'Đã kết thúc',
    donViToChuc: 'Khoa',
    idKhoa: 'KHOA_CNTT',
    idChiDoan: null,
  },
  {
    idHD: 'HDK004',
    tenHD: 'Workshop Thiết kế UI/UX cơ bản',
    moTa: 'Hướng dẫn thiết kế giao diện người dùng với Figma cho sinh viên năm nhất.',
    ngayToChuc: '2025-06-05T13:30:00',
    diaDiem: 'Phòng 301 – Tòa C',
    soLuongMax: 80,
    soLuongDaDK: 30,
    diemHD: 3,
    trangThaiHD: 'Đang mở đăng ký',
    donViToChuc: 'Khoa',
    idKhoa: 'KHOA_CNTT',
    idChiDoan: null,
  },
  {
    idHD: 'HDK005',
    tenHD: 'Talkshow "Hành trình du học IT"',
    moTa: 'Chia sẻ kinh nghiệm du học và làm việc tại nước ngoài trong lĩnh vực CNTT.',
    ngayToChuc: '2025-03-28T14:00:00',
    diaDiem: 'Hội trường B',
    soLuongMax: 150,
    soLuongDaDK: 148,
    diemHD: 5,
    trangThaiHD: 'Đang diễn ra',
    donViToChuc: 'Khoa',
    idKhoa: 'KHOA_CNTT',
    idChiDoan: null,
  },
];

// ─────────────────────────────────────────────────────────
//  Đăng ký hoạt động khoa (DoanVienDangKi)
// ─────────────────────────────────────────────────────────
export const MOCK_DANG_KY_HOAT_DONG_KHOA = [
  {
    idDV: '23110001',
    hoTen: 'Nguyễn Văn An',
    idHD: 'HDK001',
    tenHD: 'Hội thảo Kỹ năng khởi nghiệp 2025',
    ngayDangKi: '2025-04-01T09:00:00',
    trangThaiDuyet: 'Chờ duyệt', // Chờ duyệt | Đã duyệt | Từ chối
    lyDoTuChoi: null,
  },
  {
    idDV: '23110002',
    hoTen: 'Trần Thị Bích',
    idHD: 'HDK001',
    tenHD: 'Hội thảo Kỹ năng khởi nghiệp 2025',
    ngayDangKi: '2025-04-02T10:30:00',
    trangThaiDuyet: 'Đã duyệt',
    lyDoTuChoi: null,
  },
  {
    idDV: '23110003',
    hoTen: 'Lê Minh Cường',
    idHD: 'HDK001',
    tenHD: 'Hội thảo Kỹ năng khởi nghiệp 2025',
    ngayDangKi: '2025-04-03T08:15:00',
    trangThaiDuyet: 'Chờ duyệt',
    lyDoTuChoi: null,
  },
  {
    idDV: '23110004',
    hoTen: 'Phạm Thị Dung',
    idHD: 'HDK002',
    tenHD: 'Ngày hội Việc làm CNTT 2025',
    ngayDangKi: '2025-05-01T14:00:00',
    trangThaiDuyet: 'Đã duyệt',
    lyDoTuChoi: null,
  },
  {
    idDV: '23110005',
    hoTen: 'Hoàng Văn Em',
    idHD: 'HDK002',
    tenHD: 'Ngày hội Việc làm CNTT 2025',
    ngayDangKi: '2025-05-02T11:00:00',
    trangThaiDuyet: 'Từ chối',
    lyDoTuChoi: 'Sinh viên không đủ điều kiện tham gia (chưa hoàn thành học phần bắt buộc).',
  },
  {
    idDV: '23110006',
    hoTen: 'Vũ Thị Phương',
    idHD: 'HDK003',
    tenHD: 'Cuộc thi Lập trình UTE Hackathon',
    ngayDangKi: '2025-02-20T09:00:00',
    trangThaiDuyet: 'Đã duyệt',
    lyDoTuChoi: null,
  },
  {
    idDV: '23110007',
    hoTen: 'Đặng Quốc Hùng',
    idHD: 'HDK003',
    tenHD: 'Cuộc thi Lập trình UTE Hackathon',
    ngayDangKi: '2025-02-21T10:00:00',
    trangThaiDuyet: 'Đã duyệt',
    lyDoTuChoi: null,
  },
  {
    idDV: '23110008',
    hoTen: 'Ngô Thị Lan',
    idHD: 'HDK005',
    tenHD: 'Talkshow "Hành trình du học IT"',
    ngayDangKi: '2025-03-15T08:00:00',
    trangThaiDuyet: 'Chờ duyệt',
    lyDoTuChoi: null,
  },
];

// ─────────────────────────────────────────────────────────
//  Yêu cầu mở hoạt động từ Chi đoàn (gửi lên Đoàn Khoa)
// ─────────────────────────────────────────────────────────
export const MOCK_YEU_CAU_TU_CHI_DOAN = [
  {
    idYC: 'YCCD001',
    tenHD: 'Đêm văn nghệ chào tân sinh viên – Lớp 23CNTT1',
    donViYeuCau: 'Chi đoàn 23CNTT1',
    nguoiGui: 'Nguyễn Bí Thư',
    ngayGui: '2025-03-10T09:00:00',
    ngayDuKien: '2025-04-20T18:00:00',
    diaDiemDuKien: 'Sân khấu ngoài trời – Khu A',
    moTa: 'Tổ chức đêm văn nghệ giao lưu giữa các lớp trong khoa, chào đón tân sinh viên.',
    trangThaiYC: 'Chờ duyệt', // Chờ duyệt | Đã duyệt | Từ chối
    lyDoTuChoi: null,
  },
  {
    idYC: 'YCCD002',
    tenHD: 'Tham quan thực tế doanh nghiệp – Lớp 22CNTT3',
    donViYeuCau: 'Chi đoàn 22CNTT3',
    nguoiGui: 'Trần Bí Thư',
    ngayGui: '2025-03-12T14:00:00',
    ngayDuKien: '2025-04-25T07:00:00',
    diaDiemDuKien: 'Công ty FPT Software – Quận 9',
    moTa: 'Tham quan thực tế tại FPT Software, tìm hiểu quy trình phát triển phần mềm.',
    trangThaiYC: 'Đã duyệt',
    lyDoTuChoi: null,
  },
  {
    idYC: 'YCCD003',
    tenHD: 'Giải bóng đá mini khoa CNTT – Lớp 21CNTT2',
    donViYeuCau: 'Chi đoàn 21CNTT2',
    nguoiGui: 'Lê Bí Thư',
    ngayGui: '2025-03-18T10:00:00',
    ngayDuKien: '2025-05-10T14:00:00',
    diaDiemDuKien: 'Sân bóng mini – Khu thể thao UTE',
    moTa: 'Giải bóng đá giao hữu giữa các chi đoàn trong khoa, tăng cường tinh thần đoàn kết.',
    trangThaiYC: 'Chờ duyệt',
    lyDoTuChoi: null,
  },
  {
    idYC: 'YCCD004',
    tenHD: 'Buổi học kỹ năng mềm – Lớp 23CNTT4',
    donViYeuCau: 'Chi đoàn 23CNTT4',
    nguoiGui: 'Phạm Bí Thư',
    ngayGui: '2025-03-20T08:30:00',
    ngayDuKien: '2025-04-30T08:00:00',
    diaDiemDuKien: 'Phòng 205 – Tòa B',
    moTa: 'Buổi học kỹ năng thuyết trình, làm việc nhóm và quản lý thời gian cho sinh viên năm nhất.',
    trangThaiYC: 'Từ chối',
    lyDoTuChoi: 'Trùng lịch với hoạt động cấp khoa đã được lên kế hoạch.',
  },
];

// ─────────────────────────────────────────────────────────
//  Yêu cầu Đoàn Khoa gửi lên Đoàn Trường
// ─────────────────────────────────────────────────────────
export const MOCK_YEU_CAU_GUI_LEN_TRUONG = [
  {
    idYC: 'YCKT001',
    tenHD: 'Hội trại 26/03 – Khoa CNTT',
    ngayGui: '2025-02-15T10:00:00',
    ngayDuKien: '2025-03-24T07:00:00',
    diaDiemDuKien: 'Sân bóng trường UTE',
    moTa: 'Tổ chức các gian hàng trò chơi dân gian và đêm nhạc chủ đề Đoàn nhân dịp 26/03.',
    soLuongDuKien: 300,
    trangThaiYC: 'Đã duyệt', // Chờ duyệt | Đã duyệt | Từ chối
    lyDoTuChoi: null,
    nguoiGui: 'Bí thư Liên chi đoàn CNTT',
  },
  {
    idYC: 'YCKT002',
    tenHD: 'Workshop AI & Future Career – Khoa CNTT',
    ngayGui: '2025-03-01T15:30:00',
    ngayDuKien: '2025-04-10T08:00:00',
    diaDiemDuKien: 'Hội trường A',
    moTa: 'Tư vấn hướng nghiệp cho sinh viên trong kỷ nguyên AI, mời chuyên gia từ Google và VNG.',
    soLuongDuKien: 400,
    trangThaiYC: 'Chờ duyệt',
    lyDoTuChoi: null,
    nguoiGui: 'Bí thư Liên chi đoàn CNTT',
  },
  {
    idYC: 'YCKT003',
    tenHD: 'Ngày hội Hiến máu nhân đạo – Khoa CNTT',
    ngayGui: '2025-03-05T08:00:00',
    ngayDuKien: '2025-05-15T07:00:00',
    diaDiemDuKien: 'Sảnh tòa A',
    moTa: 'Phối hợp với Hội Chữ thập đỏ tổ chức ngày hội hiến máu tình nguyện.',
    soLuongDuKien: 200,
    trangThaiYC: 'Từ chối',
    lyDoTuChoi: 'Đoàn trường đã tổ chức sự kiện tương tự ở cấp trường trong cùng thời điểm.',
    nguoiGui: 'Bí thư Liên chi đoàn CNTT',
  },
];

// ─────────────────────────────────────────────────────────
//  Thống kê tổng hợp cho Dashboard & Báo cáo
// ─────────────────────────────────────────────────────────
export const ACTIVITY_STATS_KHOA = {
  tongHoatDong: 5,
  dangMo: 3,
  dangDienRa: 1,
  daKetThuc: 1,
  choDuyetDK: MOCK_DANG_KY_HOAT_DONG_KHOA.filter(r => r.trangThaiDuyet === 'Chờ duyệt').length,
  yeuCauChiDoanMoi: MOCK_YEU_CAU_TU_CHI_DOAN.filter(yc => yc.trangThaiYC === 'Chờ duyệt').length,
  tongDiemDaCap: 33, // tổng điểm từ các hoạt động đã kết thúc
  tongDoanVienThamGia: 268,
};
