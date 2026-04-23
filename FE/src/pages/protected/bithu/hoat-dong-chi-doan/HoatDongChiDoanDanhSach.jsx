import { useState, useMemo, useEffect } from "react";
import { Search, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { hoatdongAPI } from "@/apis/hoatdong.api";
import doanviendangkiAPI from "@/apis/doanviendangki.api";
import { formatDate } from "@/utils";
import { DANG_KI_STATUS } from "@/constants";
import "./HoatDongChiDoan.css";

const STATUS_CFG = {
  [DANG_KI_STATUS.APPROVED]: { cls: "hcd-badge--approved", icon: <CheckCircle size={11} /> },
  [DANG_KI_STATUS.PENDING]: { cls: "hcd-badge--pending", icon: <Clock size={11} /> },
  [DANG_KI_STATUS.REJECTED]: { cls: "hcd-badge--rejected", icon: <XCircle size={11} /> },
};

const HoatDongChiDoanDanhSach = () => {
  const [searchTerm, setSearchTerm]     = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedHD, setSelectedHD]     = useState("all");

  const [chiDoanActivities, setChiDoanActivities] = useState([]);
  const [allRegistrations, setAllRegistrations]   = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resHD, resReg] = await Promise.all([
          hoatdongAPI.getAllChidoanActivities({ limit: 100 }), // Lấy tối đa để hiển thị filter
          doanviendangkiAPI.getChiDoanRegistrations()
        ]);
        
        if (resHD.success) setChiDoanActivities(resHD.data || []);
        if (resReg.success) setAllRegistrations(resReg.data || []);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const registrations = useMemo(() => {
    return allRegistrations.filter((reg) => {
      const matchHD     = selectedHD === "all" || reg.idHD === selectedHD;
      const matchStatus = statusFilter === "all" || reg.trangThaiDuyet === statusFilter;
      const matchSearch =
        reg.hoTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.idDV?.includes(searchTerm) ||
        reg.tenHD?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchHD && matchStatus && matchSearch;
    });
  }, [allRegistrations, selectedHD, statusFilter, searchTerm]);

  const total    = registrations.length;
  const pending  = registrations.filter((r) => r.trangThaiDuyet === DANG_KI_STATUS.PENDING).length;
  const approved = registrations.filter((r) => r.trangThaiDuyet === DANG_KI_STATUS.APPROVED).length;
  const rejected = registrations.filter((r) => r.trangThaiDuyet === DANG_KI_STATUS.REJECTED).length;

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
            <option value={DANG_KI_STATUS.PENDING}>Chờ duyệt</option>
            <option value={DANG_KI_STATUS.APPROVED}>Đã duyệt</option>
            <option value={DANG_KI_STATUS.REJECTED}>Từ chối</option>
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
                    <td className="hcd-td-muted">{formatDate(reg.ngayDangKi)}</td>
                    <td>
                      <span className={`hcd-badge ${cfg.cls}`}>
                        {cfg.icon} {reg.trangThaiDuyet}
                      </span>
                    </td>
                    <td className="hcd-td-reject">{reg.liDoTuChoi || "—"}</td>
                  </tr>
                );
              })}
              {loading && <tr><td colSpan="6" className="hcd-empty">Đang tải dữ liệu...</td></tr>}
              {!loading && registrations.length === 0 && (
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
