/**
 * ROLES – Vai trò trong hệ thống quản lý Đoàn viên
 *
 * DOANTRUONG   : Đoàn trường (Ban thường vụ)
 * DOANKHOA     : Đoàn khoa   (Bí thư liên chi đoàn)
 * BITHU        : Bí thư chi đoàn lớp
 * DOANVIEN     : Đoàn viên   (Sinh viên)
 */
export const ROLES = {
  DOANTRUONG: 'DOANTRUONG',
  DOANKHOA: 'DOANKHOA',
  BITHU: 'BITHU',
  DOANVIEN: 'DOANVIEN',
};

/** Label hiển thị tương ứng */
export const ROLE_LABELS = {
  [ROLES.DOANTRUONG]: 'Đoàn trường (Ban thường vụ)',
  [ROLES.DOANKHOA]: 'Bí thư liên chi đoàn',
  [ROLES.BITHU]: 'Bí thư chi đoàn lớp',
  [ROLES.DOANVIEN]: 'Đoàn viên',
};
