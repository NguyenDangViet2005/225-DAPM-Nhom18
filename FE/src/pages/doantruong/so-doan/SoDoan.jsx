import { useState } from 'react';
import { 
  Download, 
  Plus, 
  Eye, 
  FileText, 
  Trash2, 
} from 'lucide-react';
import { MOCK_SO_DOAN, SO_DOAN_STATS } from '@/data/mockSoDoan';
import DataTableToolbar from '@/components/commons/DataTableToolbar/DataTableToolbar';
import './SoDoan.css';

const SoDoan = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredData = MOCK_SO_DOAN.filter(item => {
    const matchesSearch = item.member.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.idDV.includes(searchTerm) || 
                         item.idSoDoan.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || item.trangThai === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filterOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'Đang lưu giữ', label: 'Đang lưu giữ' },
    { value: 'Đã rút', label: 'Đã rút / Chuyển sinh hoạt' },
    { value: 'Thất lạc', label: 'Thất lạc / Chờ cấp lại' }
  ];

  return (
    <div className="so-doan-container">
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

      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm theo Tên đoàn viên, MSSV hoặc Mã sổ..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={filterOptions}
      />

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
                <td>{new Date(item.ngayCap).toLocaleDateString('vi-VN')}</td>
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
                    <button className="btn-icon" title="Xem chi tiết hồ sơ"><Eye size={16} /></button>
                    <button className="btn-icon" title="Cập nhật trạng thái"><FileText size={16} /></button>
                    <button className="btn-icon" title="Xóa hồ sơ"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SoDoan;