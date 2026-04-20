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
  
  // History Modal State
  const [showHistoryModal, setShowHistoryModal] = useState(false);

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
      // Main table ONLY shows pending requests
      if (yc.trangThaiHD !== 'Chưa duyệt') return false;

      const searchStr = (searchTerm || '').toLowerCase();
      const matchTen = (yc.tenHD || '').toLowerCase().includes(searchStr);
      const matchDonVi = (yc.donViToChuc || '').toLowerCase().includes(searchStr);
      const matchesSearch = matchTen || matchDonVi;
      
      return matchesSearch;
    });
  }, [searchTerm, requests]);

  // Lấy ra danh sách lịch sử (Đã duyệt / Từ chối) để hiển thị trong Modal
  const historyRequests = useMemo(() => {
    if (!requests) return [];
    return requests.filter(yc => yc.trangThaiHD === 'Đã duyệt' || yc.trangThaiHD === 'Từ chối');
  }, [requests]);

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
        <h1 className="yc-title">Phê duyệt Yêu cầu mở Hoạt động</h1>
        <div className="yc-actions">
           <button 
             className="yc-update-btn"
             onClick={() => setShowHistoryModal(true)}
           >
            <FileText size={18} /> Lịch sử phê duyệt
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
                Không có dữ liệu yêu cầu chờ duyệt.
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
                  <span className="yc-badge yc-badge--pending">Chưa duyệt</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="yc-btn-icon" onClick={() => handleOpenDetail(yc)}><Eye size={18} /></button>
                    <button className="yc-btn-icon yc-btn-icon--approve" onClick={() => handleApprove(yc)}><CheckCircle size={18} /></button>
                    <button className="yc-btn-icon yc-btn-icon--reject" onClick={() => handleReject(yc)}><XCircle size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Modal Lịch Sử Phê Duyệt (Basic View) ────────────────────────── */}
      {showHistoryModal && (
        <div className="modal-overlay" onClick={() => setShowHistoryModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px', width: '90%' }}>
            <div className="modal-header">
              <h2>Lịch sử phê duyệt</h2>
              <button className="modal-close" onClick={() => setShowHistoryModal(false)}><XCircle size={24} /></button>
            </div>
            <div className="modal-body" style={{ maxHeight: '600px', overflowY: 'auto', padding: '20px' }}>
              {historyRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Chưa có lịch sử phê duyệt nào.</div>
              ) : (
                <table className="yc-table">
                  <thead>
                    <tr>
                      <th>Tên HĐ</th>
                      <th>Đơn vị đề xuất</th>
                      <th>Ngày TC</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyRequests.map(yc => (
                      <tr key={yc.idHD}>
                        <td><strong>{yc.tenHD}</strong></td>
                        <td>{yc.donViToChuc || "Không có tên ĐV"}</td>
                        <td>{new Date(yc.ngayToChuc).toLocaleDateString('vi-VN')}</td>
                        <td>
                          <span className={`yc-badge ${yc.trangThaiHD === 'Đã duyệt' ? 'yc-badge--approved' : 'yc-badge--rejected'}`}>
                            {yc.trangThaiHD}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

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