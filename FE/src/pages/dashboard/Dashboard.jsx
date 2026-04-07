import { useState } from 'react';
import {
  Users,
  Activity,
  Bell,
  Search,
  TrendingUp,
  UserCheck,
  ClipboardList,
} from 'lucide-react';
import Sidebar from '../../components/layouts/Sidebar';
import { ROLES } from '../../constants/roles';
import { ROLE_PERMISSIONS } from '../../constants/permissions';
import './Dashboard.css';

// ── Mock user (sau này lấy từ AuthContext / JWT) ──────────
const MOCK_USER = {
  name: 'Nguyễn Văn Đoàn Trưởng',
  role: ROLES.DOANTRUONG,
};

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const userPerms = ROLE_PERMISSIONS[MOCK_USER.role] ?? [];

  const stats = [
    { title: 'Tổng Đoàn Viên', value: '18,245', icon: Users, color: '#004F9F', trend: '+241 tháng này' },
    { title: 'Đoàn viên Mới', value: '1,502', icon: UserCheck, color: '#38a169', trend: 'Từ đợt tuyển mới' },
    { title: 'Hoạt Động', value: '12', icon: Activity, color: '#0088cc', trend: 'Trong kỳ này' },
    { title: 'Hồ Sơ Chờ Duyệt', value: '84', icon: ClipboardList, color: '#e53e3e', trend: 'Cần giải quyết' },
  ];

  const members = [
    { name: 'Nguyễn Đăng Việt', id: '23110245', dept: 'CNTT', status: 'Chờ duyệt', statusColor: '#e53e3e' },
    { name: 'Trần Minh Hải', id: '23110112', dept: 'Cơ khí', status: 'Đã duyệt', statusColor: '#38a169' },
    { name: 'Lê Thị Mai', id: '23110567', dept: 'Kinh tế', status: 'Đã duyệt', statusColor: '#38a169' },
    { name: 'Phạm Hoàng Nam', id: '23110443', dept: 'Điện tử', status: 'Bổ sung hồ sơ', statusColor: '#d69e2e' },
  ];

  const notifications = [
    { title: 'Tập huấn cán bộ Đoàn 2026', time: '14:00, 10/04', type: 'Sự kiện' },
    { title: 'Báo cáo quyết toán năm 2025', time: 'Hết hạn: 15/04', type: 'Nhiệm vụ' },
    { title: 'Ngày hội Hiến máu nhân đạo', time: 'Cả ngày, 12/04', type: 'Sự kiện' },
  ];

  return (
    <div className="dashboard-wrapper">

      {/* ── Sidebar ──────────────────────────────────────── */}
      <Sidebar
        role={MOCK_USER.role}
        permissions={userPerms}
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        onLogout={() => (window.location.href = '/')}
        user={{ name: MOCK_USER.name }}
      />

      {/* ── Main ─────────────────────────────────────────── */}
      <div className="dashboard-main">

        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-header__greeting">
            <h2 className="dashboard-header__title">Chào mừng trở lại, {MOCK_USER.name.split(' ').pop()}</h2>
            <p className="dashboard-header__date">
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="dashboard-header__actions">
            <div className="dashboard-search">
              <Search size={16} className="dashboard-search__icon" />
              <input
                type="text"
                className="dashboard-search__input"
                placeholder="Tìm kiếm đoàn viên..."
              />
            </div>
            <button className="dashboard-header__bell" title="Thông báo">
              <Bell size={20} />
              <span className="dashboard-header__bell-dot" />
            </button>
            <div className="dashboard-header__avatar" title={MOCK_USER.name}>
              {MOCK_USER.name.split(' ').pop().charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="dashboard-stats">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-card__top">
                <div className="stat-card__icon" style={{ backgroundColor: `${stat.color}18`, color: stat.color }}>
                  <stat.icon size={22} />
                </div>
                <span className="stat-card__trend" style={{ color: stat.color, backgroundColor: `${stat.color}12` }}>
                  {stat.trend.split(' ')[0]}
                </span>
              </div>
              <p className="stat-card__label">{stat.title}</p>
              <p className="stat-card__value">{stat.value}</p>
              <p className="stat-card__sub">{stat.trend}</p>
            </div>
          ))}
        </section>

        {/* Content Grid */}
        <section className="dashboard-content-grid">

          {/* Members Table */}
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h3 className="dashboard-card__title">Đoàn viên mới đăng ký</h3>
              <button className="dashboard-card__action">Xem tất cả →</button>
            </div>
            <table className="member-table">
              <thead>
                <tr>
                  <th>Sinh viên</th>
                  <th>Mã SV</th>
                  <th>Khoa</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {members.map((row, i) => (
                  <tr key={i}>
                    <td>
                      <div className="member-table__name-cell">
                        <div className="member-table__avatar">
                          {row.name.charAt(0)}
                        </div>
                        {row.name}
                      </div>
                    </td>
                    <td className="member-table__muted">{row.id}</td>
                    <td className="member-table__muted">{row.dept}</td>
                    <td>
                      <span
                        className="member-table__status"
                        style={{ color: row.statusColor, backgroundColor: `${row.statusColor}15` }}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Notifications */}
          <div className="dashboard-card">
            <h3 className="dashboard-card__title" style={{ marginBottom: '1.5rem' }}>Thông báo quan trọng</h3>
            <div className="notification-list">
              {notifications.map((note, i) => (
                <div key={i} className="notification-item">
                  <p className="notification-item__title">{note.title}</p>
                  <div className="notification-item__meta">
                    <span>{note.time}</span>
                    <span className="notification-item__type">{note.type}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="dashboard-report-btn">
              <TrendingUp size={16} />
              Báo cáo thống kê
            </button>
          </div>

        </section>
      </div>
    </div>
  );
};

export default Dashboard;
