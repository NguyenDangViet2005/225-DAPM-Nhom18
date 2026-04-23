import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import hoatdongAPI from '@/apis/hoatdong.api';
import { formatDate } from '@/utils';

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
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (show && request?.idHD) {
        setLoading(true);
        try {
          const result = await hoatdongAPI.getActivityById(request.idHD);
          if (result.success) {
            setDetailData(result.data);
          }
        } catch (error) {
          console.error('Lỗi lấy chi tiết yêu cầu:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDetail();
  }, [show, request]);

  if (!show || !request) return null;

  const displayData = detailData || request;

  return (
    <div className="dp-modal-overlay">
      <div className="dp-modal" style={{ width: '650px', maxWidth: '95%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 className="dp-modal-title">Chi tiết Yêu cầu mở Hoạt động</h2>
            <div className="yc-activity-info" style={{ color: '#004f9f', fontWeight: 700 }}>
              Mã yêu cầu: {displayData.idHD}
            </div>
          </div>
          <button className="dp-update-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</div>
        ) : (
          <div className="yc-modal-body">
            <div className="yc-modal-field">
              <label>Tên hoạt động:</label>
              <div className="yc-modal-value">{displayData.tenHD || 'Chưa có thông tin'}</div>
            </div>
            <div className="yc-modal-field">
              <label>Đơn vị đề xuất:</label>
              <div className="yc-modal-value">{displayData.donViToChuc || 'Chưa có thông tin'}</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="yc-modal-field">
                <label>Thời gian dự kiến:</label>
                <div className="yc-modal-value">
                  {formatDate(displayData.ngayToChuc)}
                </div>
              </div>
              <div className="yc-modal-field">
                <label>Địa điểm dự kiến:</label>
                <div className="yc-modal-value">{displayData.diaDiem || 'Chưa có thông tin'}</div>
              </div>
            </div>

            <div className="yc-modal-field">
              <label>Mô tả / Kế hoạch:</label>
              <div className="yc-modal-value yc-modal-value--long">
                {displayData.moTa || 'Chưa có thông tin'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="yc-modal-field">
                <label>Số lượng tối đa:</label>
                <div className="yc-modal-value">{displayData.soLuongMax || 'Không giới hạn'}</div>
              </div>
              <div className="yc-modal-field">
                <label>Trạng thái:</label>
                <div className="yc-modal-value">{displayData.trangThaiHD || 'Chưa duyệt'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="dp-modal-actions">
          <button className="dp-btn-cancel" onClick={onClose}>Đóng lại</button>
          {displayData.trangThaiHD === 'Chưa duyệt' && (
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
