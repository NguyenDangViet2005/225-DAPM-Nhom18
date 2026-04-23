/**
 * Common constants - Các hằng số chung cho toàn ứng dụng
 */

// Pagination
export const PAGE_SIZE = {
  DEFAULT: 10,
  SMALL: 5,
  MEDIUM: 20,
  LARGE: 50,
};

// Colors - Theme colors
export const COLORS = {
  PRIMARY: "#004F9F",
  SUCCESS: "#38a169",
  WARNING: "#b45309",
  DANGER: "#e53e3e",
  INFO: "#0088cc",
  SECONDARY: "#64748b",
};

// Status colors mapping
export const STATUS_COLORS = {
  "Chờ duyệt": COLORS.WARNING,
  "Đã duyệt": COLORS.SUCCESS,
  "Từ chối": COLORS.DANGER,
  "Đang mở": COLORS.INFO,
  "Đã đóng": COLORS.SECONDARY,
  "Chưa đóng": COLORS.WARNING,
  "Đang chờ duyệt": COLORS.INFO,
};

// Common filter option
export const ALL_STATUS_FILTER = { value: "all", label: "Tất cả trạng thái" };
