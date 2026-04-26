import { useState, useEffect, useCallback } from "react";
import { Upload, Save, X } from "lucide-react";
import doanvienAPI from "@/apis/doanvien.api";
import "./ThongTinCaNhan.css";

const EDITABLE_FIELDS = [
  "hoTen", "ngaySinh", "SDT", "email",
  "diaChiThuongTru", "diaChiTamTru",
  "CCCD", "ngayCapCCCD", "noiCapCCCD",
  "danToc", "tonGiao",
];

const FIELDS = [
  { label: "Họ và tên",           field: "hoTen",           type: "text",  required: true  },
  { label: "Mã sinh viên",        field: "idDV",            type: "text",  required: false },
  { label: "Email",               field: "email",           type: "email", required: true  },
  { label: "Ngày sinh",           field: "ngaySinh",        type: "date",  required: true  },
  { label: "Số điện thoại",       field: "SDT",             type: "text",  required: true  },
  { label: "Giới tính",           field: "gioiTinh",        type: "text",  required: false },
  { label: "CCCD",                field: "CCCD",            type: "text",  required: false },
  { label: "Ngày cấp CCCD",       field: "ngayCapCCCD",     type: "date",  required: false },
  { label: "Nơi cấp CCCD",        field: "noiCapCCCD",      type: "text",  required: false },
  { label: "Địa chỉ thường trú",  field: "diaChiThuongTru", type: "text",  required: true  },
  { label: "Địa chỉ tạm trú",     field: "diaChiTamTru",    type: "text",  required: false },
  { label: "Dân tộc",             field: "danToc",          type: "text",  required: false },
  { label: "Tôn giáo",            field: "tonGiao",         type: "text",  required: false },
  { label: "Hệ đào tạo",          field: "heDaoTao",        type: "text",  required: false },
  { label: "Trạng thái học",       field: "trangThaiHoc",    type: "text",  required: false },
  { label: "Chi đoàn",            field: "tenChiDoan",      type: "text",  required: false },
  { label: "Khoa",                field: "tenKhoa",         type: "text",  required: false },
  { label: "Chức vụ",             field: "chucVu",          type: "text",  required: false },
  { label: "Ngày vào đoàn",       field: "ngayVaoDoan",     type: "date",  required: false },
  { label: "Nơi kết nạp",         field: "noiKetNap",       type: "text",  required: false },
  { label: "Điểm hoạt động",      field: "diemHoatDong",    type: "number",required: false },
];

const ThongTinCaNhan = () => {
  const [isEditing, setIsEditing]   = useState(false);
  const [formData, setFormData]     = useState({});
  const [original, setOriginal]     = useState({});
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await doanvienAPI.getMyProfile();
      if (result.success) {
        setFormData(result.data);
        setOriginal(result.data);
      } else {
        setError(result.message || "Không thể tải thông tin");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const payload = {};
      for (const field of EDITABLE_FIELDS) {
        if (formData[field] !== original[field]) {
          payload[field] = formData[field];
        }
      }

      if (Object.keys(payload).length === 0) {
        setIsEditing(false);
        return;
      }

      const result = await doanvienAPI.updateMyProfile(payload);
      if (result.success) {
        setOriginal(result.data);
        setFormData(result.data);
        setSuccessMsg("Cập nhật thông tin thành công!");
        setIsEditing(false);
      } else {
        setError(result.message || "Cập nhật thất bại");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi kết nối server");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...original });
    setIsEditing(false);
    setError(null);
  };

  const initials = formData.hoTen
    ?.split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?";

  if (loading) {
    return (
      <div className="ttcn-container">
        <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
          Đang tải thông tin...
        </div>
      </div>
    );
  }

  return (
    <div className="ttcn-container">
      <div className="ttcn-header">
        <h1 className="ttcn-title">Thông tin cá nhân</h1>
      </div>

      {/* Thông báo */}
      {successMsg && (
        <div style={{ padding: "10px 16px", backgroundColor: "#dcfce7", color: "#15803d", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.9rem" }}>
          {successMsg}
        </div>
      )}
      {error && (
        <div style={{ padding: "10px 16px", backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.9rem" }}>
          {error}
        </div>
      )}

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

          <div className="ttcn-info-box">
            <div className="ttcn-info-item">
              <label className="ttcn-info-label">Họ và tên:</label>
              <p className="ttcn-info-value">{formData.hoTen || "—"}</p>
            </div>
            <div className="ttcn-info-item">
              <label className="ttcn-info-label">MSSV:</label>
              <p className="ttcn-info-value">{formData.idDV || "—"}</p>
            </div>
            <div className="ttcn-info-item">
              <label className="ttcn-info-label">Chi đoàn:</label>
              <p className="ttcn-info-value">{formData.tenChiDoan || "—"}</p>
            </div>
            <div className="ttcn-info-item">
              <label className="ttcn-info-label">Khoa:</label>
              <p className="ttcn-info-value">{formData.tenKhoa || "—"}</p>
            </div>
            <div className="ttcn-info-item">
              <label className="ttcn-info-label">Hệ đào tạo:</label>
              <p className="ttcn-info-value">{formData.heDaoTao || "—"}</p>
            </div>
            <div className="ttcn-info-item">
              <label className="ttcn-info-label">Trạng thái học:</label>
              <p className="ttcn-info-value">{formData.trangThaiHoc || "—"}</p>
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
                  onClick={() => { setIsEditing(true); setSuccessMsg(null); }}
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
                    value={formData[field] ?? ""}
                    disabled={!isEditing || !EDITABLE_FIELDS.includes(field)}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                  />
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="ttcn-form-actions">
                <button className="ttcn-btn ttcn-btn--ghost" onClick={handleCancel} disabled={saving}>
                  <X size={15} /> Hủy
                </button>
                <button className="ttcn-btn ttcn-btn--primary" onClick={handleSave} disabled={saving}>
                  <Save size={15} /> {saving ? "Đang lưu..." : "Lưu thay đổi"}
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
