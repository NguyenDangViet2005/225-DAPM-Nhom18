import { useState, useMemo } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Calendar, 
  User,
  Info,
  FileText
} from 'lucide-react';
import { MOCK_YEU_CAU_HOAT_DONG } from '@/data/mockHoatDong';
import DataTableToolbar from '@/components/commons/DataTableToolbar/DataTableToolbar';
import ActivityRequestDetailModal from '@/components/commons/modals/YeuCauHoatDongDetailModal';
import './YeuCau.css';

const YeuCau = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal State
  const [showDetail, setShowDetail] = useState(false);
  const [selectedYC, setSelectedYC] = useState(null);

  const filteredRequests = useMemo(() => {
    if (!MOCK_YEU_CAU_HOAT_DONG) return [];
    return MOCK_YEU_CAU_HOAT_DONG.filter(yc => {
      const matchesSearch = yc.tenHD.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           yc.donViYeuCau.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = statusFilter === 'all' || yc.trangThaiYC === statusFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, statusFilter]);

  const filterOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'Chờ duyệt', label: 'Đang chờ duyệt' },
    { value: 'Đã duyệt', label: 'Đã chấp thuận' },
    { value: 'Từ chối', label: 'Đã từ chối' }
  ];

  const handleOpenDetail = (yc) => {
    setSelectedYC(yc);
    setShowDetail(true);
  };

  const handleApprove = (yc) => {
    alert(`Đã chấp thuận hoạt động "${yc.tenHD}"`);
    // Thêm logic cập nhật trạng thái tại đây khi có Backend
  };

  const handleReject = (yc) => {
    const reason = prompt(`Lý do từ chối hoạt động "${yc.tenHD}":`);
    if (reason) {
      alert(`Đã từ chối "${yc.tenHD}" với lý do: ${reason}`);
    }
  };

  return (
    <div className="yc-container">
      <div className="yc-header">
        <h1 className="yc-title">Phê duyệt Yêu cầu mở Hoạt động</h1>
        <div className="yc-actions">
           <button className="yc-update-btn">
            <FileText size={18} /> Lịch sử phê duyệt
          </button>
        </div>
      </div>

      <div className="yc-stats">
        <div className="yc-stat-item">
          <span className="yc-stat-item__label">Yêu cầu mới</span>
          <span className="yc-stat-item__value" style={{ color: '#b45309' }}>
            {MOCK_YEU_CAU_HOAT_DONG.filter(yc => yc.trangThaiYC === 'Chờ duyệt').length}
          </span>
        </div>
        <div className="yc-stat-item" style={{ borderLeft: '3px solid #15803d' }}>
          <span className="yc-stat-item__label">Đã duyệt tháng này</span>
          <span className="yc-stat-item__value">12</span>
        </div>
        <div className="yc-stat-item" style={{ borderLeft: '3px solid #004f9f' }}>
          <span className="yc-stat-item__label">Tỷ lệ chấp thuận</span>
          <span className="yc-stat-item__value">92%</span>
        </div>
      </div>

      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm theo tên hoạt động, đơn vị yêu cầu..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={filterOptions}
      />

      <div className="yc-card">
        <table className="yc-table">
          <thead>
            <tr>
              <th>Thông tin hoạt động</th>
              <th>Đơn vị đề xuất</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(yc => (
              <tr key={yc.idYC}>
                <td>
                  <div className="yc-name-cell">
                    <span className="yc-activity-title">{yc.tenHD}</span>
                    <span className="yc-activity-info">
                      <Info size={12} /> {new Date(yc.ngayGui).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="yc-activity-info" style={{ fontWeight: 600, color: '#004f9f' }}>
                    <User size={14} /> {yc.donViYeuCau}
                  </div>
                </td>
                <td>
                  <div className="yc-activity-info">
                    <Calendar size={14} /> {new Date(yc.ngayDuKien).toLocaleDateString('vi-VN')}
                  </div>
                </td>
                <td>
                  <span className={`yc-badge ${
                    yc.trangThaiYC === 'Chờ duyệt' ? 'yc-badge--pending' :
                    yc.trangThaiYC === 'Đã duyệt' ? 'yc-badge--approved' : 'yc-badge--rejected'
                  }`}>
                    {yc.trangThaiYC}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="yc-btn-icon" onClick={() => handleOpenDetail(yc)}><Eye size={18} /></button>
                    {yc.trangThaiYC === 'Chờ duyệt' && (
                      <>
                        <button className="yc-btn-icon yc-btn-icon--approve" onClick={() => handleApprove(yc)}><CheckCircle size={18} /></button>
                        <button className="yc-btn-icon yc-btn-icon--reject" onClick={() => handleReject(yc)}><XCircle size={18} /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Modal Chi tiết ────────────────────────── */}
      <ActivityRequestDetailModal
        show={showDetail}
        onClose={() => setShowDetail(false)}
        request={selectedYC}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default YeuCau;