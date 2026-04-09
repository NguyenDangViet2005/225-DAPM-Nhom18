import { useState } from "react";
import { Upload, Save, X } from "lucide-react";
import { MOCK_PROFILE } from "@/data/mockDoanVien";
import "./ThongTinCaNhan.css";

const EDITABLE_FIELDS = ["hoTen", "ngaySinh", "SDT", "email", "diaChi"];

const FIELDS = [
  { label: "Họ và tên", field: "hoTen", type: "text", required: true },
  { label: "Mã sinh viên", field: "idDV", type: "text", required: false },
  { label: "Email", field: "email", type: "email", required: true },
  { label: "Ngày sinh", field: "ngaySinh", type: "date", required: true },
  { label: "Số điện thoại", field: "SDT", type: "text", required: true },
  { label: "Giới tính", field: "gioiTinh", type: "text", required: false },
  {
    label: "Địa chỉ thường trú",
    field: "diaChi",
    type: "text",
    required: true,
  },
  { label: "Chi đoàn", field: "tenChiDoan", type: "text", required: false },
  { label: "Khoa", field: "khoa", type: "text", required: false },
  {
    label: "Ngày vào đoàn",
    field: "ngayVaoDoan",
    type: "date",
    required: false,
  },
  { label: "Chức vụ", field: "chucVu", type: "text", required: false },
  {
    label: "Trạng thái sinh hoạt",
    field: "trangThaiSH",
    type: "text",
    required: false,
  },
];

const ThongTinCaNhan = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...MOCK_PROFILE });

  const handleSave = () => {
    alert("Đã lưu thông tin cá nhân!");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...MOCK_PROFILE });
    setIsEditing(false);
  };

  const initials = formData.hoTen
    ?.split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="ttcn-container">
      <div className="ttcn-header">
        <h1 className="ttcn-title">Thông tin cá nhân</h1>
      </div>

      {/* ── Main content: 2 column layout ──────────────── */}
      <div className="ttcn-main">
        {/* Left: ID Card */}
        <div className="ttcn-left">
          <div className="ttcn-card-box">
            <div className="ttcn-id-card__rect">
              <div className="ttcn-id-card__avatar-rect">{initials}</div>
            </div>
            <button className="ttcn-btn ttcn-btn--primary ttcn-upload-btn">
              <Upload size={16} /> Thay đổi
            </button>
          </div>

          {/* Info box */}
          <div className="ttcn-info-box">
            <div className="ttcn-info-item">
              <label className="ttcn-info-label">Họ và tên:</label>
              <p className="ttcn-info-value">{formData.hoTen}</p>
            </div>
            <div className="ttcn-info-item">
              <label className="ttcn-info-label">MSSV:</label>
              <p className="ttcn-info-value">{formData.idDV}</p>
            </div>
            <div className="ttcn-info-item">
              <label className="ttcn-info-label">Chi đoàn:</label>
              <p className="ttcn-info-value">{formData.tenChiDoan}</p>
            </div>
            <div className="ttcn-info-item">
              <label className="ttcn-info-label">Khoa:</label>
              <p className="ttcn-info-value">{formData.khoa}</p>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="ttcn-right">
          <div className="ttcn-form-section">
            <div className="ttcn-form-header">
              <h2 className="ttcn-form-title">Thông tin chi tiết</h2>
              {!isEditing && (
                <button
                  className="ttcn-btn ttcn-btn--outline ttcn-edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Chỉnh sửa
                </button>
              )}
            </div>

            <div className="ttcn-form-grid">
              {FIELDS.map(({ label, field, type, required }) => (
                <div className="ttcn-form-group" key={field}>
                  <label className="ttcn-form-label">
                    {label}
                    {required && <span className="ttcn-required">*</span>}
                  </label>
                  <input
                    className="ttcn-form-input"
                    type={type}
                    value={formData[field] || ""}
                    disabled={!isEditing || !EDITABLE_FIELDS.includes(field)}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="ttcn-form-actions">
                <button
                  className="ttcn-btn ttcn-btn--ghost"
                  onClick={handleCancel}
                >
                  <X size={15} /> Hủy
                </button>
                <button
                  className="ttcn-btn ttcn-btn--primary"
                  onClick={handleSave}
                >
                  <Save size={15} /> Lưu thay đổi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThongTinCaNhan;
