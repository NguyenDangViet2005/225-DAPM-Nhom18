import { useState } from "react";
import {
  Send, PlusCircle, Clock, CheckCircle, XCircle,
  Trash2, CalendarDays, MapPin, Users, FileText,
} from "lucide-react";
import { MOCK_YEU_CAU_CHI_DOAN } from "@/data/mockHoatDong";
import "./GuiYeuCauHoatDong.css";

const MY_CHI_DOAN = "23110CL1A";
const MY_NAME     = "Nguyễn Văn Bí Thư";
const EMPTY_FORM  = { tenHD: "", ngayDuKien: "", diaDiemDuKien: "", soLuongDuKien: "", moTa: "" };

const STATUS_CFG = {
  "Chờ duyệt": { cls: "gyc-badge--pending",  icon: <Clock size={11} /> },
  "Đã duyệt":  { cls: "gyc-badge--approved", icon: <CheckCircle size={11} /> },
  "Từ chối":   { cls: "gyc-badge--rejected", icon: <XCircle size={11} /> },
};

const GuiYeuCauHoatDong = () => {
  const [activeTab, setActiveTab] = useState("danh-sach");
  const [list, setList]           = useState(MOCK_YEU_CAU_CHI_DOAN);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [errors, setErrors]       = useState({});
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.tenHD.trim())                                   e.tenHD = "Vui lòng nhập tên hoạt động";
    if (!form.ngayDuKien)                                     e.ngayDuKien = "Vui lòng chọn ngày dự kiến";
    if (!form.diaDiemDuKien.trim())                           e.diaDiemDuKien = "Vui lòng nhập địa điểm";
    if (!form.soLuongDuKien || Number(form.soLuongDuKien) < 1) e.soLuongDuKien = "Số lượng phải lớn hơn 0";
    if (!form.moTa.trim())                                    e.moTa = "Vui lòng nhập mô tả";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setList((prev) => [{
      idYC: `YCCD${String(prev.length + 1).padStart(3, "0")}`,
      tenHD: form.tenHD,
      idChiDoan: MY_CHI_DOAN,
      donViYeuCau: `Chi đoàn ${MY_CHI_DOAN}`,
      ngayDuKien: new Date(form.ngayDuKien).toISOString(),
      diaDiemDuKien: form.diaDiemDuKien,
      soLuongDuKien: Number(form.soLuongDuKien),
      moTa: form.moTa,
      trangThaiYC: "Chờ duyệt",
      ngayGui: new Date().toISOString(),
      nguoiGui: MY_NAME,
    }, ...prev]);
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitted(true);
    setActiveTab("danh-sach");
  };

  const choDuyet = list.filter((y) => y.trangThaiYC === "Chờ duyệt").length;
  const daDuyet  = list.filter((y) => y.trangThaiYC === "Đã duyệt").length;

  return (
    <div className="gyc-page">

      {/* ── Header ── */}
      <div className="gyc-header">
        <div>
          <h1 className="gyc-title">Gửi yêu cầu hoạt động</h1>
          <p className="gyc-subtitle">Chi đoàn <strong>{MY_CHI_DOAN}</strong> — Gửi lên Đoàn trường chờ phê duyệt</p>
        </div>
        <button className="gyc-btn gyc-btn--primary"
          onClick={() => { setSubmitted(false); setActiveTab("tao-moi"); }}>
          <PlusCircle size={15} /> Tạo yêu cầu mới
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="gyc-stats">
        {[
          { icon: <Clock size={20} />,       label: "Chờ duyệt",   value: choDuyet,    color: "#d97706" },
          { icon: <CheckCircle size={20} />, label: "Đã duyệt",    value: daDuyet,     color: "#16a34a" },
          { icon: <Send size={20} />,        label: "Tổng đã gửi", value: list.length, color: "#004f9f" },
        ].map((s, i) => (
          <div key={i} className="gyc-stat-card">
            <div className="gyc-stat-card__icon" style={{ background: `${s.color}15`, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className="gyc-stat-card__label">{s.label}</p>
              <p className="gyc-stat-card__value">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="gyc-tabs-bar">
        {[
          { key: "danh-sach", label: "Danh sách yêu cầu" },
          { key: "tao-moi",   label: "Tạo yêu cầu mới" },
        ].map((t) => (
          <button key={t.key}
            className={`gyc-tab${activeTab === t.key ? " gyc-tab--active" : ""}`}
            onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ TAB: DANH SÁCH ══ */}
      {activeTab === "danh-sach" && (
        <div className="gyc-card">
          {submitted && (
            <div className="gyc-success-banner">
              <CheckCircle size={15} />
              Yêu cầu đã gửi thành công — đang chờ Đoàn trường phê duyệt.
            </div>
          )}
          <div className="gyc-table-wrap">
            <table className="gyc-table">
              <thead>
                <tr>
                  <th>Tên hoạt động</th>
                  <th>Ngày dự kiến</th>
                  <th>Địa điểm</th>
                  <th>Số lượng</th>
                  <th>Ngày gửi</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {list.map((yc, idx) => {
                  const cfg = STATUS_CFG[yc.trangThaiYC] || {};
                  return (
                    <tr key={yc.idYC} className={idx % 2 === 1 ? "gyc-tr--alt" : ""}>
                      <td className="gyc-td-name">{yc.tenHD}</td>
                      <td className="gyc-td-muted">
                        {new Date(yc.ngayDuKien).toLocaleDateString("vi-VN")}
                      </td>
                      <td>{yc.diaDiemDuKien}</td>
                      <td className="gyc-td-muted">{yc.soLuongDuKien} người</td>
                      <td className="gyc-td-muted">
                        {new Date(yc.ngayGui).toLocaleDateString("vi-VN")}
                      </td>
                      <td>
                        <span className={`gyc-badge ${cfg.cls}`}>
                          {cfg.icon} {yc.trangThaiYC}
                        </span>
                      </td>
                      <td>
                        {yc.trangThaiYC === "Chờ duyệt" ? (
                          <button className="gyc-btn gyc-btn--danger gyc-btn--sm"
                            onClick={() => setList((p) => p.filter((y) => y.idYC !== yc.idYC))}>
                            <Trash2 size={13} /> Hủy
                          </button>
                        ) : (
                          <span className="gyc-td-muted">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {list.length === 0 && (
                  <tr><td colSpan="7" className="gyc-empty">Chưa có yêu cầu nào được gửi</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ TAB: TẠO MỚI ══ */}
      {activeTab === "tao-moi" && (
        <div className="gyc-card gyc-form-card">
          {/* Form header */}
          <div className="gyc-form-header">
            <div className="gyc-form-header__icon"><FileText size={22} /></div>
            <div>
              <h3 className="gyc-form-title">Thông tin yêu cầu hoạt động</h3>
              <p className="gyc-form-sub">Điền đầy đủ thông tin. Đoàn trường sẽ xem xét và phê duyệt sau khi nhận.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="gyc-form">

            {/* Tên hoạt động */}
            <div className="gyc-form-group gyc-form-group--full">
              <label className="gyc-label">Tên hoạt động <span className="gyc-required">*</span></label>
              <input className={`gyc-input${errors.tenHD ? " gyc-input--error" : ""}`}
                placeholder="VD: Giao lưu văn nghệ chào mừng 26/3"
                value={form.tenHD} onChange={set("tenHD")} />
              {errors.tenHD && <span className="gyc-error">{errors.tenHD}</span>}
            </div>

            {/* Ngày + Số lượng */}
            <div className="gyc-form-row">
              <div className="gyc-form-group">
                <label className="gyc-label">
                  <CalendarDays size={13} /> Ngày dự kiến tổ chức <span className="gyc-required">*</span>
                </label>
                <input type="datetime-local"
                  className={`gyc-input${errors.ngayDuKien ? " gyc-input--error" : ""}`}
                  value={form.ngayDuKien} onChange={set("ngayDuKien")} />
                {errors.ngayDuKien && <span className="gyc-error">{errors.ngayDuKien}</span>}
              </div>
              <div className="gyc-form-group">
                <label className="gyc-label">
                  <Users size={13} /> Số lượng dự kiến <span className="gyc-required">*</span>
                </label>
                <input type="number" min="1"
                  className={`gyc-input${errors.soLuongDuKien ? " gyc-input--error" : ""}`}
                  placeholder="VD: 42"
                  value={form.soLuongDuKien} onChange={set("soLuongDuKien")} />
                {errors.soLuongDuKien && <span className="gyc-error">{errors.soLuongDuKien}</span>}
              </div>
            </div>

            {/* Địa điểm */}
            <div className="gyc-form-group gyc-form-group--full">
              <label className="gyc-label">
                <MapPin size={13} /> Địa điểm dự kiến <span className="gyc-required">*</span>
              </label>
              <input className={`gyc-input${errors.diaDiemDuKien ? " gyc-input--error" : ""}`}
                placeholder="VD: Hội trường B, Trường ĐH Sư phạm Kỹ thuật TP.HCM"
                value={form.diaDiemDuKien} onChange={set("diaDiemDuKien")} />
              {errors.diaDiemDuKien && <span className="gyc-error">{errors.diaDiemDuKien}</span>}
            </div>

            {/* Mô tả */}
            <div className="gyc-form-group gyc-form-group--full">
              <label className="gyc-label">Mô tả hoạt động <span className="gyc-required">*</span></label>
              <textarea rows={4}
                className={`gyc-textarea${errors.moTa ? " gyc-input--error" : ""}`}
                placeholder="Mô tả mục đích, nội dung, ý nghĩa của hoạt động..."
                value={form.moTa} onChange={set("moTa")} />
              {errors.moTa && <span className="gyc-error">{errors.moTa}</span>}
            </div>

            {/* Info bar */}
            <div className="gyc-info-bar">
              <span>Chi đoàn: <strong>{MY_CHI_DOAN}</strong></span>
              <span>Người gửi: <strong>{MY_NAME}</strong></span>
            </div>

            {/* Actions */}
            <div className="gyc-form-actions">
              <button type="button" className="gyc-btn gyc-btn--outline"
                onClick={() => { setForm(EMPTY_FORM); setErrors({}); setActiveTab("danh-sach"); }}>
                Hủy
              </button>
              <button type="submit" className="gyc-btn gyc-btn--primary">
                <Send size={14} /> Gửi yêu cầu lên Đoàn trường
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GuiYeuCauHoatDong;
