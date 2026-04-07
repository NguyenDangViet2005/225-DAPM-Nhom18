import { 
  Users, 
  UserCheck, 
  Activity, 
  ClipboardList 
} from 'lucide-react';
import { ROLES } from '@/constants/roles';

/**
 * Mock data cho Dashboard dựa trên vai trò người dùng
 * (DoanTruong quản lý toàn trường, DoanKhoa quản lý cấp khoa)
 */
export const getDashboardMockData = (role) => {
  // ── TRƯỜNG HỢP: DOAN KHOA ───────────────────────────────
  if (role === ROLES.DOANKHOA) {
    return {
      stats: [
        { 
          title: 'Đoàn Viên (Khoa)', 
          value: '2,845', 
          icon: Users, 
          color: '#004F9F', 
          trend: '+24 tháng này' 
        },
        { 
          title: 'Đoàn viên Mới', 
          value: '142', 
          icon: UserCheck, 
          color: '#38a169', 
          trend: 'Học kỳ II' 
        },
        { 
          title: 'Hoạt Động Khoa', 
          value: '5', 
          icon: Activity, 
          color: '#0088cc', 
          trend: 'Đang triển khai' 
        },
        { 
          title: 'Đăng ký Chờ Duyệt', 
          value: '18', 
          icon: ClipboardList, 
          color: '#e53e3e', 
          trend: 'Từ các Chi đoàn' 
        },
      ],
      recentMembers: [
        { name: 'Nguyễn Văn A', id: '23110001', dept: 'CNTT', status: 'Đã duyệt', statusColor: '#38a169' },
        { name: 'Trần Thị B', id: '23110002', dept: 'CNTT', status: 'Chờ duyệt', statusColor: '#e53e3e' },
        { name: 'Lê Văn C', id: '23110003', dept: 'CNTT', status: 'Bổ sung', statusColor: '#d69e2e' },
        { name: 'Phạm Thị D', id: '23110004', dept: 'CNTT', status: 'Đã duyệt', statusColor: '#38a169' },
      ],
      notifications: [
        { title: 'Họp Bí thư Chi đoàn tháng 4', time: '08:00, 15/04', type: 'Thông báo' },
        { title: 'Nộp báo cáo hoạt động Tháng thanh niên', time: 'Hạn: 10/04', type: 'Nhiệm vụ' },
        { title: 'Giải bóng đá Nam khoa CNTT', time: 'Cả ngày, 20/04', type: 'Sự kiện' },
      ]
    };
  }

  // ── TRƯỜNG HỢP: DOAN TRUONG (Mặc định) ─────────────────
  return {
    stats: [
      { 
        title: 'Tổng Đoàn Viên', 
        value: '18,245', 
        icon: Users, 
        color: '#004F9F', 
        trend: '+241 tháng này' 
      },
      { 
        title: 'Đoàn viên Mới', 
        value: '1,502', 
        icon: UserCheck, 
        color: '#38a169', 
        trend: 'Toàn trường' 
      },
      { 
        title: 'Hoạt Động Cấp Trường', 
        value: '12', 
        icon: Activity, 
        color: '#0088cc', 
        trend: 'Học kỳ này' 
      },
      { 
        title: 'Hồ Sơ Chờ Duyệt', 
        value: '84', 
        icon: ClipboardList, 
        color: '#e53e3e', 
        trend: 'Toàn hệ thống' 
      },
    ],
    recentMembers: [
      { name: 'Nguyễn Đăng Việt', id: '23110245', dept: 'CNTT', status: 'Chờ duyệt', statusColor: '#e53e3e' },
      { name: 'Trần Minh Hải', id: '23110112', dept: 'Cơ khí', status: 'Đã duyệt', statusColor: '#38a169' },
      { name: 'Lê Thị Mai', id: '23110567', dept: 'Kinh tế', status: 'Đã duyệt', statusColor: '#38a169' },
      { name: 'Phạm Hoàng Nam', id: '23110443', dept: 'Điện tử', status: 'Bổ sung hồ sơ', statusColor: '#d69e2e' },
    ],
    notifications: [
      { title: 'Tập huấn cán bộ Đoàn 2026', time: '14:00, 10/04', type: 'Sự kiện' },
      { title: 'Báo cáo quyết toán năm 2025', time: 'Hết hạn: 15/04', type: 'Nhiệm vụ' },
      { title: 'Ngày hội Hiến máu nhân đạo', time: 'Cả ngày, 12/04', type: 'Sự kiện' },
    ]
  };
};
