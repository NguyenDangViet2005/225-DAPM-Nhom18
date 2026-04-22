import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search, Wallet, CheckCircle, AlertTriangle, Send,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Upload,
} from "lucide-react";
import AuthContext from "@/contexts/AuthContext";
import { getDoanPhiStatsAPI, getDoanPhiAPI, createPhieuThuAPI } from "@/apis/doanphi.api";
import "./DoanPhiLop.css";

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
  const { user } = useContext(AuthContext);
  const myChiDoan = user?.idChiDoan || "Unknown";

  const activeTab = location.pathname.endsWith("/gui") ? "gui" : "danh-sach";
  const handleTabChange = (tab) =>
    navigate(tab === "gui" ? "/bi-thu/doan-phi-lop/gui" : "/bi-thu/doan-phi-lop/lap-danh-sach");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [checked, setChecked] = useState({});
  const [page, setPage] = useState(1);

  const [stats, setStats] = useState({
    tongDoanVien: 0, daDong: 0, chuaDong: 0, dangChoDuyet: 0,
    tongDaThu: 0, tongPhaiThu: 0, namHoc: "", soTien: 0, tyLe: 0
  });
  const [doanPhiList, setDoanPhiList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    if (!myChiDoan || myChiDoan === "Unknown") return;
    try {
      const res = await getDoanPhiStatsAPI({ idChiDoan: myChiDoan });
      if (res.success) setStats(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchList = async () => {
    if (!myChiDoan || myChiDoan === "Unknown") return;
    setLoading(true);
    try {
      const res = await getDoanPhiAPI({
        search: searchTerm,
        trangThai: statusFilter,
        idChiDoan: myChiDoan,
        page,
        limit: PAGE_SIZE
      });
      if (res.success) {
        setDoanPhiList(res.data);
        setTotalPages(res.pagination?.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [myChiDoan]);

  useEffect(() => {
    fetchList();
  }, [searchTerm, statusFilter, page, myChiDoan]);

  const toggleCheck = (idDoanPhi) => setChecked((prev) => ({ ...prev, [idDoanPhi]: !prev[idDoanPhi] }));
  const handleSearch = (v) => { setSearchTerm(v); setPage(1); };
  const handleFilter = (v) => { setStatusFilter(v); setPage(1); };

  const selectedList = Object.keys(checked).filter((k) => checked[k]);
  const selectedCount = selectedList.length;
  const moneyToSubmit = selectedCount * stats.soTien;

  const handleSubmit = async () => {
    if (selectedCount === 0) return alert("Vui lòng chọn ít nhất 1 đoàn viên đã nộp phí!");
    try {
      const res = await createPhieuThuAPI({
        listIdDoanPhi: selectedList,
        fileDinhKem: "minh_chung_nop_tien.pdf" // Dummy file
      });
      if (res.success) {
        alert("Gửi danh sách nộp thành công! Vui lòng chờ Đoàn trường duyệt.");
        setChecked({});
        fetchStats();
        fetchList();
        handleTabChange("danh-sach");
      }
    } catch (e) {
      alert("Có lỗi xảy ra: " + (e.message || ""));
    }
  };

  return (
    <div className="dpl-page">
      {/* ── Page Title ── */}
      <div className="dpl-page-header">
        <div>
          <h1 className="dpl-page-title">Đoàn phí lớp</h1>
          <p className="dpl-page-sub">Quản lý thu đoàn phí chi đoàn &nbsp;·&nbsp; Chi đoàn: <strong>{myChiDoan !== "Unknown" ? user?.chiDoan?.tenChiDoan || myChiDoan : "..."}</strong></p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="dpl-stats">
        <div className="dpl-stat-card">
          <div className="dpl-stat-card__icon dpl-stat-card__icon--blue">
            <Wallet size={20} />
          </div>
          <div>
            <p className="dpl-stat-card__label">Mức phí {stats.namHoc}</p>
            <p className="dpl-stat-card__value">{stats.soTien.toLocaleString()} ₫</p>
          </div>
        </div>
        <div className="dpl-stat-card">
          <div className="dpl-stat-card__icon dpl-stat-card__icon--green">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="dpl-stat-card__label">Đã đóng</p>
            <p className="dpl-stat-card__value">{stats.daDong}<span className="dpl-stat-card__total">/{stats.tongDoanVien}</span></p>
          </div>
        </div>
        <div className="dpl-stat-card">
          <div className="dpl-stat-card__icon dpl-stat-card__icon--amber">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="dpl-stat-card__label">Chưa đóng / Chờ duyệt</p>
            <p className="dpl-stat-card__value">{stats.chuaDong} / {stats.dangChoDuyet} <span className="dpl-stat-card__unit">đoàn viên</span></p>
          </div>
        </div>
        <div className="dpl-stat-card dpl-stat-card--progress">
          <div className="dpl-stat-card__icon dpl-stat-card__icon--blue">
            <Wallet size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <p className="dpl-stat-card__label">Tổng đã thu (được duyệt)</p>
            <p className="dpl-stat-card__value">{stats.tongDaThu.toLocaleString()} ₫</p>
          </div>
          <CircleProgress pct={stats.tyLe || 0} />
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
          Gửi danh sách nộp {selectedCount > 0 && `(${selectedCount})`}
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
              <option value="Đang chờ duyệt">Đang chờ duyệt</option>
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
                  <th style={{ width: 48 }}></th>
                  <th>MSSV</th>
                  <th>Họ và Tên</th>
                  <th>Số tiền</th>
                  <th>Ngày đóng</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="dpl-empty">Đang tải dữ liệu...</td></tr>
                ) : doanPhiList.map((p, idx) => (
                  <tr key={p.idDoanPhi} className={idx % 2 === 1 ? "dpl-tr--alt" : ""}>
                    <td>
                      <input type="checkbox" checked={!!checked[p.idDoanPhi]}
                        onChange={() => toggleCheck(p.idDoanPhi)} disabled={p.trangThai === "Đã đóng" || p.trangThai === "Đang chờ duyệt"} />
                    </td>
                    <td className="dpl-td-mssv">{p.doanVien?.idDV || p.idDV}</td>
                    <td className="dpl-td-name">{p.doanVien?.hoTen}</td>
                    <td>{stats.soTien.toLocaleString()} ₫</td>
                    <td className="dpl-td-muted">
                      {p.ngayDong ? new Date(p.ngayDong).toLocaleDateString("vi-VN") : "—"}
                    </td>
                    <td>
                      <span className={`dpl-badge ${p.trangThai === "Đã đóng" ? "dpl-badge--green" : p.trangThai === "Đang chờ duyệt" ? "dpl-badge--blue" : "dpl-badge--amber"}`}>
                        {p.trangThai}
                      </span>
                    </td>
                  </tr>
                ))}
                {!loading && doanPhiList.length === 0 && (
                  <tr><td colSpan={6} className="dpl-empty">Không tìm thấy đoàn viên nào</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="dpl-pagination">
            <span className="dpl-pagination__info">
              Trang {page} / {totalPages}
            </span>
            <div className="dpl-pagination__btns">
              <button className="dpl-pg-btn" onClick={() => setPage(1)} disabled={page === 1}><ChevronsLeft size={14} /></button>
              <button className="dpl-pg-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={14} /></button>
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
              <h3 className="dpl-gui__title">Gửi phiếu thu đoàn phí</h3>
              <p className="dpl-gui__sub">Xác nhận những đoàn viên vừa chọn để lập thành phiếu nộp lên Đoàn trường</p>
            </div>
          </div>

          <div className="dpl-gui__summary">
            {[
              ["Số đoàn viên được chọn nộp", `${selectedCount} người`],
              ["Tổng tiền trên phiếu thu", `${moneyToSubmit.toLocaleString()} ₫`],
              ["Năm học", stats.namHoc],
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
              Quay lại danh sách
            </button>
            <button className="dpl-btn dpl-btn--primary" onClick={handleSubmit} disabled={selectedCount === 0}>
              <Send size={15} /> Xác nhận gửi phiếu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoanPhiLop;
