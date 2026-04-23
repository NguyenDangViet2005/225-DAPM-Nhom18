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

const DashboardNotifications = () => {
  return (
    <div className="dashboard-card">
      <h3 className="dashboard-card__title" style={{ marginBottom: "1.5rem" }}>
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
  );
};

export default DashboardNotifications;
