import { useState, useMemo } from "react";
import { CheckCircle, Search, CalendarCheck } from "lucide-react";
import { MOCK_DANG_KY_HOAT_DONG, MOCK_HOAT_DONG } from "@/data/mockHoatDong";
import "./HoatDongChiDoan.css";

const HoatDongChiDoanXacNhan = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmed, setConfirmed]   = useState({});

  const chiDoanActivityIds = useMemo(
    () => MOCK_HOAT_DONG
      .filter((hd) => hd.donViToChuc !== "Đoàn Trường")
      .map((hd) => hd.idHD),
    []
  );

  const approved = useMemo(
    () => MOCK_DANG_KY_HOAT_DONG.filter(
      (reg) =>
        chiDoanActivityIds.includes(reg.idHD) &&
        reg.trangThaiDuyet === "Đã duyệt" &&
        (reg.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.idDV.includes(searchTerm) ||
          reg.tenHD.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
    [searchTerm, chiDoanActivityIds]
  );

  const confirmedCount = Object.values(confirmed).filter(Boolean).length;
  const pendingCount   = approved.length - confirmedCount;

  const handleConfirm = (key) =>
    setConfirmed((prev) => ({ ...prev, [key]: true }));

  const handleConfirmAll = () => {
    const all = {};
    approved.forEach((r) => { all[`${r.idDV}-${r.idHD}`] = true; });
    setConfirmed(all);
  };

  return (
    <div className="hcd-page">

      {/* Header */}
      <div className="hcd-header">
        <div>
          <h1 className="hcd-title">Xác nhận hoàn thành hoạt động</h1>
          <p className="hcd-subtitle">Xác nhận đoàn viên đã tham gia hoàn thành hoạt động chi đoàn</p>
        </div>
        <button className="hcd-btn hcd-btn--primary" onClick={handleConfirmAll}
          disabled={pendingCount === 0}>
          <CheckCircle size={15} /> Xác nhận tất cả ({pendingCount})
        </button>
      </div>

      {/* Stat Cards */}
      <div className="hcd-stats" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {[
          { icon: <CalendarCheck size={20} />, label: "Chờ xác nhận", value: pendingCount,   color: "#d97706" },
          { icon: <CheckCircle size={20} />,   label: "Đã xác nhận",  value: confirmedCount, color: "#16a34a" },
          { icon: <CalendarCheck size={20} />, label: "Tổng đã duyệt",value: approved.length,color: "#004f9f" },
        ].map((s, i) => (
          <div key={i} className="hcd-stat-card">
            <div className="hcd-stat-card__icon"
              style={{ background: `${s.color}15`, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className="hcd-stat-card__label">{s.label}</p>
              <p className="hcd-stat-card__value">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="hcd-card">

        {/* Toolbar */}
        <div className="hcd-toolbar">
          <div className="hcd-search-wrap">
            <Search size={15} className="hcd-search-icon" />
            <input className="hcd-search-input"
              placeholder="Tìm tên đoàn viên, MSSV hoặc tên hoạt động..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {/* Table */}
        <div className="hcd-table-wrap">
          <table className="hcd-table">
            <thead>
              <tr>
                <th>MSSV</th>
                <th>Họ và Tên</th>
                <th>Hoạt động</th>
                <th>Ngày đăng ký</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {approved.map((reg, idx) => {
                const key       = `${reg.idDV}-${reg.idHD}`;
                const isDone    = !!confirmed[key];
                return (
                  <tr key={`${key}-${idx}`}
                    className={idx % 2 === 1 ? "hcd-tr--alt" : ""}>
                    <td className="hcd-td-mssv">{reg.idDV}</td>
                    <td className="hcd-td-name">{reg.hoTen}</td>
                    <td>{reg.tenHD}</td>
                    <td className="hcd-td-muted">
                      {new Date(reg.ngayDangKi).toLocaleDateString("vi-VN")}
                    </td>
                    <td>
                      {isDone ? (
                        <span className="hcd-badge hcd-badge--approved">
                          <CheckCircle size={11} /> Đã hoàn thành
                        </span>
                      ) : (
                        <span className="hcd-badge hcd-badge--pending">
                          Chờ xác nhận
                        </span>
                      )}
                    </td>
                    <td>
                      {!isDone ? (
                        <button className="hcd-btn hcd-btn--success hcd-btn--sm"
                          onClick={() => handleConfirm(key)}>
                          <CheckCircle size={13} /> Xác nhận
                        </button>
                      ) : (
                        <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Đã xác nhận</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {approved.length === 0 && (
                <tr><td colSpan="6" className="hcd-empty">Không có đoàn viên nào chờ xác nhận</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HoatDongChiDoanXacNhan;
