import { ROLES } from './roles';

/**
 * PERMISSIONS – Tất cả quyền của hệ thống
 * Nhóm theo domain nghiệp vụ.
 */
export const PERMISSIONS = {
  // ── Sổ đoàn ─────────────────────────────────────────────
  SO_DOAN_UPDATE: 'SO_DOAN_UPDATE',           // Cập nhật sổ đoàn
  SO_DOAN_VIEW: 'SO_DOAN_VIEW',               // Xem tình trạng sổ đoàn

  // ── Đoàn phí ────────────────────────────────────────────
  DOAN_PHI_UPDATE: 'DOAN_PHI_UPDATE',         // Cập nhật đoàn phí (Admin)
  DOAN_PHI_COLLECT: 'DOAN_PHI_COLLECT',       // Lập danh sách thu đoàn phí (Bí thư lớp)
  DOAN_PHI_SUBMIT: 'DOAN_PHI_SUBMIT',         // Gửi danh sách nộp đoàn phí
  DOAN_PHI_VIEW_HISTORY: 'DOAN_PHI_VIEW_HISTORY', // Xem lịch sử đóng đoàn phí (Đoàn viên)

  // ── Hoạt động cấp Đoàn trường ───────────────────────────
  ACTIVITY_SCHOOL_UPDATE: 'ACTIVITY_SCHOOL_UPDATE',       // Cập nhật hoạt động cấp đoàn
  ACTIVITY_SCHOOL_CONFIRM: 'ACTIVITY_SCHOOL_CONFIRM',     // Xác nhận hoàn thành hoạt động cấp đoàn
  ACTIVITY_SCHOOL_VIEW_REGISTRATIONS: 'ACTIVITY_SCHOOL_VIEW_REGISTRATIONS', // Xem ds đoàn viên đăng kí
  ACTIVITY_SCHOOL_APPROVE_REGISTRATIONS: 'ACTIVITY_SCHOOL_APPROVE_REGISTRATIONS', // Duyệt ds đoàn viên

  // ── Yêu cầu mở đăng kí hoạt động ───────────────────────
  ACTIVITY_REQUEST_VIEW: 'ACTIVITY_REQUEST_VIEW',         // Xem ds yêu cầu mở đăng kí
  ACTIVITY_REQUEST_APPROVE: 'ACTIVITY_REQUEST_APPROVE',   // Duyệt yêu cầu mở đăng kí (Admin)
  ACTIVITY_REQUEST_SEND_SCHOOL: 'ACTIVITY_REQUEST_SEND_SCHOOL', // Gửi yêu cầu mở HĐ khoa (Bí thư khoa)
  ACTIVITY_REQUEST_APPROVE_CLASS: 'ACTIVITY_REQUEST_APPROVE_CLASS', // Duyệt yêu cầu HĐ chi đoàn (BT khoa)

  // ── Hoạt động cấp Khoa ──────────────────────────────────
  ACTIVITY_FACULTY_UPDATE: 'ACTIVITY_FACULTY_UPDATE',     // Cập nhật hoạt động khoa
  ACTIVITY_FACULTY_VIEW_REGISTRATIONS: 'ACTIVITY_FACULTY_VIEW_REGISTRATIONS',
  ACTIVITY_FACULTY_APPROVE_REGISTRATIONS: 'ACTIVITY_FACULTY_APPROVE_REGISTRATIONS',
  ACTIVITY_FACULTY_CONFIRM: 'ACTIVITY_FACULTY_CONFIRM',   // Xác nhận hoàn thành cấp khoa
  ACTIVITY_FACULTY_REPORT: 'ACTIVITY_FACULTY_REPORT',     // Lập báo cáo – thống kê

  // ── Hoạt động cấp Chi đoàn ──────────────────────────────
  ACTIVITY_CLASS_VIEW_REGISTRATIONS: 'ACTIVITY_CLASS_VIEW_REGISTRATIONS',
  ACTIVITY_CLASS_APPROVE_REGISTRATIONS: 'ACTIVITY_CLASS_APPROVE_REGISTRATIONS',
  ACTIVITY_CLASS_CONFIRM: 'ACTIVITY_CLASS_CONFIRM',       // Xác nhận hoàn thành cấp chi đoàn

  // ── Đoàn viên tự phục vụ ────────────────────────────────
  PROFILE_VIEW_UPDATE: 'PROFILE_VIEW_UPDATE',             // Xem & cập nhật thông tin cá nhân
  ACTIVITY_REGISTER: 'ACTIVITY_REGISTER',                 // Đăng ký tham gia hoạt động
  ACTIVITY_VIEW_HISTORY: 'ACTIVITY_VIEW_HISTORY',         // Xem lịch sử đăng kí hoạt động
  ACTIVITY_VIEW_SCORE: 'ACTIVITY_VIEW_SCORE',             // Xem điểm hoạt động

  // ── Quản trị ────────────────────────────────────────────
  ACCOUNT_MANAGE: 'ACCOUNT_MANAGE',                       // Quản lý tài khoản (Admin)
};

/**
 * DOANVIEN_PERMISSIONS – dùng chung cho DOANVIEN & BITHU (kế thừa)
 */
const DOANVIEN_PERMISSIONS = [
  PERMISSIONS.PROFILE_VIEW_UPDATE,
  PERMISSIONS.SO_DOAN_VIEW,
  PERMISSIONS.DOAN_PHI_VIEW_HISTORY,
  PERMISSIONS.ACTIVITY_REGISTER,
  PERMISSIONS.ACTIVITY_VIEW_HISTORY,
  PERMISSIONS.ACTIVITY_VIEW_SCORE,
];

/**
 * ROLE_PERMISSIONS – Map từng role → danh sách quyền được phép
 */
export const ROLE_PERMISSIONS = {

  // ────────────────────────────────────────────────────────
  [ROLES.DOANTRUONG]: [
    PERMISSIONS.SO_DOAN_UPDATE,
    PERMISSIONS.DOAN_PHI_UPDATE,
    PERMISSIONS.ACTIVITY_SCHOOL_UPDATE,
    PERMISSIONS.ACTIVITY_SCHOOL_CONFIRM,
    PERMISSIONS.ACTIVITY_SCHOOL_VIEW_REGISTRATIONS,
    PERMISSIONS.ACTIVITY_SCHOOL_APPROVE_REGISTRATIONS,
    PERMISSIONS.ACTIVITY_REQUEST_VIEW,
    PERMISSIONS.ACTIVITY_REQUEST_APPROVE,
    PERMISSIONS.ACCOUNT_MANAGE,
  ],

  // ────────────────────────────────────────────────────────
  [ROLES.DOANKHOA]: [
    PERMISSIONS.ACTIVITY_FACULTY_REPORT,
    PERMISSIONS.ACTIVITY_FACULTY_UPDATE,
    PERMISSIONS.ACTIVITY_FACULTY_VIEW_REGISTRATIONS,
    PERMISSIONS.ACTIVITY_FACULTY_APPROVE_REGISTRATIONS,
    PERMISSIONS.ACTIVITY_FACULTY_CONFIRM,
    PERMISSIONS.ACTIVITY_REQUEST_APPROVE_CLASS,
    PERMISSIONS.ACTIVITY_REQUEST_SEND_SCHOOL,
  ],

  // ────────────────────────────────────────────────────────
  // BITHU kế thừa toàn bộ quyền của DOANVIEN + quyền riêng
  [ROLES.BITHU]: [
    // ── Quyền riêng của Bí thư chi đoàn ──
    PERMISSIONS.DOAN_PHI_COLLECT,
    PERMISSIONS.DOAN_PHI_SUBMIT,
    PERMISSIONS.ACTIVITY_CLASS_VIEW_REGISTRATIONS,
    PERMISSIONS.ACTIVITY_CLASS_APPROVE_REGISTRATIONS,
    PERMISSIONS.ACTIVITY_CLASS_CONFIRM,
    // ── Kế thừa từ Đoàn viên ──
    ...DOANVIEN_PERMISSIONS,
  ],

  // ────────────────────────────────────────────────────────
  [ROLES.DOANVIEN]: [...DOANVIEN_PERMISSIONS],
};

/**
 * hasPermission – kiểm tra một role có quyền nhất định không
 * @param {string} role - vai trò hiện tại
 * @param {string} permission - quyền cần kiểm tra
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
};
