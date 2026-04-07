import { useState } from 'react';
import { Send, PlusCircle, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { MOCK_YEU_CAU_CHI_DOAN } from '@/data/mockHoatDong';
import './GuiYeuCauHoatDong.css';

const MY_CHI_DOAN = '23110CL1A';
const MY_NAME = 'Nguyễn Văn Bí Thư';

const STATUS_CONFIG = {
  'Chờ duyệt': { cls: 'yc-badge--pending', icon: <Clock size={12} /> },
  'Đã duyệt':  { cls: 'yc-badge--approved', icon: <CheckCircle size={12} /> },
  'Từ chối':   { cls: 'yc-badge--rejected', icon: <XCircle size={12} /> },
};

const emptyForm = {
  tenHD: '', ngayDuKien: '', diaDiemDuKien: '',
  soLuongDuKien: '', moTa: '',
};

const GuiYeuCauHoatDong = () => {
  const [activeTab, setActiveTab] = useState('danh-sach'); // danh-sach | tao-moi
  const [list, setList] = useState(MOCK_YEU_CAU_CHI_DOAN);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.tenHD.trim()) e.tenHD = 'Vui lòng nhập tên hoạt động';
    if (!form.ngayDuKien) e.ngayDuKien = 'Vui lòng chọn ngày dự kiến';
    if (!form.diaDiemDuKien.trim()) e.diaDiemDuKien = 'Vui lòng nhập địa điểm';
    if (!form.soLuongDuKien || Number(form.soLuongDuKien) < 1) e.soLuongDuKien = 'Số lượng phải lớn hơn 0';
    if (!form.moTa.trim()) e.moTa = 'Vui lòng nhập mô tả';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }

    const newYC = {
      idYC: `YCCD${String(list.length + 1).padStart(3, '0')}`,
      tenHD: form.tenHD,
      idChiDoan: MY_CHI_DOAN,
      donViYeuCau: `Chi đoàn ${MY_CHI_DOAN}`,
      ngayDuKien: new Date(form.ngayDuKien).toISOString(),
      diaDiemDuKien: form.diaDiemDuKien,
      soLuongDuKien: Number(form.soLuongDuKien),
      moTa: form.moTa,
      trangThaiYC: 'Chờ duyệt',
      ngayGui: new Date().toISOString(),
      nguoiGui: MY_NAME,
    };

    setList(prev => [newYC, ...prev]);
    setForm(emptyForm);
    setErrors({});
    setSubmitted(true);
    setActiveTab('danh-sach');
  };

  const handleDelete = (idYC) => {
    setList(prev => prev.filter(yc => yc.idYC !== idYC));
  };

  const choDuyet = list.filter(yc => yc.trangThaiYC === 'Chờ duyệt').length;
  const daDuyet  = list.filter(yc => yc.trangThaiYC === 'Đã duyệt').length;

  return (
    <div className="yc-container">
      <div className="yc-header">
        <div>
          <h1 className="yc-title">Gửi yêu cầu hoạt động chi đoàn</h1>
          <p className="yc-subtitle">Chi đoàn {MY_CHI_DOAN} — Yêu cầu gửi lên Đoàn trường chờ phê duyệt</p>
        </div>
        <button className="yc-btn yc-btn--primary" onClick={() => { setSubmitted(false); setActiveTab('tao-moi'); }}>
          <PlusCircle size={16} /> Tạo yêu cầu mới
        </button>
      </div>

      {/* Stats */}
      <div className="yc-stats">
        <div className="yc-stat-item" style={{ borderLeft: '3px solid #b45309' }}>
          <Clock size={18} style={{ color: '#b45309' }} />
          <div>
            <span className="yc-stat-label">Chờ duyệt</span>
            <span className="yc-stat-value">{choDuyet} yêu cầu</span>
          </div>
        </div>
        <div className="yc-stat-item" style={{ borderLeft: '3px solid #15803d' }}>
          <CheckCircle size={18} style={{ color: '#15803d' }} />
          <div>
            <span className="yc-stat-label">Đã được duyệt</span>
            <span className="yc-stat-value">{daDuyet} yêu cầu</span>
          </div>
        </div>
        <div className="yc-stat-item" style={{ borderLeft: '3px solid #004f9f' }}>
          <Send size={18} style={{ color: '#004f9f' }} />
          <div>
            <span className="yc-stat-label">Tổng đã gửi</span>
            <span className="yc-stat-value">{list.length} yêu cầu</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="yc-tabs">
        {[{ key: 'danh-sach', label: 'Danh sách yêu cầu' }, { key: 'tao-moi', label: 'Tạo yêu cầu mới' }].map(t => (
          <button key={t.key} className={`yc-tab-btn${activeTab === t.key ? ' yc-tab-btn--active' : ''}`}
            onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Danh sách */}
      {activeTab === 'danh-sach' && (
        <div className="yc-card">
          {submitted && (
            <div className="yc-success-banner">
              <CheckCircle size={16} /> Yêu cầu đã được gửi thành công, đang chờ Đoàn trường phê duyệt.
            </div>
          )}
          <table className="yc-table">
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
              {list.map(yc => {
                const cfg = STATUS_CONFIG[yc.trangThaiYC] || {};
                return (
                  <tr key={yc.idYC}>
                    <td style={{ fontWeight: 600, color: '#0d1f3c' }}>{yc.tenHD}</td>
                    <td>{new Date(yc.ngayDuKien).toLocaleDateString('vi-VN')}</td>
                    <td>{yc.diaDiemDuKien}</td>
                    <td>{yc.soLuongDuKien} người</td>
                    <td>{new Date(yc.ngayGui).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <span className={`yc-badge ${cfg.cls}`}>
                        {cfg.icon} {yc.trangThaiYC}
                      </span>
                    </td>
                    <td>
                      {yc.trangThaiYC === 'Chờ duyệt' && (
                        <button className="yc-btn yc-btn--danger" onClick={() => handleDelete(yc.idYC)}>
                          <Trash2 size={14} /> Hủy
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {list.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    Chưa có yêu cầu nào được gửi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Tạo mới */}
      {activeTab === 'tao-moi' && (
        <div className="yc-card yc-form-card">
          <h3 className="yc-form-title">Thông tin yêu cầu hoạt động</h3>
          <p className="yc-form-desc">
            Điền đầy đủ thông tin bên dưới. Sau khi gửi, Đoàn trường sẽ xem xét và phê duyệt.
          </p>
          <form onSubmit={handleSubmit} className="yc-form" noValidate>
            <div className="yc-form-row">
              <div className="yc-form-group yc-form-group--full">
                <label className="yc-label">Tên hoạt động <span className="yc-required">*</span></label>
                <input className={`yc-input${errors.tenHD ? ' yc-input--error' : ''}`}
                  placeholder="VD: Giao lưu văn nghệ chào mừng 26/3"
                  value={form.tenHD}
                  onChange={e => setForm(p => ({ ...p, tenHD: e.target.value }))} />
                {errors.tenHD && <span className="yc-error-msg">{errors.tenHD}</span>}
              </div>
            </div>

            <div className="yc-form-row">
              <div className="yc-form-group">
                <label className="yc-label">Ngày dự kiến tổ chức <span className="yc-required">*</span></label>
                <input type="datetime-local" className={`yc-input${errors.ngayDuKien ? ' yc-input--error' : ''}`}
                  value={form.ngayDuKien}
                  onChange={e => setForm(p => ({ ...p, ngayDuKien: e.target.value }))} />
                {errors.ngayDuKien && <span className="yc-error-msg">{errors.ngayDuKien}</span>}
              </div>
              <div className="yc-form-group">
                <label className="yc-label">Số lượng dự kiến <span className="yc-required">*</span></label>
                <input type="number" min="1" className={`yc-input${errors.soLuongDuKien ? ' yc-input--error' : ''}`}
                  placeholder="VD: 42"
                  value={form.soLuongDuKien}
                  onChange={e => setForm(p => ({ ...p, soLuongDuKien: e.target.value }))} />
                {errors.soLuongDuKien && <span className="yc-error-msg">{errors.soLuongDuKien}</span>}
              </div>
            </div>

            <div className="yc-form-row">
              <div className="yc-form-group yc-form-group--full">
                <label className="yc-label">Địa điểm dự kiến <span className="yc-required">*</span></label>
                <input className={`yc-input${errors.diaDiemDuKien ? ' yc-input--error' : ''}`}
                  placeholder="VD: Hội trường B, Trường ĐH Sư phạm Kỹ thuật"
                  value={form.diaDiemDuKien}
                  onChange={e => setForm(p => ({ ...p, diaDiemDuKien: e.target.value }))} />
                {errors.diaDiemDuKien && <span className="yc-error-msg">{errors.diaDiemDuKien}</span>}
              </div>
            </div>

            <div className="yc-form-row">
              <div className="yc-form-group yc-form-group--full">
                <label className="yc-label">Mô tả hoạt động <span className="yc-required">*</span></label>
                <textarea className={`yc-textarea${errors.moTa ? ' yc-input--error' : ''}`}
                  rows={4}
                  placeholder="Mô tả mục đích, nội dung, ý nghĩa của hoạt động..."
                  value={form.moTa}
                  onChange={e => setForm(p => ({ ...p, moTa: e.target.value }))} />
                {errors.moTa && <span className="yc-error-msg">{errors.moTa}</span>}
              </div>
            </div>

            <div className="yc-form-info">
              <span>Chi đoàn: <strong>{MY_CHI_DOAN}</strong></span>
              <span>Người gửi: <strong>{MY_NAME}</strong></span>
            </div>

            <div className="yc-form-actions">
              <button type="button" className="yc-btn yc-btn--secondary"
                onClick={() => { setForm(emptyForm); setErrors({}); setActiveTab('danh-sach'); }}>
                Hủy
              </button>
              <button type="submit" className="yc-btn yc-btn--primary">
                <Send size={15} /> Gửi yêu cầu lên Đoàn trường
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GuiYeuCauHoatDong;
