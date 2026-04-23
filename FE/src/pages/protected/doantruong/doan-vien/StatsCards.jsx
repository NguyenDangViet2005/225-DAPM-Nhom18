import { Users, UserCheck, UserX } from "lucide-react";

const StatsCards = ({ stats }) => {
  return (
    <div className="ql-dv-stats">
      <div className="ql-dv-stat-card primary">
        <div className="ql-dv-stat-label">Tổng đoàn viên</div>
        <div className="ql-dv-stat-value">{stats.total}</div>
        <Users size={48} className="ql-dv-stat-icon" />
      </div>
      <div className="ql-dv-stat-card info">
        <div className="ql-dv-stat-label">Nam</div>
        <div className="ql-dv-stat-value">{stats.male}</div>
        <UserCheck size={48} className="ql-dv-stat-icon" />
      </div>
      <div className="ql-dv-stat-card warning">
        <div className="ql-dv-stat-label">Nữ</div>
        <div className="ql-dv-stat-value">{stats.female}</div>
        <UserCheck size={48} className="ql-dv-stat-icon" />
      </div>
      <div className="ql-dv-stat-card success">
        <div className="ql-dv-stat-label">Đã có tài khoản</div>
        <div className="ql-dv-stat-value">{stats.withAccount}</div>
        <UserX size={48} className="ql-dv-stat-icon" />
      </div>
    </div>
  );
};

export default StatsCards;
