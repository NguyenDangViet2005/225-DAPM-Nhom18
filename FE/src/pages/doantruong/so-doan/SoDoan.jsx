import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  FileText, 
  Eye, 
  Trash2, 
  MoreHorizontal,
  ChevronRight,
  Filter
} from 'lucide-react';
import { MOCK_SO_DOAN, SO_DOAN_STATS } from '@/data/mockSoDoan';
import './SoDoan.css';

const SoDoan = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Logic lọc dữ liệu
  const filteredData = MOCK_SO_DOAN.filter(item => {
    const matchesSearch = item.member.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.idDV.includes(searchTerm) || 
                         item.idSoDoan.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || item.trangThai === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="so-doan-container">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="so-doan-header">
        <h1 className="so-doan-title">Quản lý Sổ Đoàn</h1>
        <div className="so-doan-actions">
          <button className="btn-primary" title="In báo cáo thống kê">
            <Download size={18} />
            Xuất báo cáo
          </button>
          <button className="btn-primary" title="Tiếp nhận sổ mới">
            <Plus size={18} />
            Tiếp nhận Sổ
          </button>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────── */}
      <div className="so-doan-stats">
        <div className="stat-item">
          <span className="stat-item__label">Tổng số Sổ</span>
          <span className="stat-item__value">{SO_DOAN_STATS.tongSo.toLocaleString()}</span>
        </div>
        <div className="stat-item" style={{ borderLeftColor: '#0369a1' }}>
          <span className="stat-item__label">Đang lưu giữ</span>
          <span className="stat-item__value">{SO_DOAN_STATS.dangLuuGiu.toLocaleString()}</span>
        </div>
        <div className="stat-item" style={{ borderLeftColor: '#15803d' }}>
          <span className="stat-item__label">Đã rút / Chuyển SH</span>
          <span className="stat-item__value">{SO_DOAN_STATS.daRut.toLocaleString()}</span>
        </div>
        <div className="stat-item" style={{ borderLeftColor: '#b91c1c' }}>
          <span className="stat-item__label">Mất / Thất lạc</span>
          <span className="stat-item__value">{SO_DOAN_STATS.thatLac.toLocaleString()}</span>
        </div>
      </div>

      {/* ── Filter Bar ────────────────────────────────────── */}
      <div className="so-doan-filters">
        <div className="search-input-wrap">
          <Search size={18} />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Tìm theo Tên đoàn viên, MSSV hoặc Mã sổ..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="Đang lưu giữ">Đang lưu giữ</option>
          <option value="Đã rút">Đã rút / Chuyển sinh hoạt</option>
          <option value="Thất lạc">Thất lạc / Chờ cấp lại</option>
        </select>
        <button className="btn-icon" title="Lọc nâng cao">
          <Filter size={18} />
        </button>
      </div>

      {/* ── Data Table ────────────────────────────────────── */}
      <div className="so-doan-card">
        <table className="so-doan-table">
          <thead>
            <tr>
              <th>Mã Sổ</th>
              <th>Đoàn viên</th>
              <th>Khoa / Chi đoàn</th>
              <th>Ngày cấp</th>
              <th>Nơi cấp</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.idSoDoan}>
                <td className="member-id" style={{ fontWeight: 600, color: '#004f9f' }}>
                  {item.idSoDoan}
                </td>
                <td>
                  <div className="member-info">
                    <span className="member-name">{item.member.hoTen}</span>
                    <span className="member-id">MSSV: {item.idDV}</span>
                  </div>
                </td>
                <td>
                  <div className="member-info">
                    <span className="member-name">{item.member.khoa}</span>
                    <span className="member-id">{item.member.idChiDoan}</span>
                  </div>
                </td>
                <td>
                  {new Date(item.ngayCap).toLocaleDateString('vi-VN')}
                </td>
                <td style={{ fontSize: '0.8rem', color: '#64748b', maxWidth: '150px' }}>
                  {item.noiCap}
                </td>
                <td>
                  <span className={`status-badge ${
                    item.trangThai === 'Đang lưu giữ' ? 'status-badge--holding' :
                    item.trangThai === 'Đã rút' ? 'status-badge--withdrawn' :
                    'status-badge--lost'
                  }`}>
                    {item.trangThai}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="btn-icon" title="Xem chi tiết hồ sơ">
                      <Eye size={16} />
                    </button>
                    <button className="btn-icon" title="Cập nhật trạng thái">
                      <FileText size={16} />
                    </button>
                    <button className="btn-icon" title="Xóa hồ sơ">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  Không tìm thấy dữ liệu phù hợp với bộ lọc
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SoDoan;