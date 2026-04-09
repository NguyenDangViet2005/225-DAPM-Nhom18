import { useState, useMemo } from 'react';
import { CheckCircle, XCircle, Eye, Calendar, User, Info, FileText } from 'lucide-react';
import { MOCK_YEU_CAU_TU_CHI_DOAN } from '@/data/mockHoatDongKhoa';
import DataTableToolbar from '@/components/commons/DataTableToolbar/DataTableToolbar';
import './YeuCauChiDoan.css';

// Modal chi tiết yêu cầu
const YeuCauDetailModal = ({ show, onClose, request, onApprove, onReject }) => {
  if (!show || !request) return null;
  return (
    <div className="dp-modal-overlay">
      <div className="dp-modal" style={{ width: '650px', maxWidth: '95%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 className="dp-modal-title">Chi tiết Yêu cầu Hoạt động Chi đoàn</h2>
            <div className="yccd-activity-info" style={{ color: '#004f9f', fontWeight: 700 }}>
              Mã yêu cầu: {request.idYC}
            </div>
          </div>
          <button className="yccd-btn" onClick={onClose}>✕</button>
        </div>

        <div className="yccd-modal-body">
          <div className="yccd-modal-field">
            <label>Tên hoạt động</label>
            <div className="yccd-modal-value">{request.tenHD}</div>
          </div>
          <div className="yccd-modal-field">
            <label>Đơn vị đề xuất</label>
            <div className="yccd-modal-value">
              {request.donViYeuCau} – Người gửi: {request.nguoiGui}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="yccd-modal-field">
              <label>Thời gian dự kiến</label>
              <div className="yccd-modal-value">
                {new Date(request.ngayDuKien).toLocaleDateString('vi-VN')}
              </div>
            </div>
            <div className="yccd-modal-field">
              <label>Địa điểm dự kiến</label>
              <div className="yccd-modal-value">{request.diaDiemDuKien}</div>
            </div>
          </div>
          <div className="yccd-modal-field">
            <label>Mô tả / Kế hoạch</label>
            <div className="yccd-modal-value yccd-modal-value--long">{request.moTa}</div>
          </div>
          {request.lyDoTuChoi && (
            <div className="yccd-modal-field">
              <label>Lý do từ chối</label>
              <div className="yccd-modal-value" style={{ color: '#b91c1c' }}>
                {request.lyDoTuChoi}
              </div>
            </div>
          )}
        </div>

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

// ─────────────────────────────────────────────────────────
const YeuCauChiDoan = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedYC, setSelectedYC] = useState(null);

  const filterOptions = [
    { value: 'all',       label: 'Tất cả trạng thái' },
    { value: 'Chờ duyệt', label: 'Đang chờ duyệt' },
    { value: 'Đã duyệt',  label: 'Đã chấp thuận' },
    { value: 'Từ chối',   label: 'Đã từ chối' },
  ];

  const filteredRequests = useMemo(() => {
    return MOCK_YEU_CAU_TU_CHI_DOAN.filter((yc) => {
      const matchSearch =
        yc.tenHD.toLowerCase().includes(searchTerm.toLowerCase()) ||
        yc.donViYeuCau.toLowerCase().includes(searchTerm.toLowerCase());
      const matchFilter = statusFilter === 'all' || yc.trangThaiYC === statusFilter;
      return matchSearch && matchFilter;
    });
  }, [searchTerm, statusFilter]);

  const pendingCount = MOCK_YEU_CAU_TU_CHI_DOAN.filter((yc) => yc.trangThaiYC === 'Chờ duyệt').length;
  const approvedCount = MOCK_YEU_CAU_TU_CHI_DOAN.filter((yc) => yc.trangThaiYC === 'Đã duyệt').length;
  const rejectedCount = MOCK_YEU_CAU_TU_CHI_DOAN.filter((yc) => yc.trangThaiYC === 'Từ chối').length;

  const handleApprove = (yc) => alert(`Đã chấp thuận yêu cầu "${yc.tenHD}"`);
  const handleReject = (yc) => {
    const reason = prompt(`Lý do từ chối "${yc.tenHD}":`);
    if (reason) alert(`Đã từ chối "${yc.tenHD}" – Lý do: ${reason}`);
  };

  return (
    <div className="yccd-container">
      {/* Header */}
      <div className="yccd-header">
        <h1 className="yccd-title">Duyệt Yêu cầu Hoạt động Chi đoàn</h1>
        <div className="yccd-actions">
          <button className="yccd-btn">
            <FileText size={18} /> Lịch sử phê duyệt
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="yccd-stats">
        <div className="yccd-stat-item" style={{ borderLeftColor: '#b45309' }}>
          <span className="yccd-stat-item__label">Chờ duyệt</span>
          <span className="yccd-stat-item__value" style={{ color: '#b45309' }}>
            {pendingCount} yêu cầu
          </span>
        </div>
        <div className="yccd-stat-item" style={{ borderLeftColor: '#15803d' }}>
          <span className="yccd-stat-item__label">Đã chấp thuận</span>
          <span className="yccd-stat-item__value" style={{ color: '#15803d' }}>
            {approvedCount} yêu cầu
          </span>
        </div>
        <div className="yccd-stat-item" style={{ borderLeftColor: '#b91c1c' }}>
          <span className="yccd-stat-item__label">Đã từ chối</span>
          <span className="yccd-stat-item__value" style={{ color: '#b91c1c' }}>
            {rejectedCount} yêu cầu
          </span>
        </div>
        <div className="yccd-stat-item">
          <span className="yccd-stat-item__label">Tổng yêu cầu</span>
          <span className="yccd-stat-item__value">{MOCK_YEU_CAU_TU_CHI_DOAN.length}</span>
        </div>
      </div>

      {/* Toolbar */}
      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm theo tên hoạt động, chi đoàn..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={filterOptions}
      />

      {/* Table */}
      <div className="yccd-card">
        <table className="yccd-table">
          <thead>
            <tr>
              <th>Thông tin hoạt động</th>
              <th>Chi đoàn đề xuất</th>
              <th>Thời gian dự kiến</th>
              <th>Ngày gửi</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((yc) => (
              <tr key={yc.idYC}>
                <td>
                  <span className="yccd-activity-title">{yc.tenHD}</span>
                  <span className="yccd-activity-info">
                    <Info size={12} /> {yc.diaDiemDuKien}
                  </span>
                </td>
                <td>
                  <div className="yccd-activity-info" style={{ fontWeight: 600, color: '#004f9f' }}>
                    <User size={13} /> {yc.donViYeuCau}
                  </div>
                  <div className="yccd-activity-info">{yc.nguoiGui}</div>
                </td>
                <td>
                  <div className="yccd-activity-info">
                    <Calendar size={13} />
                    {new Date(yc.ngayDuKien).toLocaleDateString('vi-VN')}
                  </div>
                </td>
                <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                  {new Date(yc.ngayGui).toLocaleDateString('vi-VN')}
                </td>
                <td>
                  <span className={`yccd-badge ${
                    yc.trangThaiYC === 'Chờ duyệt' ? 'yccd-badge--pending' :
                    yc.trangThaiYC === 'Đã duyệt'  ? 'yccd-badge--approved' :
                    'yccd-badge--rejected'
                  }`}>
                    {yc.trangThaiYC}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="yccd-btn"
                      title="Xem chi tiết"
                      onClick={() => { setSelectedYC(yc); setShowDetail(true); }}
                    >
                      <Eye size={16} />
                    </button>
                    {yc.trangThaiYC === 'Chờ duyệt' && (
                      <>
                        <button
                          className="yccd-btn"
                          style={{ color: '#15803d' }}
                          title="Chấp thuận"
                          onClick={() => handleApprove(yc)}
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          className="yccd-btn"
                          style={{ color: '#b91c1c' }}
                          title="Từ chối"
                          onClick={() => handleReject(yc)}
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredRequests.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  Không tìm thấy yêu cầu phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết */}
      <YeuCauDetailModal
        show={showDetail}
        onClose={() => setShowDetail(false)}
        request={selectedYC}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default YeuCauChiDoan;
