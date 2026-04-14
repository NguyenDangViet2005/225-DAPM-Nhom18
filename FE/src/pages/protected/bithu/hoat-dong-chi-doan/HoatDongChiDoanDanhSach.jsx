import { useState, useMemo } from "react";
import { Search, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { MOCK_HOAT_DONG, MOCK_DANG_KY_HOAT_DONG } from "@/data/mockHoatDong";
import "./HoatDongChiDoan.css";

const STATUS_CFG = {
  "Đã duyệt": { cls: "hcd-badge--approved", icon: <CheckCircle size={11} /> },
  "Chờ duyệt": { cls: "hcd-badge--pending",  icon: <Clock size={11} /> },
  "Từ chối":   { cls: "hcd-badge--rejected", icon: <XCircle size={11} /> },
};

const HoatDongChiDoanDanhSach = () => {
  const [searchTerm, setSearchTerm]     = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedHD, setSelectedHD]     = useState("all");

  const chiDoanActivities = useMemo(
    () => MOCK_HOAT_DONG.filter((hd) => hd.donViToChuc !== "Đoàn Trường"),
    []
  );

  const registrations = useMemo(() => {
    const ids = chiDoanActivities.map((hd) => hd.idHD);
    return MOCK_DANG_KY_HOAT_DONG.filter((reg) => {
      const matchHD     = selectedHD === "all" || reg.idHD === selectedHD;
      const matchStatus = statusFilter === "all" || reg.trangThaiDuyet === statusFilter;
      const matchSearch =
        reg.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.idDV.includes(searchTerm) ||
        reg.tenHD.toLowerCase().includes(searchTerm.toLowerCase());
      return ids.includes(reg.idHD) && matchHD && matchStatus && matchSearch;
    });
  }, [chiDoanActivities, selectedHD, statusFilter, searchTerm]);

  const total    = registrations.length;
  const pending  = registrations.filter((r) => r.trangThaiDuyet === "Chờ duyệt").length;
  const approved = registrations.filter((r) => r.trangThaiDuyet === "Đã duyệt").length;
  const rejected = registrations.filter((r) => r.trangThaiDuyet === "Từ chối").length;

  return (
    <div className="hcd-page">

      {/* Header */}
      <div className="hcd-header">
        <div>
          <h1 className="hcd-title">Danh sách đăng ký hoạt động</h1>
          <p className="hcd-subtitle">Theo dõi đăng ký của đoàn viên trong chi đoàn</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="hcd-stats">
        {[
          { icon: <Users size={20} />,       label: "Tổng đăng ký", value: total,    color: "#004f9f" },
          { icon: <Clock size={20} />,        label: "Chờ duyệt",   value: pending,  color: "#d97706" },
          { icon: <CheckCircle size={20} />,  label: "Đã duyệt",    value: approved, color: "#16a34a" },
          { icon: <XCircle size={20} />,      label: "Từ chối",     value: rejected, color: "#dc2626" },
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
          <select className="hcd-select" value={selectedHD}
            onChange={(e) => setSelectedHD(e.target.value)}>
            <option value="all">Tất cả hoạt động</option>
            {chiDoanActivities.map((hd) => (
              <option key={hd.idHD} value={hd.idHD}>{hd.tenHD}</option>
            ))}
          </select>
          <div className="hcd-search-wrap">
            <Search size={15} className="hcd-search-icon" />
            <input className="hcd-search-input"
              placeholder="Tìm MSSV hoặc tên đoàn viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select className="hcd-select" value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="Đã duyệt">Đã duyệt</option>
            <option value="Từ chối">Từ chối</option>
          </select>
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
                <th>Lý do từ chối</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg, idx) => {
                const cfg = STATUS_CFG[reg.trangThaiDuyet] || {};
                return (
                  <tr key={`${reg.idDV}-${reg.idHD}-${idx}`}
                    className={idx % 2 === 1 ? "hcd-tr--alt" : ""}>
                    <td className="hcd-td-mssv">{reg.idDV}</td>
                    <td className="hcd-td-name">{reg.hoTen}</td>
                    <td>{reg.tenHD}</td>
                    <td className="hcd-td-muted">
                      {new Date(reg.ngayDangKi).toLocaleDateString("vi-VN")}
                    </td>
                    <td>
                      <span className={`hcd-badge ${cfg.cls}`}>
                        {cfg.icon} {reg.trangThaiDuyet}
                      </span>
                    </td>
                    <td className="hcd-td-reject">{reg.liDoTuChoi || "—"}</td>
                  </tr>
                );
              })}
              {registrations.length === 0 && (
                <tr><td colSpan="6" className="hcd-empty">Không có đăng ký nào phù hợp</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HoatDongChiDoanDanhSach;
