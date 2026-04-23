const YeuCauStatsSection = ({ requests }) => {
  return (
    <div className="yc-stats">
      <div className="yc-stat-item">
        <span className="yc-stat-item__label">Yêu cầu mới</span>
        <span className="yc-stat-item__value" style={{ color: "#b45309" }}>
          {requests.filter((yc) => yc.trangThaiHD === "Chưa duyệt").length}
        </span>
      </div>
      <div className="yc-stat-item" style={{ borderLeft: "3px solid #15803d" }}>
        <span className="yc-stat-item__label">Đã chấp thuận</span>
        <span className="yc-stat-item__value">
          {requests.filter((yc) => yc.trangThaiHD === "Đã duyệt").length}
        </span>
      </div>
      <div className="yc-stat-item" style={{ borderLeft: "3px solid #004f9f" }}>
        <span className="yc-stat-item__label">Tổng yêu cầu</span>
        <span className="yc-stat-item__value">{requests.length}</span>
      </div>
    </div>
  );
};

export default YeuCauStatsSection;
