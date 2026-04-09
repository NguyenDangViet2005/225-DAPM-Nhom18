import { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Download, 
  Settings, 
  CheckCircle, 
  Clock, 
  TrendingUp,
} from 'lucide-react';
import { MOCK_MUC_DOAN_PHI, MOCK_DOAN_PHI, MOCK_PHIEU_THU } from '@/data/mockDoanPhi';
import UpdateFeeModal from '@/components/commons/modals/UpdateMucDoanPhiModal';
import DataTableToolbar from '@/components/commons/DataTableToolbar/DataTableToolbar';
import './DoanPhi.css';

const DoanPhi = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('payments'); // payments | receipts | rates
  
  // State cho việc cập nhật mức đoàn phí
  const [showUpdateFee, setShowUpdateFee] = useState(false);
  const [newFee, setNewFee] = useState(60000);

  // Lấy mức đoàn phí hiện tại
  const currentRate = MOCK_MUC_DOAN_PHI.find(r => r.trangThai === 'Áp dụng') || MOCK_MUC_DOAN_PHI[0];

  // Logic lọc dữ liệu cho bảng đoàn viên
  const filteredPayments = useMemo(() => {
    return MOCK_DOAN_PHI.filter(p => {
      const matchesSearch = p.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.idDV.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || p.trangThai === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const stats = {
    tongPhaiThu: (MOCK_DOAN_PHI.length * currentRate.soTien).toLocaleString(),
    daThu: (MOCK_DOAN_PHI.filter(p => p.trangThai === 'Đã đóng').length * currentRate.soTien).toLocaleString(),
    choDuyet: MOCK_PHIEU_THU.filter(r => r.trangThai === 'Chờ duyệt').length
  };

  const handleConfirmUpdate = () => {
    alert(`Đã cập nhật mức phí mới: ${Number(newFee).toLocaleString()} VNĐ`);
    setShowUpdateFee(false);
  };

  const paymentFilterOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'Đã đóng', label: 'Đã đóng' },
    { value: 'Chưa đóng', label: 'Chưa đóng' },
    { value: 'Chờ duyệt', label: 'Chờ duyệt (Phiếu thu)' }
  ];

  return (
    <div className="doan-phi-container">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="dp-header">
        <h1 className="dp-title">Quản lý Đoàn Phí</h1>
        <div className="dp-actions">
          <button className="dp-update-btn" style={{ borderColor: '#004f9f', color: '#004f9f' }}>
            <Download size={18} />
            Xuất báo cáo
          </button>
          <button className="dp-update-btn" style={{ backgroundColor: '#004f9f', borderColor: '#004f9f', color: '#fff' }}>
            <Settings size={18} />
            Cấu hình đợt thu
          </button>
        </div>
      </div>

      {/* ── Current Fee Rate Bar ──────────────────────────── */}
      <div className="dp-current-fee-bar">
        <div className="dp-current-fee-info">
          <span className="dp-current-fee-label">Mức đoàn phí áp dụng toàn trường</span>
          <div className="dp-current-fee-value">
            {currentRate.soTien.toLocaleString()} ₫
            <span className="dp-current-fee-sub">/ năm học {currentRate.namHoc}</span>
          </div>
        </div>
        <button className="dp-update-btn" onClick={() => setShowUpdateFee(true)}>
          <TrendingUp size={18} />
          Cập nhật mức thu mới
        </button>
      </div>

      {/* ── Status Cards ───────────────────────────────────────── */}
      <div className="dp-stats">
        <div className="dp-stat-item">
          <span className="dp-stat-item__label">Tổng phải thu (Dự kiến)</span>
          <span className="dp-stat-item__value">{stats.tongPhaiThu} ₫</span>
          <CreditCard size={40} style={{ position: 'absolute', right: 20, bottom: 20, opacity: 0.05 }} />
        </div>
        <div className="dp-stat-item" style={{ borderLeft: '3px solid #15803d' }}>
          <span className="dp-stat-item__label">Đã thu thực tế</span>
          <span className="dp-stat-item__value">{stats.daThu} ₫</span>
          <CheckCircle size={40} style={{ position: 'absolute', right: 20, bottom: 20, opacity: 0.1, color: '#15803d' }} />
        </div>
        <div className="dp-stat-item" style={{ borderLeft: '3px solid #b45309' }}>
          <span className="dp-stat-item__label">Phiếu thu chờ duyệt</span>
          <span className="dp-stat-item__value">{stats.choDuyet} Phiếu</span>
          <Clock size={40} style={{ position: 'absolute', right: 20, bottom: 20, opacity: 0.1, color: '#b45309' }} />
        </div>
        <div className="dp-stat-item" style={{ borderLeft: '3px solid #004f9f' }}>
          <span className="dp-stat-item__label">Tỷ lệ hoàn thành</span>
          <span className="dp-stat-item__value">74.5%</span>
          <TrendingUp size={40} style={{ position: 'absolute', right: 20, bottom: 20, opacity: 0.1, color: '#004f9f' }} />
        </div>
      </div>

      {/* ── Generic Toolbar ─────────────────────────────────── */}
      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm kiếm đoàn viên, phiếu thu..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={paymentFilterOptions}
      />

      {/* ── Tabs Navigation ─────────────────────────────── */}
      <div className="dp-tabs">
        <div style={{ display: 'flex', borderBottom: '1px solid #eef2f6' }}>
          <button 
            onClick={() => setActiveTab('payments')}
            style={{ 
              padding: '1rem 1.5rem', 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === 'payments' ? '3px solid #004f9f' : '3px solid transparent',
              fontWeight: 700,
              color: activeTab === 'payments' ? '#004f9f' : '#64748b',
              cursor: 'pointer'
            }}
          >
            Danh sách Đoàn viên
          </button>
          <button 
            onClick={() => setActiveTab('receipts')}
            style={{ 
              padding: '1rem 1.5rem', 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === 'receipts' ? '3px solid #004f9f' : '3px solid transparent',
              fontWeight: 700,
              color: activeTab === 'receipts' ? '#004f9f' : '#64748b',
              cursor: 'pointer'
            }}
          >
            Phiếu thu cấp Lớp ({MOCK_PHIEU_THU.length})
          </button>
        </div>
      </div>

      {/* ── Table Area ────────────────────────────────────── */}
      <div className="dp-card">
        {activeTab === 'payments' ? (
          <table className="dp-table">
            <thead>
              <tr>
                <th>MSSV</th>
                <th>Họ và Tên</th>
                <th>Lớp / Khoa</th>
                <th>Số tiền</th>
                <th>Ngày đóng</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(p => (
                <tr key={p.idDoanPhi}>
                  <td className="dp-id-cell">{p.idDV}</td>
                  <td style={{ fontWeight: 600 }}>{p.hoTen}</td>
                  <td>{p.idChiDoan} / {p.khoa}</td>
                  <td className="dp-amount-cell">{(p.soTien || 0).toLocaleString()} ₫</td>
                  <td>{p.ngayDong ? new Date(p.ngayDong).toLocaleDateString('vi-VN') : '-'}</td>
                  <td>
                    <span className={`dp-badge ${p.trangThai === 'Đã đóng' ? 'dp-badge--paid' : 'dp-badge--unpaid'}`}>
                      {p.trangThai}
                    </span>
                  </td>
                  <td>
                    <button className="dp-update-btn" style={{ padding: '0.4rem 0.8rem', borderColor: '#e2e8f0', color: '#64748b' }}>
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="dp-table">
            <thead>
              <tr>
                <th>Mã Phiếu</th>
                <th>Chi đoàn</th>
                <th>Người nộp</th>
                <th>Tổng tiền</th>
                <th>Ngày nộp</th>
                <th>Trạng thái</th>
                <th>Duyệt phiếu</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PHIEU_THU.map(rt => (
                <tr key={rt.idPhieuThu}>
                  <td className="dp-id-cell">{rt.idPhieuThu}</td>
                  <td style={{ fontWeight: 600 }}>{rt.tenChiDoan}</td>
                  <td>{rt.nguoiNop}</td>
                  <td className="dp-amount-cell">{rt.tongTien.toLocaleString()} ₫</td>
                  <td>{new Date(rt.ngayNop).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <span className={`dp-badge ${
                      rt.trangThai === 'Đã duyệt' ? 'dp-badge--paid' : 
                      rt.trangThai === 'Chờ duyệt' ? 'dp-badge--pending' : 'dp-badge--unpaid'
                    }`}>
                      {rt.trangThai}
                    </span>
                  </td>
                  <td>
                    <button className="dp-update-btn" style={{ padding: '0.4rem 0.8rem', backgroundColor: rt.trangThai === 'Chờ duyệt' ? '#004f9f' : '#f8fafc', color: rt.trangThai === 'Chờ duyệt' ? '#fff' : '#64748b', border: '1px solid #e2e8f0' }}>
                      {rt.trangThai === 'Chờ duyệt' ? 'Duyệt ngay' : 'Xem lại'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <UpdateFeeModal
         show={showUpdateFee}
         onClose={() => setShowUpdateFee(false)}
         onConfirm={handleConfirmUpdate}
         feeValue={newFee}
         setFeeValue={setNewFee}
      />
    </div>
  );
};

export default DoanPhi;