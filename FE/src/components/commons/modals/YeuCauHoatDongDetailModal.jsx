import { X } from 'lucide-react';

/**
 * 
 * @param {boolean} show - Trạng thái hiển thị
 * @param {function} onClose - Hàm đóng modal
 * @param {object} request - Dữ liệu yêu cầu được chọn
 * @param {function} onApprove - Hàm xử lý chấp thuận (tùy chọn)
 * @param {function} onReject - Hàm xử lý từ chối (tùy chọn)
 */
const ActivityRequestDetailModal = ({ 
  show, 
  onClose, 
  request,
  onApprove,
  onReject 
}) => {
  if (!show || !request) return null;

  return (
    <div className="dp-modal-overlay">
      <div className="dp-modal" style={{ width: '650px', maxWidth: '95%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 className="dp-modal-title">Chi tiết Yêu cầu mở Hoạt động</h2>
            <div className="yc-activity-info" style={{ color: '#004f9f', fontWeight: 700 }}>
              Mã yêu cầu: {request.idYC}
            </div>
          </div>
          <button className="dp-update-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="yc-modal-body">
          <div className="yc-modal-field">
            <label>Tên hoạt động:</label>
            <div className="yc-modal-value">{request.tenHD}</div>
          </div>
          <div className="yc-modal-field">
            <label>Đơn vị đề xuất:</label>
            <div className="yc-modal-value">{request.donViYeuCau} (Người gửi: {request.nguoiGui})</div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="yc-modal-field">
              <label>Thời gian dự kiến:</label>
              <div className="yc-modal-value">{new Date(request.ngayDuKien).toLocaleDateString('vi-VN')}</div>
            </div>
            <div className="yc-modal-field">
              <label>Địa điểm dự kiến:</label>
              <div className="yc-modal-value">{request.diaDiemDuKien}</div>
            </div>
          </div>

          <div className="yc-modal-field">
            <label>Mô tả / Kế hoạch:</label>
            <div className="yc-modal-value yc-modal-value--long">{request.moTa}</div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="dp-modal-actions">
          <button className="dp-btn-cancel" onClick={onClose}>Đóng lại</button>
          {request.trangThaiYC === 'Chờ duyệt' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="dp-btn-reject" 
                onClick={() => { onReject?.(request); onClose(); }}
              >
                Từ chối
              </button>
              <button 
                className="dp-btn-save" 
                onClick={() => { onApprove?.(request); onClose(); }}
              >
                Chấp thuận
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityRequestDetailModal;
