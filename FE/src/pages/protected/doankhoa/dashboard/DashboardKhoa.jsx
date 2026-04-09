import { useMemo } from "react";
import { Bell, Search } from "lucide-react";
import { getDashboardMockData } from "@/data/mockDashboard";
import { ACTIVITY_STATS_KHOA } from "@/data/mockHoatDongKhoa";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/constants/roles";
import "@/pages/protected/doantruong/dashboard/Dashboard.css";
import "./DashboardKhoa.css";

const DashboardKhoa = () => {
  const { user } = useAuth();
  const dashboardData = useMemo(() => getDashboardMockData(ROLES.DOANKHOA), []);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-header__greeting">
            <h2 className="dashboard-header__title">
              Chào mừng,{" "}
              {(user?.name || "Bí thư Liên chi đoàn").split(" ").pop()}
            </h2>
            <p className="dashboard-header__date">
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="dashboard-header__actions">
            <div className="dashboard-search">
              <Search size={16} className="dashboard-search__icon" />
              <input
                type="text"
                className="dashboard-search__input"
                placeholder="Tìm kiếm hoạt động khoa..."
              />
            </div>
            <button className="dashboard-header__bell" title="Thông báo">
              <Bell size={20} />
              <span className="dashboard-header__bell-dot" />
            </button>
            <div className="dashboard-header__avatar" title={user?.name}>
              {(user?.name || "K").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Stats Grid – từ mockDashboard (DOANKHOA) */}
        <section className="dashboard-stats">
          {dashboardData.stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-card__top">
                <div
                  className="stat-card__icon"
                  style={{
                    backgroundColor: `${stat.color}18`,
                    color: stat.color,
                  }}
                >
                  <stat.icon size={22} />
                </div>
                <span
                  className="stat-card__trend"
                  style={{
                    color: stat.color,
                    backgroundColor: `${stat.color}12`,
                  }}
                >
                  {stat.trend}
                </span>
              </div>
              <p className="stat-card__label">{stat.title}</p>
              <p className="stat-card__value">{stat.value}</p>
              <p className="stat-card__sub">{stat.trend}</p>
            </div>
          ))}
        </section>

        {/* Quick Stats – từ mockHoatDongKhoa */}
        <section className="dkk-quick-stats">
          <div className="dkk-quick-stat-item">
            <span className="dkk-quick-stat__label">Hoạt động đang mở</span>
            <span
              className="dkk-quick-stat__value"
              style={{ color: "#15803d" }}
            >
              {ACTIVITY_STATS_KHOA.dangMo}
            </span>
          </div>
          <div className="dkk-quick-stat-item">
            <span className="dkk-quick-stat__label">Đăng ký chờ duyệt</span>
            <span
              className="dkk-quick-stat__value"
              style={{ color: "#b45309" }}
            >
              {ACTIVITY_STATS_KHOA.choDuyetDK}
            </span>
          </div>
          <div className="dkk-quick-stat-item">
            <span className="dkk-quick-stat__label">Yêu cầu từ chi đoàn</span>
            <span
              className="dkk-quick-stat__value"
              style={{ color: "#0369a1" }}
            >
              {ACTIVITY_STATS_KHOA.yeuCauChiDoanMoi}
            </span>
          </div>
          <div className="dkk-quick-stat-item">
            <span className="dkk-quick-stat__label">Tổng điểm đã cấp</span>
            <span
              className="dkk-quick-stat__value"
              style={{ color: "#004f9f" }}
            >
              {ACTIVITY_STATS_KHOA.tongDiemDaCap}
            </span>
          </div>
        </section>

        {/* Content Grid */}
        <section className="dashboard-content-grid">
          {/* Đoàn viên mới đăng ký */}
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h3 className="dashboard-card__title">
                Đoàn viên mới đăng ký (Khoa)
              </h3>
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
                {dashboardData.recentMembers.map((row, i) => (
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
                        style={{
                          color: row.statusColor,
                          backgroundColor: `${row.statusColor}15`,
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Thông báo */}
          <div className="dashboard-card">
            <h3
              className="dashboard-card__title"
              style={{ marginBottom: "1.5rem" }}
            >
              Thông báo quan trọng
            </h3>
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
            <button className="dashboard-report-btn">
              Báo cáo thống kê khoa
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardKhoa;
