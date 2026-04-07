/**
 * ROLES – Vai trò trong hệ thống quản lý Đoàn viên
 *
 * ADMIN        : Đoàn trường (Ban thường vụ)
 * FACULTY_SEC  : Đoàn khoa   (Bí thư liên chi đoàn)
 * CLASS_SEC    : Bí thư chi đoàn lớp
 * MEMBER       : Đoàn viên   (Sinh viên)
 */
export const ROLES = {
  ADMIN: 'ADMIN',
  FACULTY_SEC: 'FACULTY_SEC',
  CLASS_SEC: 'CLASS_SEC',
  MEMBER: 'MEMBER',
};

/** Label hiển thị tương ứng */
export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Đoàn trường (Ban thường vụ)',
  [ROLES.FACULTY_SEC]: 'Bí thư liên chi đoàn',
  [ROLES.CLASS_SEC]: 'Bí thư chi đoàn lớp',
  [ROLES.MEMBER]: 'Đoàn viên',
};
