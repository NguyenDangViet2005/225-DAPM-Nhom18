/**
 * Mock data cho Quản lý Đoàn phí
 * Ánh xạ theo ERD: MucDoanPhi, DoanPhi, PhieuThuDoanPhi
 */

export const MOCK_MUC_DOAN_PHI = [
  {
    idMucDP: 'MDP2024',
    namHoc: '2024-2025',
    soTien: 60000,
    trangThai: 'Áp dụng' // Áp dụng, Ngưng áp dụng
  },
  {
    idMucDP: 'MDP2023',
    namHoc: '2023-2024',
    soTien: 50000,
    trangThai: 'Ngưng áp dụng'
  }
];

export const MOCK_DOAN_PHI = [
  {
    idDoanPhi: 'DP001',
    idDV: '23110245',
    hoTen: 'Nguyễn Đăng Việt',
    khoa: 'CNTT',
    idChiDoan: '23110CL1A',
    trangThai: 'Đã đóng', // Đã đóng, Chưa đóng
    ngayDong: '2024-10-20',
    idPhieuThu: 'PT01',
    idMucDP: 'MDP2024',
    soTien: 60000
  },
  {
    idDoanPhi: 'DP002',
    idDV: '23110112',
    hoTen: 'Trần Minh Hải',
    khoa: 'Cơ khí',
    idChiDoan: '23110CK2B',
    trangThai: 'Đã đóng',
    ngayDong: '2024-11-05',
    idPhieuThu: 'PT02',
    idMucDP: 'MDP2024',
    soTien: 60000
  },
  {
    idDoanPhi: 'DP003',
    idDV: '23110567',
    hoTen: 'Lê Thị Mai',
    khoa: 'Kinh tế',
    idChiDoan: '23110KT1C',
    trangThai: 'Chưa đóng',
    ngayDong: null,
    idPhieuThu: null,
    idMucDP: 'MDP2024',
    soTien: 60000
  },
  {
    idDoanPhi: 'DP004',
    idDV: '23110443',
    hoTen: 'Phạm Hoàng Nam',
    khoa: 'Điện tử',
    idChiDoan: '23110DT4D',
    trangThai: 'Chưa đóng',
    ngayDong: null,
    idPhieuThu: null,
    idMucDP: 'MDP2024',
    soTien: 60000
  }
];

export const MOCK_PHIEU_THU = [
  {
    idPhieuThu: 'PT01',
    idChiDoan: '23110CL1A',
    tenChiDoan: 'Công nghệ thông tin 01',
    nguoiNop: 'Nguyễn Văn A (Bí thư)',
    fileDinhKem: 'minh-chung-pt01.pdf',
    trangThai: 'Đã duyệt', // Chờ duyệt, Đã duyệt, Từ chối
    nguoiDuyet: 'Đoàn Trường',
    ngayNop: '2024-10-21',
    tongTien: 1800000
  },
  {
    idPhieuThu: 'PT02',
    idChiDoan: '23110CK2B',
    tenChiDoan: 'Cơ khí 02',
    nguoiNop: 'Trần Văn B (Bí thư)',
    fileDinhKem: 'minh-chung-pt02.pdf',
    trangThai: 'Chờ duyệt',
    nguoiDuyet: null,
    ngayNop: '2024-11-06',
    tongTien: 2100000
  }
];
