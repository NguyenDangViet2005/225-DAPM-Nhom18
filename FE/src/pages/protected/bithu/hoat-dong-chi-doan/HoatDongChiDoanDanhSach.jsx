import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { MOCK_HOAT_DONG, MOCK_DANG_KY_HOAT_DONG } from "@/data/mockHoatDong";
import "./HoatDongChiDoan.css";

const STATUS_CLS = {
  "Đã duyệt": "bt-status--approved",
  "Chờ duyệt": "bt-status--pending",
  "Từ chối": "bt-status--rejected",
};

const HoatDongChiDoanDanhSach = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedHD, setSelectedHD] = useState("all");

  const chiDoanActivities = useMemo(
    () => MOCK_HOAT_DONG.filter((hd) => hd.donViToChuc !== "Đoàn Trường"),
    [],
  );

  const registrations = useMemo(() => {
    const ids = chiDoanActivities.map((hd) => hd.idHD);
    return MOCK_DANG_KY_HOAT_DONG.filter((reg) => {
      const matchHD = selectedHD === "all" || reg.idHD === selectedHD;
      const matchStatus =
        statusFilter === "all" || reg.trangThaiDuyet === statusFilter;
      const matchSearch =
        reg.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.idDV.includes(searchTerm) ||
        reg.tenHD.toLowerCase().includes(searchTerm.toLowerCase());
      return ids.includes(reg.idHD) && matchHD && matchStatus && matchSearch;
    });
  }, [chiDoanActivities, selectedHD, statusFilter, searchTerm]);

  const stats = {
    total: registrations.length,
    pending: registrations.filter((r) => r.trangThaiDuyet === "Chờ duyệt")
      .length,
    approved: registrations.filter((r) => r.trangThaiDuyet === "Đã duyệt")
      .length,
    rejected: registrations.filter((r) => r.trangThaiDuyet === "Từ chối")
      .length,
  };

  return (
    <div className="bt-page">
      <div className="bt-header">
        <div>
          <h1 className="bt-title">Danh sách đăng ký hoạt động</h1>
          <p className="bt-subtitle">
            Theo dõi đăng ký của đoàn viên trong chi đoàn
          </p>
        </div>
      </div>

      <div className="bt-stats">
        {[
          { label: "Tổng đăng ký", value: stats.total, color: "#004f9f" },
          { label: "Chờ duyệt", value: stats.pending, color: "#f59e0b" },
          { label: "Đã duyệt", value: stats.approved, color: "#10b981" },
          { label: "Từ chối", value: stats.rejected, color: "#ef4444" },
        ].map((s, i) => (
          <div key={i} className="bt-card bt-stat-card">
            <div
              className="bt-stat-card__icon"
              style={{ background: `${s.color}18`, color: s.color }}
            >
              <span style={{ fontSize: "1.25rem", fontWeight: 900 }}>
                {s.value}
              </span>
            </div>
            <div>
              <p className="bt-stat-card__label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bt-card" style={{ padding: "0.875rem 1rem" }}>
        <div className="bt-toolbar">
          <select
            className="bt-filter-select"
            value={selectedHD}
            onChange={(e) => setSelectedHD(e.target.value)}
          >
            <option value="all">Tất cả hoạt động</option>
            {chiDoanActivities.map((hd) => (
              <option key={hd.idHD} value={hd.idHD}>
                {hd.tenHD}
              </option>
            ))}
          </select>
          <div className="bt-search-wrap">
            <Search size={15} />
            <input
              className="bt-search-input"
              placeholder="Tìm MSSV, tên đoàn viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="bt-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="Đã duyệt">Đã duyệt</option>
            <option value="Từ chối">Từ chối</option>
          </select>
        </div>
      </div>

      <div className="bt-glass bt-table-card">
        <div style={{ overflowX: "auto" }}>
          <table className="bt-table">
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
              {registrations.map((reg, idx) => (
                <tr key={`${reg.idDV}-${reg.idHD}-${idx}`}>
                  <td style={{ fontWeight: 700, color: "var(--bt-blue)" }}>
                    {reg.idDV}
                  </td>
                  <td style={{ fontWeight: 600 }}>{reg.hoTen}</td>
                  <td>{reg.tenHD}</td>
                  <td style={{ color: "var(--bt-text-muted)" }}>
                    {new Date(reg.ngayDangKi).toLocaleDateString("vi-VN")}
                  </td>
                  <td>
                    <span
                      className={`bt-status ${STATUS_CLS[reg.trangThaiDuyet] || ""}`}
                    >
                      {reg.trangThaiDuyet}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.8rem", color: "var(--bt-red)" }}>
                    {reg.liDoTuChoi || "—"}
                  </td>
                </tr>
              ))}
              {registrations.length === 0 && (
                <tr>
                  <td colSpan="6" className="bt-empty">
                    Không có đăng ký nào phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HoatDongChiDoanDanhSach;
