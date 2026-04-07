import { useState, useMemo } from 'react';
import { CheckCircle, Clock, Send, Wallet } from 'lucide-react';
import { MOCK_DOAN_PHI, MOCK_MUC_DOAN_PHI } from '@/data/mockDoanPhi';
import DataTableToolbar from '@/components/commons/DataTableToolbar/DataTableToolbar';
import './DoanPhiLop.css';

// Giả lập chỉ lấy đoàn viên thuộc chi đoàn của bí thư
const MY_CHI_DOAN = '23110CL1A';

const filterOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'Đã đóng', label: 'Đã đóng' },
  { value: 'Chưa đóng', label: 'Chưa đóng' },
];

const DoanPhiLop = () => {
  const [activeTab, setActiveTab] = useState('danh-sach'); // danh-sach | gui
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [checked, setChecked] = useState({});

  const currentRate = MOCK_MUC_DOAN_PHI.find(r => r.trangThai === 'Áp dụng') || MOCK_MUC_DOAN_PHI[0];

  // Lọc đoàn viên thuộc chi đoàn này
  const chiDoanMembers = useMemo(() =>
    MOCK_DOAN_PHI.filter(p => p.idChiDoan === MY_CHI_DOAN), []);

  const filtered = useMemo(() => chiDoanMembers.filter(p => {
    const matchSearch = p.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) || p.idDV.includes(searchTerm);
    const matchStatus = statusFilter === 'all' || p.trangThai === statusFilter;
    return matchSearch && matchStatus;
  }), [chiDoanMembers, searchTerm, statusFilter]);

  const daDong = chiDoanMembers.filter(p => p.trangThai === 'Đã đóng').length;
  const chuaDong = chiDoanMembers.length - daDong;
  const tongThu = daDong * currentRate.soTien;

  const toggleCheck = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const checkedCount = Object.values(checked).filter(Boolean).length;

  const tabs = [
    { key: 'danh-sach', label: 'Lập danh sách thu' },
    { key: 'gui', label: 'Gửi danh sách nộp' },
  ];

  return (
    <div className="dpl-container">
      <div className="dpl-header">
        <h1 className="dpl-title">Đoàn phí lớp</h1>
        <span className="dpl-chi-doan-badge">Chi đoàn: {MY_CHI_DOAN}</span>
      </div>

      {/* Stats */}
      <div className="dpl-stats">
        <div className="dpl-stat-item">
          <Wallet size={20} style={{ color: '#004f9f' }} />
          <div>
            <span className="dpl-stat-item__label">Mức phí năm học {currentRate.namHoc}</span>
            <span className="dpl-stat-item__value">{currentRate.soTien.toLocaleString()} ₫</span>
          </div>
        </div>
        <div className="dpl-stat-item" style={{ borderLeft: '3px solid #15803d' }}>
          <CheckCircle size={20} style={{ color: '#15803d' }} />
          <div>
            <span className="dpl-stat-item__label">Đã đóng</span>
            <span className="dpl-stat-item__value">{daDong} / {chiDoanMembers.length} đoàn viên</span>
          </div>
        </div>
        <div className="dpl-stat-item" style={{ borderLeft: '3px solid #e53e3e' }}>
          <Clock size={20} style={{ color: '#e53e3e' }} />
          <div>
            <span className="dpl-stat-item__label">Chưa đóng</span>
            <span className="dpl-stat-item__value">{chuaDong} đoàn viên</span>
          </div>
        </div>
        <div className="dpl-stat-item" style={{ borderLeft: '3px solid #004f9f' }}>
          <Wallet size={20} style={{ color: '#004f9f' }} />
          <div>
            <span className="dpl-stat-item__label">Tổng đã thu</span>
            <span className="dpl-stat-item__value">{tongThu.toLocaleString()} ₫</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dpl-tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`dpl-tab-btn${activeTab === t.key ? ' dpl-tab-btn--active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'danh-sach' && (
        <>
          <DataTableToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Tìm MSSV hoặc tên đoàn viên..."
            filterValue={statusFilter}
            onFilterChange={setStatusFilter}
            filterOptions={filterOptions}
          />
          <div className="dpl-card">
            <table className="dpl-table">
              <thead>
                <tr>
                  <th>Đánh dấu</th>
                  <th>MSSV</th>
                  <th>Họ và Tên</th>
                  <th>Số tiền</th>
                  <th>Ngày đóng</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.idDoanPhi}>
                    <td>
                      <input
                        type="checkbox"
                        checked={!!checked[p.idDV]}
                        onChange={() => toggleCheck(p.idDV)}
                        disabled={p.trangThai === 'Đã đóng'}
                      />
                    </td>
                    <td style={{ fontWeight: 600, color: '#004f9f' }}>{p.idDV}</td>
                    <td style={{ fontWeight: 600 }}>{p.hoTen}</td>
                    <td>{currentRate.soTien.toLocaleString()} ₫</td>
                    <td>{p.ngayDong ? new Date(p.ngayDong).toLocaleDateString('vi-VN') : '-'}</td>
                    <td>
                      <span className={`dpl-badge ${p.trangThai === 'Đã đóng' ? 'dpl-badge--paid' : 'dpl-badge--unpaid'}`}>
                        {p.trangThai}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                      Không tìm thấy đoàn viên nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'gui' && (
        <div className="dpl-card dpl-gui-panel">
          <h3 className="dpl-gui-title">Gửi danh sách nộp đoàn phí lên Đoàn trường</h3>
          <p className="dpl-gui-desc">
            Sau khi thu đủ đoàn phí, lập phiếu thu và gửi lên Đoàn trường để xác nhận.
          </p>
          <div className="dpl-gui-summary">
            <div className="dpl-gui-summary-row">
              <span>Chi đoàn</span>
              <strong>{MY_CHI_DOAN}</strong>
            </div>
            <div className="dpl-gui-summary-row">
              <span>Số đoàn viên đã đóng</span>
              <strong>{daDong} / {chiDoanMembers.length}</strong>
            </div>
            <div className="dpl-gui-summary-row">
              <span>Tổng tiền</span>
              <strong style={{ color: '#004f9f' }}>{tongThu.toLocaleString()} ₫</strong>
            </div>
            <div className="dpl-gui-summary-row">
              <span>Năm học</span>
              <strong>{currentRate.namHoc}</strong>
            </div>
          </div>
          <div className="dpl-gui-upload">
            <label className="dpl-gui-upload-label">Đính kèm minh chứng (PDF/ảnh)</label>
            <input type="file" accept=".pdf,image/*" className="dpl-gui-upload-input" />
          </div>
          <button className="dpl-gui-submit-btn">
            <Send size={16} />
            Gửi danh sách nộp
          </button>
        </div>
      )}
    </div>
  );
};

export default DoanPhiLop;
