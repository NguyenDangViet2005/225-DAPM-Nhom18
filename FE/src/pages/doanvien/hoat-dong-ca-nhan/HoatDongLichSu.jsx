import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { MOCK_DANG_KY_HOAT_DONG } from '@/data/mockHoatDong';
import '@/pages/bithu/bithu.css';

const MY_ID = '23110245';
const STATUS_CLS = { 'Đã duyệt': 'bt-status--approved', 'Chờ duyệt': 'bt-status--pending', 'Từ chối': 'bt-status--rejected' };

const HoatDongLichSu = () => {
  const [searchTerm, setSearchTerm]   = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const myHistory = useMemo(() =>
    MOCK_DANG_KY_HOAT_DONG.filter(r =>
      r.idDV === MY_ID &&
      (statusFilter === 'all' || r.trangThaiDuyet === statusFilter) &&
      r.tenHD.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm, statusFilter]);

  return (
    <div className="bt-page">
      <div className="bt-header">
        <h1 className="bt-title">Lịch sử đăng ký hoạt động</h1>
      </div>

      <div className="bt-glass" style={{ padding: '0.875rem 1rem' }}>
        <div className="bt-toolbar">
          <div className="bt-search-wrap">
            <Search size={15} />
            <input className="bt-search-input" placeholder="Tìm tên hoạt động..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="bt-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">Tất cả</option>
            <option value="Đã duyệt">Đã duyệt</option>
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="Từ chối">Từ chối</option>
          </select>
        </div>
      </div>

      <div className="bt-glass bt-table-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="bt-table">
            <thead>
              <tr><th>Tên hoạt động</th><th>Ngày đăng ký</th><th>Trạng thái</th><th>Lý do từ chối</th></tr>
            </thead>
            <tbody>
              {myHistory.map((r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{r.tenHD}</td>
                  <td style={{ color: 'var(--bt-text-muted)' }}>{new Date(r.ngayDangKi).toLocaleDateString('vi-VN')}</td>
                  <td><span className={`bt-status ${STATUS_CLS[r.trangThaiDuyet]}`}>{r.trangThaiDuyet}</span></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--bt-red)' }}>{r.liDoTuChoi || '—'}</td>
                </tr>
              ))}
              {myHistory.length === 0 && <tr><td colSpan="4" className="bt-empty">Không có lịch sử đăng ký nào</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HoatDongLichSu;
