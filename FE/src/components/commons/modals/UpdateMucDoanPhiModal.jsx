/**
 * UpdateFeeModal - Modal cập nhật mức đoàn phí mới cho toàn trường
 */

const UpdateFeeModal = ({ 
  show, 
  onClose, 
  onConfirm, 
  feeValue, 
  setFeeValue 
}) => {
  if (!show) return null;

  return (
    <div className="dp-modal-overlay">
      <div className="dp-modal">
        <div>
          <h2 className="dp-modal-title">Cập nhật mức Đoàn phí mới</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Lưu ý: Mức thu mới sẽ được áp dụng cho toàn bộ đoàn viên trong hệ thống cho năm học tiếp theo.
          </p>
        </div>
        
        <div className="dp-form-group">
          <label className="dp-form-label">Năm học áp dụng</label>
          <input type="text" className="dp-form-input" defaultValue="2025-2026" />
        </div>

        <div className="dp-form-group">
          <label className="dp-form-label">Số tiền thu (VNĐ)</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="number" 
              className="dp-form-input" 
              style={{ width: '100%' }}
              value={feeValue}
              onChange={(e) => setFeeValue(e.target.value)}
            />
          </div>
        </div>

        <div className="dp-modal-actions">
          <button className="dp-btn-cancel" onClick={onClose}>Hủy bỏ</button>
          <button className="dp-btn-save" onClick={onConfirm}>Xác nhận áp dụng</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateFeeModal;
