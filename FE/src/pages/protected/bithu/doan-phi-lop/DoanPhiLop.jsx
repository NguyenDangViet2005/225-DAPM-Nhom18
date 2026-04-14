import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search, Wallet, CheckCircle, AlertTriangle, Send,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Upload,
} from "lucide-react";
import { MOCK_DOAN_PHI, MOCK_MUC_DOAN_PHI } from "@/data/mockDoanPhi";
import "./DoanPhiLop.css";

const MY_CHI_DOAN = "23110CL1A";
const PAGE_SIZE = 5;

/* ── Circle Progress ── */
const CircleProgress = ({ pct, size = 56, stroke = 5 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#004f9f" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        style={{ transform: "rotate(90deg)", transformOrigin: "center", fontSize: 11, fontWeight: 700, fill: "#004f9f" }}>
        {pct}%
      </text>
    </svg>
  );
};

const DoanPhiLop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.endsWith("/gui") ? "gui" : "danh-sach";
  const handleTabChange = (tab) =>
    navigate(tab === "gui" ? "/bi-thu/doan-phi-lop/gui" : "/bi-thu/doan-phi-lop/lap-danh-sach");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [checked, setChecked] = useState({});
  const [page, setPage] = useState(1);

  const currentRate = MOCK_MUC_DOAN_PHI.find((r) => r.trangThai === "Áp dụng") || MOCK_MUC_DOAN_PHI[0];
  const chiDoanMembers = useMemo(() => MOCK_DOAN_PHI.filter((p) => p.idChiDoan === MY_CHI_DOAN), []);

  const filtered = useMemo(() =>
    chiDoanMembers.filter((p) => {
      const matchSearch = p.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) || p.idDV.includes(searchTerm);
      const matchStatus = statusFilter === "all" || p.trangThai === statusFilter;
      return matchSearch && matchStatus;
    }), [chiDoanMembers, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const daDong = chiDoanMembers.filter((p) => p.trangThai === "Đã đóng").length;
  const chuaDong = chiDoanMembers.length - daDong;
  const tongThu = daDong * currentRate.soTien;
  const pct = chiDoanMembers.length > 0 ? Math.round((daDong / chiDoanMembers.length) * 100) : 0;

  const toggleCheck = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const handleSearch = (v) => { setSearchTerm(v); setPage(1); };
  const handleFilter = (v) => { setStatusFilter(v); setPage(1); };

  return (
    <div className="dpl-page">
      {/* ── Page Title ── */}
      <div className="dpl-page-header">
        <div>
          <h1 className="dpl-page-title">Đoàn phí lớp</h1>
          <p className="dpl-page-sub">Quản lý thu đoàn phí chi đoàn &nbsp;·&nbsp; Chi đoàn: <strong>{MY_CHI_DOAN}</strong></p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="dpl-stats">
        {/* Card 1 */}
        <div className="dpl-stat-card">
          <div className="dpl-stat-card__icon dpl-stat-card__icon--blue">
            <Wallet size={20} />
          </div>
          <div>
            <p className="dpl-stat-card__label">Mức phí {currentRate.namHoc}</p>
            <p className="dpl-stat-card__value">{currentRate.soTien.toLocaleString()} ₫</p>
          </div>
        </div>
        {/* Card 2 */}
        <div className="dpl-stat-card">
          <div className="dpl-stat-card__icon dpl-stat-card__icon--green">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="dpl-stat-card__label">Đã đóng</p>
            <p className="dpl-stat-card__value">{daDong}<span className="dpl-stat-card__total">/{chiDoanMembers.length}</span></p>
          </div>
        </div>
        {/* Card 3 */}
        <div className="dpl-stat-card">
          <div className="dpl-stat-card__icon dpl-stat-card__icon--amber">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="dpl-stat-card__label">Chưa đóng</p>
            <p className="dpl-stat-card__value">{chuaDong} <span className="dpl-stat-card__unit">đoàn viên</span></p>
          </div>
        </div>
        {/* Card 4 — with circle progress */}
        <div className="dpl-stat-card dpl-stat-card--progress">
          <div className="dpl-stat-card__icon dpl-stat-card__icon--blue">
            <Wallet size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <p className="dpl-stat-card__label">Tổng đã thu</p>
            <p className="dpl-stat-card__value">{tongThu.toLocaleString()} ₫</p>
          </div>
          <CircleProgress pct={pct} />
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="dpl-tabs-bar">
        <button
          className={`dpl-tab${activeTab === "danh-sach" ? " dpl-tab--active" : ""}`}
          onClick={() => handleTabChange("danh-sach")}
        >
          Lập danh sách thu
        </button>
        <button
          className={`dpl-tab${activeTab === "gui" ? " dpl-tab--active" : ""}`}
          onClick={() => handleTabChange("gui")}
        >
          Gửi danh sách nộp
        </button>
      </div>

      {/* ══ TAB: DANH SÁCH THU ══ */}
      {activeTab === "danh-sach" && (
        <div className="dpl-card">
          {/* Toolbar */}
          <div className="dpl-toolbar">
            <select className="dpl-select" value={statusFilter} onChange={(e) => handleFilter(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="Đã đóng">Đã đóng</option>
              <option value="Chưa đóng">Chưa đóng</option>
            </select>
            <div className="dpl-search-wrap">
              <Search size={15} className="dpl-search-icon" />
              <input
                className="dpl-search-input"
                placeholder="Tìm MSSV hoặc tên đoàn viên..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="dpl-table-wrap">
            <table className="dpl-table">
              <thead>
                <tr>
                  <th style={{ width: 48 }}><input type="checkbox" /></th>
                  <th>MSSV</th>
                  <th>Họ và Tên</th>
                  <th>Số tiền</th>
                  <th>Ngày đóng</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p, idx) => (
                  <tr key={p.idDoanPhi} className={idx % 2 === 1 ? "dpl-tr--alt" : ""}>
                    <td>
                      <input type="checkbox" checked={!!checked[p.idDV]}
                        onChange={() => toggleCheck(p.idDV)} disabled={p.trangThai === "Đã đóng"} />
                    </td>
                    <td className="dpl-td-mssv">{p.idDV}</td>
                    <td className="dpl-td-name">{p.hoTen}</td>
                    <td>{currentRate.soTien.toLocaleString()} ₫</td>
                    <td className="dpl-td-muted">
                      {p.ngayDong ? new Date(p.ngayDong).toLocaleDateString("vi-VN") : "—"}
                    </td>
                    <td>
                      <span className={`dpl-badge ${p.trangThai === "Đã đóng" ? "dpl-badge--green" : "dpl-badge--amber"}`}>
                        {p.trangThai}
                      </span>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr><td colSpan={6} className="dpl-empty">Không tìm thấy đoàn viên nào</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="dpl-pagination">
            <span className="dpl-pagination__info">
              Hiển thị {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} / {filtered.length} kết quả
            </span>
            <div className="dpl-pagination__btns">
              <button className="dpl-pg-btn" onClick={() => setPage(1)} disabled={page === 1}><ChevronsLeft size={14} /></button>
              <button className="dpl-pg-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={14} /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} className={`dpl-pg-btn${page === n ? " dpl-pg-btn--active" : ""}`} onClick={() => setPage(n)}>{n}</button>
              ))}
              <button className="dpl-pg-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight size={14} /></button>
              <button className="dpl-pg-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages}><ChevronsRight size={14} /></button>
            </div>
          </div>
        </div>
      )}

      {/* ══ TAB: GỬI DANH SÁCH NỘP ══ */}
      {activeTab === "gui" && (
        <div className="dpl-card dpl-gui">
          <div className="dpl-gui__header">
            <div className="dpl-gui__icon"><Send size={22} /></div>
            <div>
              <h3 className="dpl-gui__title">Gửi danh sách nộp đoàn phí</h3>
              <p className="dpl-gui__sub">Lập phiếu thu và gửi lên Đoàn trường để xác nhận</p>
            </div>
          </div>

          <div className="dpl-gui__summary">
            {[
              ["Chi đoàn", MY_CHI_DOAN],
              ["Số đoàn viên đã đóng", `${daDong} / ${chiDoanMembers.length}`],
              ["Tổng tiền", `${tongThu.toLocaleString()} ₫`],
              ["Năm học", currentRate.namHoc],
            ].map(([k, v]) => (
              <div key={k} className="dpl-gui__summary-row">
                <span>{k}</span>
                <strong>{v}</strong>
              </div>
            ))}
          </div>

          <div className="dpl-gui__upload-area">
            <Upload size={28} className="dpl-gui__upload-icon" />
            <p className="dpl-gui__upload-text">Kéo thả file hoặc <label className="dpl-gui__upload-link">chọn file<input type="file" accept=".pdf,image/*" hidden /></label></p>
            <p className="dpl-gui__upload-hint">Hỗ trợ PDF, JPG, PNG — tối đa 10MB</p>
          </div>

          <div className="dpl-gui__actions">
            <button className="dpl-btn dpl-btn--outline" onClick={() => handleTabChange("danh-sach")}>
              Quay lại
            </button>
            <button className="dpl-btn dpl-btn--primary">
              <Send size={15} /> Gửi danh sách nộp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoanPhiLop;
