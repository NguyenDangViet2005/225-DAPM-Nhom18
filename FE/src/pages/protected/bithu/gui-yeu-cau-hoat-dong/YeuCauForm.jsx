import { Send, CalendarDays, MapPin, Users, FileText } from "lucide-react";

const YeuCauForm = ({ form, setForm, errors, handleSubmit, setActiveTab, setErrors, MY_CHI_DOAN, MY_NAME }) => {
  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  return (
    <div className="gyc-card gyc-form-card">
      <div className="gyc-form-header">
        <div className="gyc-form-header__icon">
          <FileText size={22} />
        </div>
        <div>
          <h3 className="gyc-form-title">Thông tin yêu cầu hoạt động</h3>
          <p className="gyc-form-sub">
            Điền đầy đủ thông tin. Đoàn trường sẽ xem xét và phê duyệt sau khi nhận.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="gyc-form">
        {/* Tên hoạt động */}
        <div className="gyc-form-group gyc-form-group--full">
          <label className="gyc-label">
            Tên hoạt động <span className="gyc-required">*</span>
          </label>
          <input
            className={`gyc-input${errors.tenHD ? " gyc-input--error" : ""}`}
            placeholder="VD: Giao lưu văn nghệ chào mừng 26/3"
            value={form.tenHD}
            onChange={set("tenHD")}
          />
          {errors.tenHD && <span className="gyc-error">{errors.tenHD}</span>}
        </div>

        {/* Ngày + Số lượng */}
        <div className="gyc-form-row">
          <div className="gyc-form-group">
            <label className="gyc-label">
              <CalendarDays size={13} /> Ngày dự kiến tổ chức <span className="gyc-required">*</span>
            </label>
            <input
              type="datetime-local"
              className={`gyc-input${errors.ngayDuKien ? " gyc-input--error" : ""}`}
              value={form.ngayDuKien}
              onChange={set("ngayDuKien")}
            />
            {errors.ngayDuKien && <span className="gyc-error">{errors.ngayDuKien}</span>}
          </div>
          <div className="gyc-form-group">
            <label className="gyc-label">
              <Users size={13} /> Số lượng dự kiến <span className="gyc-required">*</span>
            </label>
            <input
              type="number"
              min="1"
              className={`gyc-input${errors.soLuongDuKien ? " gyc-input--error" : ""}`}
              placeholder="VD: 42"
              value={form.soLuongDuKien}
              onChange={set("soLuongDuKien")}
            />
            {errors.soLuongDuKien && <span className="gyc-error">{errors.soLuongDuKien}</span>}
          </div>
        </div>

        {/* Địa điểm */}
        <div className="gyc-form-group gyc-form-group--full">
          <label className="gyc-label">
            <MapPin size={13} /> Địa điểm dự kiến <span className="gyc-required">*</span>
          </label>
          <input
            className={`gyc-input${errors.diaDiemDuKien ? " gyc-input--error" : ""}`}
            placeholder="VD: Hội trường B, Trường ĐH Sư phạm Kỹ thuật TP.HCM"
            value={form.diaDiemDuKien}
            onChange={set("diaDiemDuKien")}
          />
          {errors.diaDiemDuKien && <span className="gyc-error">{errors.diaDiemDuKien}</span>}
        </div>

        {/* Mô tả */}
        <div className="gyc-form-group gyc-form-group--full">
          <label className="gyc-label">
            Mô tả hoạt động <span className="gyc-required">*</span>
          </label>
          <textarea
            rows={4}
            className={`gyc-textarea${errors.moTa ? " gyc-input--error" : ""}`}
            placeholder="Mô tả mục đích, nội dung, ý nghĩa của hoạt động..."
            value={form.moTa}
            onChange={set("moTa")}
          />
          {errors.moTa && <span className="gyc-error">{errors.moTa}</span>}
        </div>

        {/* Info bar */}
        <div className="gyc-info-bar">
          <span>
            Chi đoàn: <strong>{MY_CHI_DOAN}</strong>
          </span>
          <span>
            Người gửi: <strong>{MY_NAME}</strong>
          </span>
        </div>

        {/* Actions */}
        <div className="gyc-form-actions">
          <button
            type="button"
            className="gyc-btn gyc-btn--outline"
            onClick={() => {
              setForm({ tenHD: "", ngayDuKien: "", diaDiemDuKien: "", soLuongDuKien: "", moTa: "" });
              setErrors({});
              setActiveTab("danh-sach");
            }}
          >
            Hủy
          </button>
          <button type="submit" className="gyc-btn gyc-btn--primary">
            <Send size={14} /> Gửi yêu cầu lên Đoàn trường
          </button>
        </div>
      </form>
    </div>
  );
};

export default YeuCauForm;
