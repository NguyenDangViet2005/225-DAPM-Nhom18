/**
 * Constants index - Export tất cả constants
 */

export * from "./hoatdong.constants";
export * from "./common.constants";
export * from "./permissions";
export { ROLES, ROLE_LABELS } from "./roles";

// Đoàn phí status
export const DOAN_PHI_STATUS = {
  DA_DONG: "Đã đóng",
  CHUA_DONG: "Chưa đóng",
  DANG_CHO_DUYET: "Đang chờ duyệt",
};

// Sổ đoàn status
export const SO_DOAN_STATUS = {
  CHUA_NOP: "Chưa nộp sổ",
  CHO_DUYET: "Chờ duyệt",
  DA_DUYET: "Đã duyệt",
};

// Yêu cầu status
export const YEU_CAU_STATUS = {
  CHO_DUYET: "Chờ duyệt",
  DA_DUYET: "Đã duyệt",
  TU_CHOI: "Từ chối",
};

// Đăng ký hoạt động status
export const DANG_KI_STATUS = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
};
