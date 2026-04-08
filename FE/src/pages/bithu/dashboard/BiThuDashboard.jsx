import { useMemo } from 'react';
import { Bell, Search, TrendingUp, ArrowRight } from 'lucide-react';
import { getDashboardMockData } from '@/data/mockDashboard';
import { useAuth } from '@/hooks/useAuth';
import '@/pages/bithu/bithu.css';
import './BiThuDashboard.css';

const BiThuDashboard = () => {
  const { user } = useAuth();
  const activeRole = user?.role || 'BITHU';
  const data = useMemo(() => getDashboardMockData(activeRole), [activeRole]);

  return (
    <div className="bt-page">

      {/* ── Header ── */}
      <div className="btd-header">
        <div>
          <h2 className="bt-title">
            Chào mừng trở lại, {(user?.name || 'Bí thư').split(' ').pop()} 👋
          </h2>
          <p className="bt-subtitle">
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="btd-header__actions">
          <div className="bt-search-wrap" style={{ maxWidth: 260 }}>
            <Search size={15} />
            <input className="bt-search-input" placeholder="Tìm kiếm đoàn viên..." />
          </div>
          <button className="btd-bell" title="Thông báo">
            <Bell size={18} />
            <span className="btd-bell__dot" />
          </button>
          <div className="btd-avatar">
            {(user?.name || 'B').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="bt-stats">
        {data.stats.map((stat, i) => (
          <div key={i} className="bt-card bt-stat-card">
            <div className="bt-stat-card__icon" style={{ background: `${stat.color}18`, color: stat.color }}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="bt-stat-card__label">{stat.title}</p>
              <p className="bt-stat-card__value">{stat.value}</p>
              <p className="bt-stat-card__trend">{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Content grid ── */}
      <div className="btd-grid">

        {/* Member table */}
        <div className="bt-card bt-table-card">
          <div className="bt-table-card__header">
            <h3 className="bt-table-card__title">Đoàn viên trong lớp</h3>
            <button className="bt-btn bt-btn--ghost bt-btn--sm">
              Xem tất cả <ArrowRight size={13} />
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="bt-table">
              <thead>
                <tr>
                  <th>Sinh viên</th>
                  <th>MSSV</th>
                  <th>Khoa</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {data.recentMembers.map((row, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="bt-avatar">{row.name.charAt(0)}</div>
                        <span style={{ fontWeight: 600 }}>{row.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--bt-text-muted)' }}>{row.id}</td>
                    <td style={{ color: 'var(--bt-text-muted)' }}>{row.dept}</td>
                    <td>
                      <span className="bt-status" style={{
                        color: row.statusColor,
                        background: `${row.statusColor}15`,
                        border: `1px solid ${row.statusColor}30`,
                      }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications */}
        <div className="bt-card btd-notif-card">
          <h3 className="bt-table-card__title" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--bt-border)' }}>
            Thông báo quan trọng
          </h3>
          <div className="btd-notif-list">
            {data.notifications.map((note, i) => (
              <div key={i} className="btd-notif-item">
                <div className="btd-notif-dot" />
                <div style={{ flex: 1 }}>
                  <p className="btd-notif-title">{note.title}</p>
                  <div className="btd-notif-meta">
                    <span>{note.time}</span>
                    <span className="btd-notif-type">{note.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '1rem 1.5rem' }}>
            <button className="bt-btn bt-btn--primary" style={{ width: '100%', justifyContent: 'center' }}>
              <TrendingUp size={15} /> Xem báo cáo chi đoàn
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BiThuDashboard;
