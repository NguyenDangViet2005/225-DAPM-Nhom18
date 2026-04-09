import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Clock, Send, Wallet, Search } from "lucide-react";
import { MOCK_DOAN_PHI, MOCK_MUC_DOAN_PHI } from "@/data/mockDoanPhi";
import "./DoanPhiLop.css";

const MY_CHI_DOAN = "23110CL1A";

const DoanPhiLop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.endsWith("/gui") ? "gui" : "danh-sach";
  const handleTabChange = (tab) =>
    navigate(
      tab === "gui" ? "/doan-phi-lop/gui" : "/doan-phi-lop/lap-danh-sach",
    );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [checked, setChecked] = useState({});

  const currentRate =
    MOCK_MUC_DOAN_PHI.find((r) => r.trangThai === "Áp dụng") ||
    MOCK_MUC_DOAN_PHI[0];
  const chiDoanMembers = useMemo(
    () => MOCK_DOAN_PHI.filter((p) => p.idChiDoan === MY_CHI_DOAN),
    [],
  );

  const filtered = useMemo(
    () =>
      chiDoanMembers.filter((p) => {
        const matchSearch =
          p.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.idDV.includes(searchTerm);
        const matchStatus =
          statusFilter === "all" || p.trangThai === statusFilter;
        return matchSearch && matchStatus;
      }),
    [chiDoanMembers, searchTerm, statusFilter],
  );

  const daDong = chiDoanMembers.filter((p) => p.trangThai === "Đã đóng").length;
  const chuaDong = chiDoanMembers.length - daDong;
  const tongThu = daDong * currentRate.soTien;
  const toggleCheck = (id) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="bt-page">
      <div className="bt-header">
        <div>
          <h1 className="bt-title">Đoàn phí lớp</h1>
          <p className="bt-subtitle">Quản lý thu đoàn phí chi đoàn</p>
        </div>
        <span className="bt-badge">
          <Wallet size={13} /> Chi đoàn: {MY_CHI_DOAN}
        </span>
      </div>

      {/* Stats */}
      <div className="bt-stats">
        {[
          {
            icon: Wallet,
            label: `Mức phí ${currentRate.namHoc}`,
            value: `${currentRate.soTien.toLocaleString()} ₫`,
            color: "#004f9f",
          },
          {
            icon: CheckCircle,
            label: "Đã đóng",
            value: `${daDong}/${chiDoanMembers.length}`,
            color: "#10b981",
          },
          {
            icon: Clock,
            label: "Chưa đóng",
            value: `${chuaDong}`,
            color: "#ef4444",
          },
          {
            icon: Wallet,
            label: "Tổng đã thu",
            value: `${tongThu.toLocaleString()} ₫`,
            color: "#0369a1",
          },
        ].map((s, i) => (
          <div key={i} className="bt-glass bt-stat-card">
            <div
              className="bt-stat-card__icon"
              style={{ background: `${s.color}18`, color: s.color }}
            >
              <s.icon size={20} />
            </div>
            <div>
              <p className="bt-stat-card__label">{s.label}</p>
              <p className="bt-stat-card__value" style={{ fontSize: "1.3rem" }}>
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bt-tabs">
        {[
          { key: "danh-sach", label: "Lập danh sách thu" },
          { key: "gui", label: "Gửi danh sách nộp" },
        ].map((t) => (
          <button
            key={t.key}
            className={`bt-tab-btn${activeTab === t.key ? " bt-tab-btn--active" : ""}`}
            onClick={() => handleTabChange(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "danh-sach" && (
        <>
          <div className="bt-glass" style={{ padding: "0.875rem 1rem" }}>
            <div className="bt-toolbar">
              <div className="bt-search-wrap">
                <Search size={15} />
                <input
                  className="bt-search-input"
                  placeholder="Tìm MSSV hoặc tên đoàn viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="bt-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="Đã đóng">Đã đóng</option>
                <option value="Chưa đóng">Chưa đóng</option>
              </select>
            </div>
          </div>
          <div className="bt-glass bt-table-card">
            <div style={{ overflowX: "auto" }}>
              <table className="bt-table">
                <thead>
                  <tr>
                    <th>Đánh dấu</th>
                    <th>MSSV</th>
                    <th>Họ và Tên</th>
                    <th>Số tiền</th>
                    <th>Ngày đóng</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.idDoanPhi}>
                      <td>
                        <input
                          type="checkbox"
                          checked={!!checked[p.idDV]}
                          onChange={() => toggleCheck(p.idDV)}
                          disabled={p.trangThai === "Đã đóng"}
                        />
                      </td>
                      <td style={{ fontWeight: 700, color: "var(--bt-blue)" }}>
                        {p.idDV}
                      </td>
                      <td style={{ fontWeight: 600 }}>{p.hoTen}</td>
                      <td>{currentRate.soTien.toLocaleString()} ₫</td>
                      <td>
                        {p.ngayDong
                          ? new Date(p.ngayDong).toLocaleDateString("vi-VN")
                          : "—"}
                      </td>
                      <td>
                        <span
                          className={`bt-status ${p.trangThai === "Đã đóng" ? "bt-status--paid" : "bt-status--unpaid"}`}
                        >
                          {p.trangThai}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan="6" className="bt-empty">
                        Không tìm thấy đoàn viên nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "gui" && (
        <div className="bt-card" style={{ padding: "2.5rem" }}>
          <h3
            className="bt-table-card__title"
            style={{ marginBottom: "0.75rem" }}
          >
            Gửi danh sách nộp đoàn phí lên Đoàn trường
          </h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--bt-text-muted)",
              marginBottom: "1.75rem",
            }}
          >
            Sau khi thu đủ đoàn phí, lập phiếu thu và gửi lên Đoàn trường để xác
            nhận.
          </p>
          <div
            style={{
              border: "1px solid var(--bt-border)",
              padding: "1.5rem",
              marginBottom: "1.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {[
              ["Chi đoàn", MY_CHI_DOAN],
              ["Số đoàn viên đã đóng", `${daDong} / ${chiDoanMembers.length}`],
              ["Tổng tiền", `${tongThu.toLocaleString()} ₫`],
              ["Năm học", currentRate.namHoc],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.875rem",
                  color: "var(--bt-text-muted)",
                }}
              >
                <span>{k}</span>
                <strong style={{ color: "var(--bt-text)" }}>{v}</strong>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: "1.75rem" }}>
            <label
              className="bt-label"
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              Đính kèm minh chứng (PDF/ảnh)
            </label>
            <input
              type="file"
              accept=".pdf,image/*"
              className="bt-input"
              style={{ padding: "0.5rem", width: "100%" }}
            />
          </div>
          <button className="bt-btn bt-btn--primary">
            <Send size={15} /> GỬI DANH SÁCH NỘP
          </button>
        </div>
      )}
    </div>
  );
};

export default DoanPhiLop;
