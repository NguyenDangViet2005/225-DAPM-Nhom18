import { useState, useMemo } from 'react';
import { Send, Calendar, Eye, Trash2 } from 'lucide-react';
import { MOCK_YEU_CAU_GUI_LEN_TRUONG } from '@/data/mockHoatDongKhoa';
import './GuiYeuCau.css';

const GuiYeuCau = () => {
  const [lichSu, setLichSu] = useState(MOCK_YEU_CAU_GUI_LEN_TRUONG);

  // Form state
  const [form, setForm] = useState({
    tenHD: '',
    ngayDuKien: '',
    diaDiemDuKien: '',
    soLuongDuKien: '',
    moTa: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.tenHD || !form.ngayDuKien || !form.diaDiemDuKien) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }
    const newYC = {
      idYC: `YCKT00${lichSu.length + 1}`,
      tenHD: form.tenHD,
      ngayGui: new Date().toISOString(),
      ngayDuKien: form.ngayDuKien,
      diaDiemDuKien: form.diaDiemDuKien,
      moTa: form.moTa,
      soLuongDuKien: parseInt(form.soLuongDuKien) || 0,
      trangThaiYC: 'Chờ duyệt',
      lyDoTuChoi: null,
      nguoiGui: 'Bí thư Liên chi đoàn CNTT',
    };
    setLichSu((prev) => [newYC, ...prev]);
    setForm({ tenHD: '', ngayDuKien: '', diaDiemDuKien: '', soLuongDuKien: '', moTa: '' });
    alert(`Đã gửi yêu cầu "${newYC.tenHD}" lên Đoàn trường thành công!`);
  };

  const handleReset = () => {
    setForm({ tenHD: '', ngayDuKien: '', diaDiemDuKien: '', soLuongDuKien: '', moTa: '' });
  };

  // Stats
  const pendingCount  = useMemo(() => lichSu.filter((yc) => yc.trangThaiYC === 'Chờ duyệt').length, [lichSu]);
  const approvedCount = useMemo(() => lichSu.filter((yc) => yc.trangThaiYC === 'Đã duyệt').length, [lichSu]);
  const rejectedCount = useMemo(() => lichSu.filter((yc) => yc.trangThaiYC === 'Từ chối').length, [lichSu]);

  return (
    <div className="gyc-container">
      {/* Header */}
      <div className="gyc-header">
        <h1 className="gyc-title">Gửi Yêu cầu mở Hoạt động lên Đoàn trường</h1>
      </div>

      {/* Stats */}
      <div className="gyc-stats">
        <div className="gyc-stat-item" style={{ borderLeftColor: '#b45309' }}>
          <span className="gyc-stat-item__label">Đang chờ duyệt</span>
          <span className="gyc-stat-item__value" style={{ color: '#b45309' }}>
            {pendingCount} yêu cầu
          </span>
        </div>
        <div className="gyc-stat-item" style={{ borderLeftColor: '#15803d' }}>
          <span className="gyc-stat-item__label">Đã được duyệt</span>
          <span className="gyc-stat-item__value" style={{ color: '#15803d' }}>
            {approvedCount} yêu cầu
          </span>
        </div>
        <div className="gyc-stat-item" style={{ borderLeftColor: '#b91c1c' }}>
          <span className="gyc-stat-item__label">Bị từ chối</span>
          <span className="gyc-stat-item__value" style={{ color: '#b91c1c' }}>
            {rejectedCount} yêu cầu
          </span>
        </div>
      </div>

      {/* Form tạo yêu cầu mới */}
      <div className="gyc-form-card">
        <h2 className="gyc-form-title">Tạo yêu cầu mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="gyc-form-grid">
            <div className="gyc-form-group gyc-form-group--full">
              <label className="gyc-label">Tên hoạt động *</label>
              <input
                className="gyc-input"
                name="tenHD"
                value={form.tenHD}
                onChange={handleChange}
                placeholder="Nhập tên hoạt động dự kiến..."
                required
              />
            </div>
            <div className="gyc-form-group">
              <label className="gyc-label">Thời gian dự kiến *</label>
              <input
                className="gyc-input"
                type="datetime-local"
                name="ngayDuKien"
                value={form.ngayDuKien}
                onChange={handleChange}
                required
              />
            </div>
            <div className="gyc-form-group">
              <label className="gyc-label">Địa điểm dự kiến *</label>
              <input
                className="gyc-input"
                name="diaDiemDuKien"
                value={form.diaDiemDuKien}
                onChange={handleChange}
                placeholder="Nhập địa điểm tổ chức..."
                required
              />
            </div>
            <div className="gyc-form-group">
              <label className="gyc-label">Số lượng dự kiến</label>
              <input
                className="gyc-input"
                type="number"
                name="soLuongDuKien"
                value={form.soLuongDuKien}
                onChange={handleChange}
                placeholder="Số sinh viên tham gia..."
                min="1"
              />
            </div>
            <div className="gyc-form-group gyc-form-group--full">
              <label className="gyc-label">Mô tả / Kế hoạch</label>
              <textarea
                className="gyc-textarea"
                name="moTa"
                value={form.moTa}
                onChange={handleChange}
                placeholder="Mô tả chi tiết nội dung, mục tiêu và kế hoạch tổ chức..."
              />
            </div>
          </div>
          <div className="gyc-form-actions">
            <button type="button" className="gyc-btn" onClick={handleReset}>
              Xóa form
            </button>
            <button
              type="submit"
              className="gyc-btn"
              style={{ backgroundColor: '#004f9f', borderColor: '#004f9f', color: '#fff' }}
            >
              <Send size={16} /> Gửi yêu cầu
            </button>
          </div>
        </form>
      </div>

      {/* Lịch sử yêu cầu đã gửi */}
      <div className="gyc-card">
        <div className="gyc-card-title">Lịch sử yêu cầu đã gửi</div>
        <table className="gyc-table">
          <thead>
            <tr>
              <th>Tên hoạt động</th>
              <th>Thời gian dự kiến</th>
              <th>Ngày gửi</th>
              <th>Số lượng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {lichSu.map((yc) => (
              <tr key={yc.idYC}>
                <td>
                  <span className="gyc-activity-title">{yc.tenHD}</span>
                  {yc.lyDoTuChoi && (
                    <span className="gyc-activity-info" style={{ color: '#b91c1c' }}>
                      Lý do: {yc.lyDoTuChoi}
                    </span>
                  )}
                </td>
                <td>
                  <div className="gyc-activity-info">
                    <Calendar size={13} />
                    {new Date(yc.ngayDuKien).toLocaleDateString('vi-VN')}
                  </div>
                </td>
                <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                  {new Date(yc.ngayGui).toLocaleDateString('vi-VN')}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {yc.soLuongDuKien > 0 ? `${yc.soLuongDuKien} SV` : '—'}
                </td>
                <td>
                  <span className={`gyc-badge ${
                    yc.trangThaiYC === 'Chờ duyệt' ? 'gyc-badge--pending' :
                    yc.trangThaiYC === 'Đã duyệt'  ? 'gyc-badge--approved' :
                    'gyc-badge--rejected'
                  }`}>
                    {yc.trangThaiYC}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="gyc-btn" title="Xem chi tiết">
                      <Eye size={15} />
                    </button>
                    {yc.trangThaiYC === 'Chờ duyệt' && (
                      <button className="gyc-btn" style={{ color: '#b91c1c' }} title="Hủy yêu cầu">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {lichSu.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  Chưa có yêu cầu nào được gửi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuiYeuCau;
