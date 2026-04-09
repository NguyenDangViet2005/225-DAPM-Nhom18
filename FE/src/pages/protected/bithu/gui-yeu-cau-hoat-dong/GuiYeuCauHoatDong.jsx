import { useState } from "react";
import {
  Send,
  PlusCircle,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  Search,
} from "lucide-react";
import { MOCK_YEU_CAU_CHI_DOAN } from "@/data/mockHoatDong";
import "./GuiYeuCauHoatDong.css";

const MY_CHI_DOAN = "23110CL1A";
const MY_NAME = "Nguyễn Văn Bí Thư";
const emptyForm = {
  tenHD: "",
  ngayDuKien: "",
  diaDiemDuKien: "",
  soLuongDuKien: "",
  moTa: "",
};

const STATUS_CLS = {
  "Chờ duyệt": "bt-status--pending",
  "Đã duyệt": "bt-status--approved",
  "Từ chối": "bt-status--rejected",
};

const GuiYeuCauHoatDong = () => {
  const [activeTab, setActiveTab] = useState("danh-sach");
  const [list, setList] = useState(MOCK_YEU_CAU_CHI_DOAN);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.tenHD.trim()) e.tenHD = "Vui lòng nhập tên hoạt động";
    if (!form.ngayDuKien) e.ngayDuKien = "Vui lòng chọn ngày";
    if (!form.diaDiemDuKien.trim()) e.diaDiemDuKien = "Vui lòng nhập địa điểm";
    if (!form.soLuongDuKien || Number(form.soLuongDuKien) < 1)
      e.soLuongDuKien = "Số lượng phải > 0";
    if (!form.moTa.trim()) e.moTa = "Vui lòng nhập mô tả";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setList((prev) => [
      {
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
      },
      ...prev,
    ]);
    setForm(emptyForm);
    setErrors({});
    setSubmitted(true);
    setActiveTab("danh-sach");
  };

  const choDuyet = list.filter((yc) => yc.trangThaiYC === "Chờ duyệt").length;
  const daDuyet = list.filter((yc) => yc.trangThaiYC === "Đã duyệt").length;

  return (
    <div className="bt-page">
      <div className="bt-header">
        <div>
          <h1 className="bt-title">Gửi yêu cầu hoạt động</h1>
          <p className="bt-subtitle">
            Chi đoàn {MY_CHI_DOAN} — Gửi lên Đoàn trường chờ phê duyệt
          </p>
        </div>
        <button
          className="bt-btn bt-btn--primary"
          onClick={() => {
            setSubmitted(false);
            setActiveTab("tao-moi");
          }}
        >
          <PlusCircle size={15} /> Tạo yêu cầu mới
        </button>
      </div>

      <div
        className="bt-stats"
        style={{ gridTemplateColumns: "repeat(3,1fr)" }}
      >
        {[
          {
            icon: Clock,
            label: "Chờ duyệt",
            value: choDuyet,
            color: "#f59e0b",
          },
          {
            icon: CheckCircle,
            label: "Đã duyệt",
            value: daDuyet,
            color: "#10b981",
          },
          {
            icon: Send,
            label: "Tổng đã gửi",
            value: list.length,
            color: "#004f9f",
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
              <p className="bt-stat-card__value" style={{ fontSize: "1.5rem" }}>
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bt-tabs">
        {[
          { key: "danh-sach", label: "Danh sách yêu cầu" },
          { key: "tao-moi", label: "Tạo yêu cầu mới" },
        ].map((t) => (
          <button
            key={t.key}
            className={`bt-tab-btn${activeTab === t.key ? " bt-tab-btn--active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "danh-sach" && (
        <div className="bt-glass bt-table-card">
          {submitted && (
            <div
              className="bt-success-banner"
              style={{ margin: "1rem 1.25rem 0", borderRadius: 10 }}
            >
              <CheckCircle size={15} /> Yêu cầu đã gửi thành công, đang chờ Đoàn
              trường phê duyệt.
            </div>
          )}
          <div style={{ overflowX: "auto" }}>
            <table className="bt-table">
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
                {list.map((yc) => (
                  <tr key={yc.idYC}>
                    <td style={{ fontWeight: 600 }}>{yc.tenHD}</td>
                    <td style={{ color: "var(--bt-text-muted)" }}>
                      {new Date(yc.ngayDuKien).toLocaleDateString("vi-VN")}
                    </td>
                    <td>{yc.diaDiemDuKien}</td>
                    <td>{yc.soLuongDuKien} người</td>
                    <td style={{ color: "var(--bt-text-muted)" }}>
                      {new Date(yc.ngayGui).toLocaleDateString("vi-VN")}
                    </td>
                    <td>
                      <span
                        className={`bt-status ${STATUS_CLS[yc.trangThaiYC]}`}
                      >
                        {yc.trangThaiYC}
                      </span>
                    </td>
                    <td>
                      {yc.trangThaiYC === "Chờ duyệt" && (
                        <button
                          className="bt-btn bt-btn--danger bt-btn--sm"
                          onClick={() =>
                            setList((prev) =>
                              prev.filter((y) => y.idYC !== yc.idYC),
                            )
                          }
                        >
                          <Trash2 size={13} /> Hủy
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan="7" className="bt-empty">
                      Chưa có yêu cầu nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "tao-moi" && (
        <div className="bt-glass" style={{ padding: "2rem" }}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 800,
              color: "var(--bt-text)",
              marginBottom: "0.4rem",
            }}
          >
            Thông tin yêu cầu hoạt động
          </h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--bt-text-muted)",
              marginBottom: "1.5rem",
            }}
          >
            Điền đầy đủ thông tin. Sau khi gửi, Đoàn trường sẽ xem xét và phê
            duyệt.
          </p>
          <form onSubmit={handleSubmit} noValidate>
            <div className="bt-form-grid" style={{ marginBottom: "1.25rem" }}>
              <div className="bt-form-group bt-form-group--full">
                <label className="bt-label">
                  Tên hoạt động <span className="bt-required">*</span>
                </label>
                <input
                  className={`bt-input${errors.tenHD ? " bt-input--error" : ""}`}
                  placeholder="VD: Giao lưu văn nghệ chào mừng 26/3"
                  value={form.tenHD}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tenHD: e.target.value }))
                  }
                />
                {errors.tenHD && (
                  <span className="bt-error-msg">{errors.tenHD}</span>
                )}
              </div>
              <div className="bt-form-group">
                <label className="bt-label">
                  Ngày dự kiến <span className="bt-required">*</span>
                </label>
                <input
                  type="datetime-local"
                  className={`bt-input${errors.ngayDuKien ? " bt-input--error" : ""}`}
                  value={form.ngayDuKien}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, ngayDuKien: e.target.value }))
                  }
                />
                {errors.ngayDuKien && (
                  <span className="bt-error-msg">{errors.ngayDuKien}</span>
                )}
              </div>
              <div className="bt-form-group">
                <label className="bt-label">
                  Số lượng dự kiến <span className="bt-required">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  className={`bt-input${errors.soLuongDuKien ? " bt-input--error" : ""}`}
                  placeholder="VD: 42"
                  value={form.soLuongDuKien}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, soLuongDuKien: e.target.value }))
                  }
                />
                {errors.soLuongDuKien && (
                  <span className="bt-error-msg">{errors.soLuongDuKien}</span>
                )}
              </div>
              <div className="bt-form-group bt-form-group--full">
                <label className="bt-label">
                  Địa điểm <span className="bt-required">*</span>
                </label>
                <input
                  className={`bt-input${errors.diaDiemDuKien ? " bt-input--error" : ""}`}
                  placeholder="VD: Hội trường B"
                  value={form.diaDiemDuKien}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, diaDiemDuKien: e.target.value }))
                  }
                />
                {errors.diaDiemDuKien && (
                  <span className="bt-error-msg">{errors.diaDiemDuKien}</span>
                )}
              </div>
              <div className="bt-form-group bt-form-group--full">
                <label className="bt-label">
                  Mô tả hoạt động <span className="bt-required">*</span>
                </label>
                <textarea
                  className={`bt-textarea${errors.moTa ? " bt-input--error" : ""}`}
                  rows={4}
                  placeholder="Mô tả mục đích, nội dung, ý nghĩa..."
                  value={form.moTa}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, moTa: e.target.value }))
                  }
                />
                {errors.moTa && (
                  <span className="bt-error-msg">{errors.moTa}</span>
                )}
              </div>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.4)",
                borderRadius: 10,
                padding: "0.875rem 1rem",
                marginBottom: "1.25rem",
                display: "flex",
                gap: "2rem",
                fontSize: "0.8rem",
                color: "var(--bt-text-muted)",
              }}
            >
              <span>
                Chi đoàn:{" "}
                <strong style={{ color: "var(--bt-text)" }}>
                  {MY_CHI_DOAN}
                </strong>
              </span>
              <span>
                Người gửi:{" "}
                <strong style={{ color: "var(--bt-text)" }}>{MY_NAME}</strong>
              </span>
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                className="bt-btn bt-btn--ghost"
                onClick={() => {
                  setForm(emptyForm);
                  setErrors({});
                  setActiveTab("danh-sach");
                }}
              >
                Hủy
              </button>
              <button type="submit" className="bt-btn bt-btn--primary">
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
