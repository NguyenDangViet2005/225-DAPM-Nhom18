/**
 * Hoạt động constants - Các hằng số cho hoạt động đoàn
 */

// Trạng thái đăng ký hoạt động
export const HOAT_DONG_STATUS = {
  DANG_MO: "Đang mở",
  DA_DONG: "Đã đóng",
  CHUA_MO: "Chưa mở",
};

// Trạng thái duyệt hoạt động
export const TRANG_THAI_DUYET = {
  CHO_DUYET: "Chờ duyệt",
  DA_DUYET: "Đã duyệt",
  TU_CHOI: "Từ chối",
  DA_KET_THUC: "Đã kết thúc",
};

// Đơn vị tổ chức
export const DON_VI_TO_CHUC = {
  DOAN_TRUONG: "Đoàn Trường",
  DOAN_KHOA: "Đoàn Khoa",
  CHI_DOAN: "Chi đoàn",
};

// Filter options cho dropdown
export const HOAT_DONG_FILTER_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: TRANG_THAI_DUYET.DA_DUYET, label: "Đã duyệt" },
  { value: TRANG_THAI_DUYET.CHO_DUYET, label: "Chưa duyệt" },
];

export const DANG_KI_FILTER_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: TRANG_THAI_DUYET.CHO_DUYET, label: "Chờ duyệt" },
  { value: TRANG_THAI_DUYET.DA_DUYET, label: "Đã duyệt" },
  { value: TRANG_THAI_DUYET.TU_CHOI, label: "Từ chối" },
];
