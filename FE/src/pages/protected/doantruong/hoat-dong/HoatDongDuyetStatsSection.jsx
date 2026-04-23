const HoatDongDuyetStatsSection = ({
  pendingRegs,
  approvedRegs,
  rejectedRegs,
  onStatusFilterChange,
}) => {
  return (
    <div className="hd-stats">
      <div
        className="hd-stat-item"
        style={{ borderLeft: "3px solid #b45309", cursor: "pointer" }}
        onClick={() => onStatusFilterChange("Chờ duyệt")}
      >
        <span className="hd-stat-item__label">Chờ xử lý (Cấp trường)</span>
        <span className="hd-stat-item__value" style={{ color: "#b45309" }}>
          {pendingRegs.length} đơn
        </span>
      </div>
      <div
        className="hd-stat-item"
        style={{ borderLeft: "3px solid #15803d", cursor: "pointer" }}
        onClick={() => onStatusFilterChange("Đã duyệt")}
      >
        <span className="hd-stat-item__label">Đã duyệt</span>
        <span className="hd-stat-item__value" style={{ color: "#15803d" }}>
          {approvedRegs.length} đơn
        </span>
      </div>
      <div
        className="hd-stat-item"
        style={{ borderLeft: "3px solid #dc2626", cursor: "pointer" }}
        onClick={() => onStatusFilterChange("Từ chối")}
      >
        <span className="hd-stat-item__label">Từ chối</span>
        <span className="hd-stat-item__value" style={{ color: "#dc2626" }}>
          {rejectedRegs.length} đơn
        </span>
      </div>
    </div>
  );
};

export default HoatDongDuyetStatsSection;
