import { ROLES } from '../constants/roles';
import { PERMISSIONS } from '../constants/permissions';

const MEMBER_SIDEBAR_ITEMS = [
  {
    key: 'thong-tin-ca-nhan',
    label: 'Thông tin cá nhân',
    icon: 'UserCircle',
    path: '/thong-tin-ca-nhan',
    permission: PERMISSIONS.PROFILE_VIEW_UPDATE,
  },
  {
    key: 'so-doan',
    label: 'Sổ đoàn',
    icon: 'BookOpen',
    path: '/so-doan',
    permission: PERMISSIONS.SO_DOAN_VIEW,
  },
  {
    key: 'doan-phi-lich-su',
    label: 'Lịch sử đoàn phí',
    icon: 'Wallet',
    path: '/doan-phi/lich-su',
    permission: PERMISSIONS.DOAN_PHI_VIEW_HISTORY,
  },
  {
    key: 'hoat-dong-ca-nhan',
    label: 'Hoạt động của tôi',
    icon: 'CalendarCheck',
    path: '/hoat-dong-ca-nhan',
    permission: PERMISSIONS.ACTIVITY_REGISTER,
    children: [
      {
        key: 'hoat-dong-dang-ky',
        label: 'Đăng ký hoạt động',
        path: '/hoat-dong-ca-nhan/dang-ky',
        permission: PERMISSIONS.ACTIVITY_REGISTER,
      },
      {
        key: 'hoat-dong-lich-su',
        label: 'Lịch sử đăng ký',
        path: '/hoat-dong-ca-nhan/lich-su',
        permission: PERMISSIONS.ACTIVITY_VIEW_HISTORY,
      },
      {
        key: 'hoat-dong-diem',
        label: 'Điểm hoạt động',
        path: '/hoat-dong-ca-nhan/diem',
        permission: PERMISSIONS.ACTIVITY_VIEW_SCORE,
      },
    ],
  },
];

const SIDEBAR_CONFIG = {

  // ══════════════════════════════════════════════════════════
  //  ADMIN – Đoàn trường (Ban thường vụ)
  // ══════════════════════════════════════════════════════════
  [ROLES.ADMIN]: [
    {
      key: 'dashboard',
      label: 'Tổng quan',
      icon: 'LayoutDashboard',
      path: '/dashboard',
    },
    {
      key: 'so-doan',
      label: 'Sổ đoàn',
      icon: 'BookOpen',
      path: '/so-doan',
      permission: PERMISSIONS.SO_DOAN_UPDATE,
    },
    {
      key: 'doan-phi',
      label: 'Đoàn phí',
      icon: 'Wallet',
      path: '/doan-phi',
      permission: PERMISSIONS.DOAN_PHI_UPDATE,
    },
    {
      key: 'hoat-dong',
      label: 'Hoạt động',
      icon: 'CalendarCheck',
      path: '/hoat-dong',
      permission: PERMISSIONS.ACTIVITY_SCHOOL_UPDATE,
      children: [
        {
          key: 'hoat-dong-quan-ly',
          label: 'Quản lý hoạt động',
          path: '/hoat-dong/quan-ly',
          permission: PERMISSIONS.ACTIVITY_SCHOOL_UPDATE,
        },
        {
          key: 'hoat-dong-dang-ky',
          label: 'Danh sách đăng ký',
          path: '/hoat-dong/dang-ky',
          permission: PERMISSIONS.ACTIVITY_SCHOOL_VIEW_REGISTRATIONS,
        },
        {
          key: 'hoat-dong-duyet',
          label: 'Duyệt đăng ký',
          path: '/hoat-dong/duyet',
          permission: PERMISSIONS.ACTIVITY_SCHOOL_APPROVE_REGISTRATIONS,
        },
        {
          key: 'hoat-dong-xac-nhan',
          label: 'Xác nhận hoàn thành',
          path: '/hoat-dong/xac-nhan',
          permission: PERMISSIONS.ACTIVITY_SCHOOL_CONFIRM,
        },
      ],
    },
    {
      key: 'yeu-cau',
      label: 'Yêu cầu mở hoạt động',
      icon: 'ClipboardList',
      path: '/yeu-cau',
      permission: PERMISSIONS.ACTIVITY_REQUEST_VIEW,
      children: [
        {
          key: 'yeu-cau-danh-sach',
          label: 'Danh sách yêu cầu',
          path: '/yeu-cau/danh-sach',
          permission: PERMISSIONS.ACTIVITY_REQUEST_VIEW,
        },
        {
          key: 'yeu-cau-duyet',
          label: 'Duyệt yêu cầu',
          path: '/yeu-cau/duyet',
          permission: PERMISSIONS.ACTIVITY_REQUEST_APPROVE,
        },
      ],
    },
    {
      key: 'tai-khoan',
      label: 'Quản lý tài khoản',
      icon: 'Users',
      path: '/tai-khoan',
      permission: PERMISSIONS.ACCOUNT_MANAGE,
    },
  ],

  // ══════════════════════════════════════════════════════════
  //  FACULTY_SEC – Bí thư liên chi đoàn (Đoàn khoa)
  // ══════════════════════════════════════════════════════════
  [ROLES.FACULTY_SEC]: [
    {
      key: 'dashboard',
      label: 'Tổng quan',
      icon: 'LayoutDashboard',
      path: '/dashboard',
    },
    {
      key: 'hoat-dong-khoa',
      label: 'Hoạt động khoa',
      icon: 'CalendarCheck',
      path: '/hoat-dong-khoa',
      permission: PERMISSIONS.ACTIVITY_FACULTY_UPDATE,
      children: [
        {
          key: 'hoat-dong-khoa-quan-ly',
          label: 'Quản lý hoạt động',
          path: '/hoat-dong-khoa/quan-ly',
          permission: PERMISSIONS.ACTIVITY_FACULTY_UPDATE,
        },
        {
          key: 'hoat-dong-khoa-dang-ky',
          label: 'Danh sách đăng ký',
          path: '/hoat-dong-khoa/dang-ky',
          permission: PERMISSIONS.ACTIVITY_FACULTY_VIEW_REGISTRATIONS,
        },
        {
          key: 'hoat-dong-khoa-duyet',
          label: 'Duyệt đăng ký',
          path: '/hoat-dong-khoa/duyet',
          permission: PERMISSIONS.ACTIVITY_FACULTY_APPROVE_REGISTRATIONS,
        },
        {
          key: 'hoat-dong-khoa-xac-nhan',
          label: 'Xác nhận hoàn thành',
          path: '/hoat-dong-khoa/xac-nhan',
          permission: PERMISSIONS.ACTIVITY_FACULTY_CONFIRM,
        },
      ],
    },
    {
      key: 'yeu-cau-chi-doan',
      label: 'Yêu cầu hoạt động chi đoàn',
      icon: 'ClipboardList',
      path: '/yeu-cau-chi-doan',
      permission: PERMISSIONS.ACTIVITY_REQUEST_APPROVE_CLASS,
    },
    {
      key: 'gui-yeu-cau',
      label: 'Gửi yêu cầu lên Đoàn trường',
      icon: 'Send',
      path: '/gui-yeu-cau',
      permission: PERMISSIONS.ACTIVITY_REQUEST_SEND_SCHOOL,
    },
    {
      key: 'bao-cao',
      label: 'Báo cáo & Thống kê',
      icon: 'BarChart2',
      path: '/bao-cao',
      permission: PERMISSIONS.ACTIVITY_FACULTY_REPORT,
    },
  ],

  // ══════════════════════════════════════════════════════════
  //  CLASS_SEC – Bí thư chi đoàn lớp
  //  Kế thừa toàn bộ menu của Đoàn viên (MEMBER_SIDEBAR_ITEMS)
  // ══════════════════════════════════════════════════════════
  [ROLES.CLASS_SEC]: [
    {
      key: 'dashboard',
      label: 'Tổng quan',
      icon: 'LayoutDashboard',
      path: '/dashboard',
    },
    // ── Quyền riêng của Bí thư chi đoàn ──────────────────
    {
      key: 'doan-phi-lop',
      label: 'Đoàn phí lớp',
      icon: 'Wallet',
      path: '/doan-phi-lop',
      permission: PERMISSIONS.DOAN_PHI_COLLECT,
      children: [
        {
          key: 'doan-phi-lap-danh-sach',
          label: 'Lập danh sách thu',
          path: '/doan-phi-lop/lap-danh-sach',
          permission: PERMISSIONS.DOAN_PHI_COLLECT,
        },
        {
          key: 'doan-phi-gui',
          label: 'Gửi danh sách nộp',
          path: '/doan-phi-lop/gui',
          permission: PERMISSIONS.DOAN_PHI_SUBMIT,
        },
      ],
    },
    {
      key: 'hoat-dong-chi-doan',
      label: 'Hoạt động chi đoàn',
      icon: 'CalendarCheck',
      path: '/hoat-dong-chi-doan',
      permission: PERMISSIONS.ACTIVITY_CLASS_VIEW_REGISTRATIONS,
      children: [
        {
          key: 'hoat-dong-chi-doan-dang-ky',
          label: 'Danh sách đăng ký',
          path: '/hoat-dong-chi-doan/dang-ky',
          permission: PERMISSIONS.ACTIVITY_CLASS_VIEW_REGISTRATIONS,
        },
        {
          key: 'hoat-dong-chi-doan-duyet',
          label: 'Duyệt đăng ký',
          path: '/hoat-dong-chi-doan/duyet',
          permission: PERMISSIONS.ACTIVITY_CLASS_APPROVE_REGISTRATIONS,
        },
        {
          key: 'hoat-dong-chi-doan-xac-nhan',
          label: 'Xác nhận hoàn thành',
          path: '/hoat-dong-chi-doan/xac-nhan',
          permission: PERMISSIONS.ACTIVITY_CLASS_CONFIRM,
        },
      ],
    },
    // ── Kế thừa từ Đoàn viên ──────────────────────────────
    ...MEMBER_SIDEBAR_ITEMS,
  ],

  // ══════════════════════════════════════════════════════════
  //  MEMBER – Đoàn viên (Sinh viên)
  // ══════════════════════════════════════════════════════════
  [ROLES.MEMBER]: [
    {
      key: 'dashboard',
      label: 'Tổng quan',
      icon: 'LayoutDashboard',
      path: '/dashboard',
    },
    ...MEMBER_SIDEBAR_ITEMS,
  ],
};

/**
 * getSidebarItems – trả về danh sách menu items cho một role,
 * đã lọc theo quyền thực tế của user.
 *
 * @param {string} role        – vai trò hiện tại (ROLES.ADMIN, ...)
 * @param {string[]} userPerms – mảng permission thực tế (từ auth context / JWT)
 * @returns {Array}
 */
export const getSidebarItems = (role, userPerms = []) => {
  const items = SIDEBAR_CONFIG[role] ?? [];

  return items
    .filter((item) => !item.permission || userPerms.includes(item.permission))
    .map((item) => ({
      ...item,
      children: item.children
        ? item.children.filter(
            (child) => !child.permission || userPerms.includes(child.permission)
          )
        : undefined,
    }));
};

export default SIDEBAR_CONFIG;
