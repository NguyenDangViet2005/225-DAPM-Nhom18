import { useState, useMemo, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Calendar, 
  User,
  Info,
  FileText
} from 'lucide-react';
import hoatdongAPI from '@/apis/hoatdong.api';
import DataTableToolbar from '@/components/commons/DataTableToolbar/DataTableToolbar';
import ActivityRequestDetailModal from '@/components/commons/modals/YeuCauHoatDongDetailModal';
import './YeuCau.css';

const YeuCau = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal State
  const [showDetail, setShowDetail] = useState(false);
  const [selectedYC, setSelectedYC] = useState(null);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('pending'); // 'pending' | 'history'

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const result = await hoatdongAPI.getYeuCauActivities({ page: 1, limit: 1000, status: 'all' });
      if (result.success) {
        setRequests(result.data);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách yêu cầu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    if (!requests) return [];
    return requests.filter(yc => {
      const matchViewMode = viewMode === 'pending' 
        ? yc.trangThaiHD === 'Chưa duyệt' 
        : yc.trangThaiHD !== 'Chưa duyệt'; // History: Đã duyệt, Từ chối

      const searchStr = (searchTerm || '').toLowerCase();
      const matchTen = (yc.tenHD || '').toLowerCase().includes(searchStr);
      const matchDonVi = (yc.donViToChuc || '').toLowerCase().includes(searchStr);
      const matchesSearch = matchTen || matchDonVi;
      
      const matchesFilter = statusFilter === 'all' || yc.trangThaiHD === statusFilter;
      
      return matchViewMode && matchesSearch && matchesFilter;
    });
  }, [searchTerm, statusFilter, requests, viewMode]);

  const filterOptions = viewMode === 'pending' 
    ? [{ value: 'all', label: 'Đang chờ duyệt' }]
    : [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'Đã duyệt', label: 'Đã chấp thuận' },
        { value: 'Từ chối', label: 'Đã từ chối' }
      ];

  const handleOpenDetail = (yc) => {
    setSelectedYC(yc);
    setShowDetail(true);
  };

  const handleApprove = async (yc) => {
    if (window.confirm(`Bạn có chắc chắn muốn phê duyệt hoạt động "${yc.tenHD}" không?`)) {
      try {
        const res = await hoatdongAPI.approveYeuCau(yc.idHD);
        if (res.success) {
          alert(`Đã chấp thuận hoạt động "${yc.tenHD}"`);
          fetchRequests();
        }
      } catch (e) {
        alert("Lỗi khi phê duyệt: " + (e?.response?.data?.message || e.message));
      }
    }
  };

  const handleReject = async (yc) => {
    if (window.confirm(`Bạn có chắc chắn muốn TỪ CHỐI hoạt động "${yc.tenHD}" không?`)) {
      try {
        const res = await hoatdongAPI.rejectYeuCau(yc.idHD);
        if (res.success) {
          alert(`Đã từ chối "${yc.tenHD}"`);
          fetchRequests();
        }
      } catch (e) {
        alert("Lỗi khi từ chối: " + (e?.response?.data?.message || e.message));
      }
    }
  };

  return (
    <div className="yc-container">
      <div className="yc-header">
        <h1 className="yc-title">
          {viewMode === 'pending' ? 'Phê duyệt Yêu cầu mở Hoạt động' : 'Lịch sử phê duyệt'}
        </h1>
        <div className="yc-actions">
           <button 
             className={`yc-update-btn ${viewMode === 'history' ? 'active-history' : ''}`}
             style={{ backgroundColor: viewMode === 'history' ? '#475569' : '' }}
             onClick={() => {
               setViewMode(viewMode === 'pending' ? 'history' : 'pending');
               setStatusFilter('all');
             }}
           >
            <FileText size={18} /> {viewMode === 'pending' ? 'Lịch sử phê duyệt' : 'Quay lại DS Chờ duyệt'}
          </button>
        </div>
      </div>

      <div className="yc-stats">
        <div className="yc-stat-item">
          <span className="yc-stat-item__label">Yêu cầu mới</span>
          <span className="yc-stat-item__value" style={{ color: '#b45309' }}>
            {requests.filter(yc => yc.trangThaiHD === 'Chưa duyệt').length}
          </span>
        </div>
        <div className="yc-stat-item" style={{ borderLeft: '3px solid #15803d' }}>
          <span className="yc-stat-item__label">Đã chấp thuận</span>
          <span className="yc-stat-item__value">{requests.filter(yc => yc.trangThaiHD === 'Đã duyệt').length}</span>
        </div>
        <div className="yc-stat-item" style={{ borderLeft: '3px solid #004f9f' }}>
          <span className="yc-stat-item__label">Tổng yêu cầu</span>
          <span className="yc-stat-item__value">{requests.length}</span>
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
            {loading && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</td></tr>}
            {!loading && filteredRequests.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                Không có dữ liệu {viewMode === 'pending' ? 'yêu cầu chờ duyệt' : 'lịch sử'}.
              </td></tr>
            )}
            {!loading && filteredRequests.map(yc => (
              <tr key={yc.idHD}>
                <td>
                  <div className="yc-name-cell">
                    <span className="yc-activity-title">{yc.tenHD}</span>
                    <span className="yc-activity-info">
                      <Info size={12} /> Tạo ngày: {new Date(yc.createdAt || yc.ngayToChuc).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="yc-activity-info" style={{ fontWeight: 600, color: '#004f9f' }}>
                    <User size={14} /> {yc.donViToChuc || "Không có tên ĐV"}
                  </div>
                </td>
                <td>
                  <div className="yc-activity-info">
                    <Calendar size={14} /> Tổ chức: {new Date(yc.ngayToChuc).toLocaleDateString('vi-VN')}
                  </div>
                </td>
                <td>
                  <span className={`yc-badge ${
                    yc.trangThaiHD === 'Chưa duyệt' ? 'yc-badge--pending' :
                    yc.trangThaiHD === 'Đã duyệt' ? 'yc-badge--approved' : 'yc-badge--rejected'
                  }`}>
                    {yc.trangThaiHD}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="yc-btn-icon" onClick={() => handleOpenDetail(yc)}><Eye size={18} /></button>
                    {yc.trangThaiHD === 'Chưa duyệt' && (
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