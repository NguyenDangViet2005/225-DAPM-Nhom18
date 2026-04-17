import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bell,
  ClipboardList,
  GraduationCap,
  Search,
  Users,
} from "lucide-react";
import doanviendangkiAPI from "@/apis/doanviendangki.api";
import { useAuth } from "@/hooks/useAuth";
import "./Dashboard.css";

const HARD_CODED_NOTIFICATIONS = [
  { title: "Tập huấn cán bộ Đoàn 2026", time: "14:00, 10/04", type: "Sự kiện" },
  {
    title: "Báo cáo quyết toán năm 2025",
    time: "Hết hạn: 15/04",
    type: "Nhiệm vụ",
  },
  {
    title: "Ngày hội Hiến máu nhân đạo",
    time: "Cả ngày, 12/04",
    type: "Sự kiện",
  },
];

const STATUS_COLOR = {
  "Chờ duyệt": "#e53e3e",
  "Đã duyệt": "#38a169",
  "Từ chối": "#d69e2e",
};

const formatNumber = (value) =>
  new Intl.NumberFormat("vi-VN").format(value || 0);

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dashboardData, setDashboardData] = useState({
    stats: {
      tongDoanVien: 0,
      tongKhoa: 0,
      tongHoatDongCapTruongConHieuLuc: 0,
      tongHoSoChoDuyet: 0,
    },
    recentMembers: [],
  });

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await doanviendangkiAPI.getDoanTruongDashboard();
        if (!isMounted) return;

        setDashboardData({
          stats: response?.data?.stats || {
            tongDoanVien: 0,
            tongKhoa: 0,
            tongHoatDongCapTruongConHieuLuc: 0,
            tongHoSoChoDuyet: 0,
          },
          recentMembers: response?.data?.recentMembers || [],
        });
      } catch (err) {
        if (!isMounted) return;
        setError(
          err?.response?.data?.message || "Không thể tải dữ liệu dashboard",
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      {
        title: "Tổng Đoàn Viên",
        value: formatNumber(dashboardData.stats.tongDoanVien),
        icon: Users,
        color: "#004F9F",
        trend: "Toàn trường",
      },
      {
        title: "Số lượng Khoa",
        value: formatNumber(dashboardData.stats.tongKhoa),
        icon: GraduationCap,
        color: "#38a169",
        trend: "Đang hoạt động",
      },
      {
        title: "Hoạt Động Cấp Trường",
        value: formatNumber(
          dashboardData.stats.tongHoatDongCapTruongConHieuLuc,
        ),
        icon: Activity,
        color: "#0088cc",
        trend: "Còn hiệu lực",
      },
      {
        title: "Hồ Sơ Chờ Duyệt",
        value: formatNumber(dashboardData.stats.tongHoSoChoDuyet),
        icon: ClipboardList,
        color: "#e53e3e",
        trend: "Đăng ký hoạt động",
      },
    ],
    [dashboardData.stats],
  );

  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return dashboardData.recentMembers;

    const keyword = searchTerm.toLowerCase().trim();
    return dashboardData.recentMembers.filter(
      (row) =>
        row.hoTen?.toLowerCase().includes(keyword) ||
        row.maSV?.toLowerCase().includes(keyword) ||
        row.tenKhoa?.toLowerCase().includes(keyword) ||
        row.tenHD?.toLowerCase().includes(keyword),
    );
  }, [dashboardData.recentMembers, searchTerm]);

  return (
    <div className="dashboard-wrapper">
      {/* ── Main ─────────────────────────────────────────── */}
      <div className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-header__greeting">
            <h2 className="dashboard-header__title">
              Chào mừng trở lại,{" "}
              {(user?.name || "Đoàn Trường").split(" ").pop()}
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
                placeholder="Tìm kiếm đoàn viên chờ duyệt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="dashboard-header__bell" title="Thông báo">
              <Bell size={20} />
              <span className="dashboard-header__bell-dot" />
            </button>
            <div className="dashboard-header__avatar" title={user?.name}>
              {(user?.name || "D").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="dashboard-stats">
          {stats.map((stat, i) => (
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

        {/* Content Grid */}
        <section className="dashboard-content-grid">
          {/* Members Table */}
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h3 className="dashboard-card__title">Đoàn viên mới đăng ký</h3>
              <span className="dashboard-card__action">
                {formatNumber(filteredMembers.length)} hồ sơ
              </span>
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
                {loading && (
                  <tr>
                    <td colSpan={4} className="member-table__muted">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan={4} className="member-table__muted">
                      {error}
                    </td>
                  </tr>
                )}

                {!loading && !error && filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="member-table__muted">
                      Không có hồ sơ chờ duyệt phù hợp
                    </td>
                  </tr>
                )}

                {!loading &&
                  !error &&
                  filteredMembers.map((row, i) => (
                    <tr key={i}>
                      <td>
                        <div className="member-table__name-cell">
                          <div className="member-table__avatar">
                            {(row.hoTen || "D").charAt(0)}
                          </div>
                          {row.hoTen}
                        </div>
                      </td>
                      <td className="member-table__muted">{row.maSV}</td>
                      <td className="member-table__muted">
                        {row.tenKhoa || "—"}
                      </td>
                      <td>
                        <span
                          className="member-table__status"
                          style={{
                            color:
                              STATUS_COLOR[row.trangThaiDuyet] || "#718096",
                            backgroundColor: `${STATUS_COLOR[row.trangThaiDuyet] || "#718096"}15`,
                          }}
                        >
                          {row.trangThaiDuyet}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Notifications */}
          <div className="dashboard-card">
            <h3
              className="dashboard-card__title"
              style={{ marginBottom: "1.5rem" }}
            >
              Thông báo quan trọng
            </h3>
            <div className="notification-list">
              {HARD_CODED_NOTIFICATIONS.map((note, i) => (
                <div key={i} className="notification-item">
                  <p className="notification-item__title">{note.title}</p>
                  <div className="notification-item__meta">
                    <span>{note.time}</span>
                    <span className="notification-item__type">{note.type}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="dashboard-report-btn">Báo cáo thống kê</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
