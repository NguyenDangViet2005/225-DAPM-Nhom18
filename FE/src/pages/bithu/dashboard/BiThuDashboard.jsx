import { useMemo } from 'react';
import { Bell, Search } from 'lucide-react';
import { getDashboardMockData } from '@/data/mockDashboard';
import { useAuth } from '@/hooks/useAuth';
import '@/pages/dashboard/Dashboard.css';

const BiThuDashboard = () => {
  const { user } = useAuth();
  const activeRole = user?.role || 'BITHU';
  const dashboardData = useMemo(() => getDashboardMockData(activeRole), [activeRole]);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-header__greeting">
            <h2 className="dashboard-header__title">
              Chào mừng, {(user?.name || 'Bí thư').split(' ').pop()}
            </h2>
            <p className="dashboard-header__date">
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="dashboard-header__actions">
            <div className="dashboard-search">
              <Search size={16} className="dashboard-search__icon" />
              <input type="text" className="dashboard-search__input" placeholder="Tìm kiếm đoàn viên..." />
            </div>
            <button className="dashboard-header__bell" title="Thông báo">
              <Bell size={20} />
              <span className="dashboard-header__bell-dot" />
            </button>
            <div className="dashboard-header__avatar" title={user?.name}>
              {(user?.name || 'B').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <section className="dashboard-stats">
          {dashboardData.stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-card__top">
                <div className="stat-card__icon" style={{ backgroundColor: `${stat.color}18`, color: stat.color }}>
                  <stat.icon size={22} />
                </div>
                <span className="stat-card__trend" style={{ color: stat.color, backgroundColor: `${stat.color}12` }}>
                  {stat.trend}
                </span>
              </div>
              <p className="stat-card__label">{stat.title}</p>
              <p className="stat-card__value">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="dashboard-content-grid">
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h3 className="dashboard-card__title">Đoàn viên trong lớp</h3>
              <button className="dashboard-card__action">Xem tất cả →</button>
            </div>
            <table className="member-table">
              <thead>
                <tr>
                  <th>Sinh viên</th>
                  <th>MSSV</th>
                  <th>Khoa</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentMembers.map((row, i) => (
                  <tr key={i}>
                    <td>
                      <div className="member-table__name-cell">
                        <div className="member-table__avatar">{row.name.charAt(0)}</div>
                        {row.name}
                      </div>
                    </td>
                    <td className="member-table__muted">{row.id}</td>
                    <td className="member-table__muted">{row.dept}</td>
                    <td>
                      <span className="member-table__status" style={{ color: row.statusColor, backgroundColor: `${row.statusColor}15` }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="dashboard-card">
            <h3 className="dashboard-card__title" style={{ marginBottom: '1.5rem' }}>Thông báo quan trọng</h3>
            <div className="notification-list">
              {dashboardData.notifications.map((note, i) => (
                <div key={i} className="notification-item">
                  <p className="notification-item__title">{note.title}</p>
                  <div className="notification-item__meta">
                    <span>{note.time}</span>
                    <span className="notification-item__type">{note.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BiThuDashboard;
