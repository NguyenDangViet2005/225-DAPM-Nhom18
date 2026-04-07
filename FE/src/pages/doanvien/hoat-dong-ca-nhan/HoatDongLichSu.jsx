import { useState, useMemo } from 'react';
import { MOCK_DANG_KY_HOAT_DONG } from '@/data/mockHoatDong';
import DataTableToolbar from '@/components/commons/DataTableToolbar/DataTableToolbar';
import './HoatDongCaNhan.css';

const MY_ID = '23110245'; // dùng id có data mock

const filterOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'Đã duyệt', label: 'Đã duyệt' },
  { value: 'Chờ duyệt', label: 'Chờ duyệt' },
  { value: 'Từ chối', label: 'Từ chối' },
];

const STATUS_CLS = {
  'Đã duyệt': 'hdcn-badge--approved',
  'Chờ duyệt': 'hdcn-badge--pending',
  'Từ chối':  'hdcn-badge--rejected',
};

const HoatDongLichSu = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const myHistory = useMemo(() =>
    MOCK_DANG_KY_HOAT_DONG.filter(r =>
      r.idDV === MY_ID &&
      (statusFilter === 'all' || r.trangThaiDuyet === statusFilter) &&
      r.tenHD.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm, statusFilter]);

  return (
    <div className="hdcn-container">
      <div className="hdcn-header">
        <h1 className="hdcn-title">Lịch sử đăng ký hoạt động</h1>
      </div>

      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm tên hoạt động..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={filterOptions}
      />

      <div className="hdcn-card">
        <table className="hdcn-table">
          <thead>
            <tr>
              <th>Tên hoạt động</th>
              <th>Ngày đăng ký</th>
              <th>Trạng thái</th>
              <th>Lý do từ chối</th>
            </tr>
          </thead>
          <tbody>
            {myHistory.map((r, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600, color: '#0d1f3c' }}>{r.tenHD}</td>
                <td>{new Date(r.ngayDangKi).toLocaleDateString('vi-VN')}</td>
                <td>
                  <span className={`hdcn-badge ${STATUS_CLS[r.trangThaiDuyet]}`}>
                    {r.trangThaiDuyet}
                  </span>
                </td>
                <td style={{ color: '#b91c1c', fontSize: '0.8rem' }}>{r.liDoTuChoi || '—'}</td>
              </tr>
            ))}
            {myHistory.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  Không có lịch sử đăng ký nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoatDongLichSu;
