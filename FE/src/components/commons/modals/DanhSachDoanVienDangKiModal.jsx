import { 
  X, 
  Calendar, 
  FileCheck, 
  Users 
} from 'lucide-react';

/**
 * RegistrationListModal - Hiển thị danh sách sinh viên đã đăng ký cho một hoạt động
 * 
 * @param {boolean} show        - Trạng thái đóng/mở modal
 * @param {Function} onClose    - Hàm xử lý đóng modal
 * @param {Object} activity     - Thông tin hoạt động được chọn
 * @param {Array} registrations - Danh sách các đoàn viên (từ API hoặc mock)
 * @param {boolean} loading     - Trạng thái đang tải dữ liệu
 * @param {string} title        - Tiêu đề modal
 */
const RegistrationListModal = ({ 
  show, 
  onClose, 
  activity, 
  registrations = [],
  loading = false,
  title = "Danh sách Tham gia"
}) => {
  if (!show || !activity) return null;

  return (
    <div className="dp-modal-overlay">
      <div className="dp-modal" style={{ width: '800px', maxWidth: '95%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 className="dp-modal-title">{title} - {activity.tenHD}</h2>
            <div className="hd-activity-info" style={{ color: '#15803d', fontWeight: 700 }}>
              <FileCheck size={14} /> Số lượng: {registrations.length}
            </div>
          </div>
          <button className="dp-update-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="hd-card" style={{ marginTop: '1.5rem', maxHeight: '400px', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              Đang tải dữ liệu...
            </div>
          ) : (
            <table className="hd-table">
              <thead>
                <tr>
                  <th>MSSV</th>
                  <th>Họ và Tên</th>
                  <th>Chi đoàn</th>
                  <th>Ngày đăng ký</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg, idx) => (
                  <tr key={`${reg.maSV || reg.idDV}-${idx}`}>
                    <td style={{ fontWeight: 600, color: '#004f9f' }}>{reg.maSV || reg.idDV}</td>
                    <td>{reg.hoTen}</td>
                    <td>{reg.tenChiDoan || '—'}</td>
                    <td>{new Date(reg.ngayDangKy || reg.ngayDangKi).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <span className={`hd-badge ${
                        (reg.trangThai || reg.trangThaiDuyet) === 'Đã duyệt' ? 'hd-badge--open' :
                        (reg.trangThai || reg.trangThaiDuyet) === 'Chờ duyệt' ? 'hd-badge--ongoing' : 'hd-badge--closed'
                      }`}>
                        {reg.trangThai || reg.trangThaiDuyet}
                      </span>
                    </td>
                  </tr>
                ))}
                {registrations.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                      Không có đoàn viên nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="dp-modal-actions">
          <button className="dp-btn-cancel" style={{ flex: 'none', width: '120px' }} onClick={onClose}>Đóng</button>
          <button className="dp-btn-save">Xuất danh sách (Excel)</button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationListModal;
