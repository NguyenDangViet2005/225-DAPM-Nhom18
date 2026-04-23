import { Users, ShieldCheck, UserX } from 'lucide-react';

const TaiKhoanStatsCards = ({ stats }) => {
  return (
    <div className="tk-stats">
      <div className="tk-stat-item">
        <span className="tk-stat-item__label">Tổng người dùng</span>
        <span className="tk-stat-item__value">{stats.tongTaiKhoan}</span>
        <Users size={32} className="tk-stat-item__bg-icon" />
      </div>
      <div className="tk-stat-item" style={{ borderLeft: '3px solid #15803d' }}>
        <span className="tk-stat-item__label">Đang hoạt động</span>
        <span className="tk-stat-item__value">{stats.dangHoatDong}</span>
        <ShieldCheck size={32} className="tk-stat-item__bg-icon" style={{ color: '#15803d' }} />
      </div>
      <div className="tk-stat-item" style={{ borderLeft: '3px solid #b91c1c' }}>
        <span className="tk-stat-item__label">Đã khóa / Tạm dừng</span>
        <span className="tk-stat-item__value">{stats.daKhoa}</span>
        <UserX size={32} className="tk-stat-item__bg-icon" style={{ color: '#b91c1c' }} />
      </div>
    </div>
  );
};

export default TaiKhoanStatsCards;
