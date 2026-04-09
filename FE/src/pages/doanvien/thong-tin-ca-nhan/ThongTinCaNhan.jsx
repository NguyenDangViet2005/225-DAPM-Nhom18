import { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { MOCK_PROFILE } from '@/data/mockDoanVien';
import './ThongTinCaNhan.css';

const EDITABLE_FIELDS = ['hoTen', 'ngaySinh', 'SDT', 'email', 'diaChi'];

const FIELDS = [
  { label: 'Họ và tên',            field: 'hoTen',       type: 'text' },
  { label: 'Ngày sinh',            field: 'ngaySinh',    type: 'date' },
  { label: 'Giới tính',            field: 'gioiTinh',    type: 'text' },
  { label: 'Số điện thoại',        field: 'SDT',         type: 'text' },
  { label: 'Email',                field: 'email',       type: 'email' },
  { label: 'Địa chỉ',             field: 'diaChi',      type: 'text' },
  { label: 'Chi đoàn',             field: 'tenChiDoan',  type: 'text' },
  { label: 'Khoa',                 field: 'khoa',        type: 'text' },
  { label: 'Ngày vào đoàn',        field: 'ngayVaoDoan', type: 'date' },
  { label: 'Chức vụ',              field: 'chucVu',      type: 'text' },
  { label: 'Trạng thái sinh hoạt', field: 'trangThaiSH', type: 'text' },
];

const ThongTinCaNhan = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...MOCK_PROFILE });

  const handleSave = () => {
    // TODO: gọi API update profile
    alert('Đã lưu thông tin cá nhân!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...MOCK_PROFILE });
    setIsEditing(false);
  };

  const initials = formData.hoTen
    ?.split(' ')
    .slice(-2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="ttcn-container">
      <div className="ttcn-header">
        <h1 className="ttcn-title">Thông tin cá nhân</h1>
      </div>

      {/* ── Banner ─────────────────────────────────────── */}
      <div className="ttcn-banner">
        <div className="ttcn-avatar">{initials}</div>
        <div className="ttcn-banner-info">
          <h2>{formData.hoTen}</h2>
          <p>MSSV: {formData.idDV} · {formData.tenChiDoan} · {formData.khoa}</p>
        </div>
      </div>

      {/* ── Form ───────────────────────────────────────── */}
      <div className="ttcn-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="ttcn-section-title" style={{ border: 'none', padding: 0 }}>
            Thông tin chi tiết
          </span>
          {!isEditing && (
            <button className="ttcn-btn ttcn-btn--outline" onClick={() => setIsEditing(true)}>
              <Edit2 size={15} /> Chỉnh sửa
            </button>
          )}
        </div>

        <div className="ttcn-form-grid">
          {FIELDS.map(({ label, field, type }) => (
            <div className="ttcn-form-group" key={field}>
              <label className="ttcn-form-label">{label}</label>
              <input
                className="ttcn-form-input"
                type={type}
                value={formData[field] || ''}
                disabled={!isEditing || !EDITABLE_FIELDS.includes(field)}
                onChange={e => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
              />
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="ttcn-form-actions">
            <button className="ttcn-btn ttcn-btn--ghost" onClick={handleCancel}>
              <X size={15} /> Hủy
            </button>
            <button className="ttcn-btn ttcn-btn--primary" onClick={handleSave}>
              <Save size={15} /> Lưu thay đổi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThongTinCaNhan;
