import { ROLES } from '@/constants/roles';
import { PERMISSIONS } from '@/constants/permissions';

const DOANVIEN_SIDEBAR_ITEMS = [
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
  //  DOANTRUONG – Đoàn trường (Ban thường vụ)
  // ══════════════════════════════════════════════════════════
  [ROLES.DOANTRUONG]: [
    {
      key: 'dashboard',
      label: 'Tổng quan',
      icon: 'LayoutDashboard',
      path: '/doan-truong/dashboard',
    },
    {
      key: 'so-doan',
      label: 'Sổ đoàn',
      icon: 'BookOpen',
      path: '/doan-truong/so-doan',
      permission: PERMISSIONS.SO_DOAN_UPDATE,
    },
    {
      key: 'doan-phi',
      label: 'Đoàn phí',
      icon: 'Wallet',
      path: '/doan-truong/doan-phi',
      permission: PERMISSIONS.DOAN_PHI_UPDATE,
    },
    {
      key: 'hoat-dong',
      label: 'Hoạt động',
      icon: 'CalendarCheck',
      path: '/doan-truong/hoat-dong',
      permission: PERMISSIONS.ACTIVITY_SCHOOL_UPDATE,
      children: [
        {
          key: 'hoat-dong-quan-ly',
          label: 'Quản lý hoạt động',
          path: '/doan-truong/hoat-dong/quan-ly',
          permission: PERMISSIONS.ACTIVITY_SCHOOL_UPDATE,
        },
        {
          key: 'hoat-dong-duyet',
          label: 'Duyệt đăng ký',
          path: '/doan-truong/hoat-dong/duyet',
          permission: PERMISSIONS.ACTIVITY_SCHOOL_APPROVE_REGISTRATIONS,
        },
        {
          key: 'hoat-dong-xac-nhan',
          label: 'Xác nhận hoàn thành',
          path: '/doan-truong/hoat-dong/xac-nhan',
          permission: PERMISSIONS.ACTIVITY_SCHOOL_CONFIRM,
        },
      ],
    },
    {
      key: 'yeu-cau',
      label: 'Yêu cầu mở hoạt động',
      icon: 'ClipboardList',
      path: '/doan-truong/yeu-cau',
      permission: PERMISSIONS.ACTIVITY_REQUEST_VIEW,
    },
    {
      key: 'tai-khoan',
      label: 'Quản lý tài khoản',
      icon: 'Users',
      path: '/doan-truong/tai-khoan',
      permission: PERMISSIONS.ACCOUNT_MANAGE,
    },
  ],

  // ══════════════════════════════════════════════════════════
  //  DOANKHOA – Bí thư liên chi đoàn (Đoàn khoa)
  // ══════════════════════════════════════════════════════════
  [ROLES.DOANKHOA]: [
    {
      key: 'dashboard',
      label: 'Tổng quan',
      icon: 'LayoutDashboard',
      path: '/doan-khoa/dashboard',
    },
    {
      key: 'hoat-dong-khoa',
      label: 'Hoạt động khoa',
      icon: 'CalendarCheck',
      path: '/doan-khoa/hoat-dong-khoa',
      permission: PERMISSIONS.ACTIVITY_FACULTY_UPDATE,
      children: [
        {
          key: 'hoat-dong-khoa-quan-ly',
          label: 'Quản lý hoạt động',
          path: '/doan-khoa/hoat-dong-khoa/quan-ly',
          permission: PERMISSIONS.ACTIVITY_FACULTY_UPDATE,
        },
        {
          key: 'hoat-dong-khoa-duyet',
          label: 'Duyệt đăng ký',
          path: '/doan-khoa/hoat-dong-khoa/duyet',
          permission: PERMISSIONS.ACTIVITY_FACULTY_APPROVE_REGISTRATIONS,
        },
        {
          key: 'hoat-dong-khoa-xac-nhan',
          label: 'Xác nhận hoàn thành',
          path: '/doan-khoa/hoat-dong-khoa/xac-nhan',
          permission: PERMISSIONS.ACTIVITY_FACULTY_CONFIRM,
        },
      ],
    },
    {
      key: 'yeu-cau-chi-doan',
      label: 'Yêu cầu hoạt động chi đoàn',
      icon: 'ClipboardList',
      path: '/doan-khoa/yeu-cau-chi-doan',
      permission: PERMISSIONS.ACTIVITY_REQUEST_APPROVE_CLASS,
    },
    {
      key: 'gui-yeu-cau',
      label: 'Gửi yêu cầu lên Đoàn trường',
      icon: 'Send',
      path: '/doan-khoa/gui-yeu-cau',
      permission: PERMISSIONS.ACTIVITY_REQUEST_SEND_SCHOOL,
    },
    {
      key: 'bao-cao',
      label: 'Báo cáo & Thống kê',
      icon: 'BarChart2',
      path: '/doan-khoa/bao-cao',
      permission: PERMISSIONS.ACTIVITY_FACULTY_REPORT,
    },
  ],

  // ══════════════════════════════════════════════════════════
  //  BITHU – Bí thư chi đoàn lớp
  //  Kế thừa toàn bộ menu của Đoàn viên (DOANVIEN_SIDEBAR_ITEMS)
  // ══════════════════════════════════════════════════════════
  [ROLES.BITHU]: [
    {
      key: 'dashboard',
      label: 'Tổng quan',
      icon: 'LayoutDashboard',
      path: '/bi-thu/dashboard',
    },
    // ── Quyền riêng của Bí thư chi đoàn ──────────────────
    {
      key: 'doan-phi-lop',
      label: 'Đoàn phí lớp',
      icon: 'Wallet',
      path: '/bi-thu/doan-phi-lop',
      permission: PERMISSIONS.DOAN_PHI_COLLECT,
      children: [
        {
          key: 'doan-phi-lap-danh-sach',
          label: 'Lập danh sách thu',
          path: '/bi-thu/doan-phi-lop/lap-danh-sach',
          permission: PERMISSIONS.DOAN_PHI_COLLECT,
        },
        {
          key: 'doan-phi-gui',
          label: 'Gửi danh sách nộp',
          path: '/bi-thu/doan-phi-lop/gui',
          permission: PERMISSIONS.DOAN_PHI_SUBMIT,
        },
      ],
    },
    {
      key: 'hoat-dong-chi-doan',
      label: 'Hoạt động chi đoàn',
      icon: 'CalendarCheck',
      path: '/bi-thu/hoat-dong-chi-doan',
      permission: PERMISSIONS.ACTIVITY_CLASS_VIEW_REGISTRATIONS,
      children: [
        {
          key: 'hoat-dong-chi-doan-danh-sach',
          label: 'Danh sách đăng ký',
          path: '/bi-thu/hoat-dong-chi-doan/danh-sach',
          permission: PERMISSIONS.ACTIVITY_CLASS_VIEW_REGISTRATIONS,
        },
        {
          key: 'hoat-dong-chi-doan-xac-nhan',
          label: 'Xác nhận hoàn thành',
          path: '/bi-thu/hoat-dong-chi-doan/xac-nhan',
          permission: PERMISSIONS.ACTIVITY_CLASS_CONFIRM,
        },
      ],
    },
    {
      key: 'gui-yeu-cau-hoat-dong',
      label: 'Gửi yêu cầu hoạt động',
      icon: 'Send',
      path: '/bi-thu/gui-yeu-cau-hoat-dong',
      permission: PERMISSIONS.ACTIVITY_CLASS_VIEW_REGISTRATIONS,
    },
    // ── Kế thừa từ Đoàn viên ──────────────────────────────
    ...DOANVIEN_SIDEBAR_ITEMS.map(item => ({
      ...item,
      path: `/bi-thu${item.path}`,
      children: item.children?.map(child => ({
        ...child,
        path: `/bi-thu${child.path}`
      }))
    })),
  ],

  // ══════════════════════════════════════════════════════════
  //  DOANVIEN – Đoàn viên (Sinh viên)
  // ══════════════════════════════════════════════════════════
  [ROLES.DOANVIEN]: [
    {
      key: 'dashboard',
      label: 'Tổng quan',
      icon: 'LayoutDashboard',
      path: '/doan-vien/dashboard',
    },
    ...DOANVIEN_SIDEBAR_ITEMS.map(item => ({
      ...item,
      path: `/doan-vien${item.path}`,
      children: item.children?.map(child => ({
        ...child,
        path: `/doan-vien${child.path}`
      }))
    })),
  ],
};

/**
 * getSidebarItems – trả về danh sách menu items cho một role,
 * đã lọc theo quyền thực tế của user.
 *
 * @param {string} role        – vai trò hiện tại (ROLES.DOANTRUONG, ...)
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
