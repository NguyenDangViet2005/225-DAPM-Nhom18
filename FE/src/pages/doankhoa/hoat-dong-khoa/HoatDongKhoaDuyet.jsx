import { useState, useMemo } from 'react';
import { CheckCircle, XCircle, ClipboardCheck } from 'lucide-react';
import {
  MOCK_DANG_KY_HOAT_DONG_KHOA,
  MOCK_HOAT_DONG_KHOA,
  ACTIVITY_STATS_KHOA,
} from '@/data/mockHoatDongKhoa';
import DataTableToolbar from '@/components/commons/DataTableToolbar/DataTableToolbar';
import './HoatDongKhoa.css';

const HoatDongKhoaDuyet = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hdFilter, setHdFilter] = useState('all');

  // Danh sách hoạt động khoa để lọc theo tên
  const hoatDongOptions = useMemo(() => [
    { value: 'all', label: 'Tất cả hoạt động' },
    ...MOCK_HOAT_DONG_KHOA.map((hd) => ({ value: hd.idHD, label: hd.tenHD })),
  ], []);

  // Chỉ lấy đăng ký chờ duyệt của hoạt động cấp khoa
  const pendingRegs = useMemo(() => {
    return MOCK_DANG_KY_HOAT_DONG_KHOA.filter((reg) => {
      const matchSearch =
        reg.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.idDV.includes(searchTerm) ||
        reg.tenHD.toLowerCase().includes(searchTerm.toLowerCase());
      const matchFilter = hdFilter === 'all' || reg.idHD === hdFilter;
      return reg.trangThaiDuyet === 'Chờ duyệt' && matchSearch && matchFilter;
    });
  }, [searchTerm, hdFilter]);

  return (
    <div className="hdk-container">
      {/* Header */}
      <div className="hdk-header">
        <h1 className="hdk-title">Duyệt Đăng ký Hoạt động Khoa</h1>
        <div className="hdk-actions">
          <button
            className="hdk-btn"
            style={{ backgroundColor: '#15803d', borderColor: '#15803d', color: '#fff' }}
          >
            <CheckCircle size={18} />
            Duyệt tất cả
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="hdk-stats">
        <div className="hdk-stat-item" style={{ borderLeftColor: '#b45309' }}>
          <span className="hdk-stat-item__label">Chờ duyệt</span>
          <span className="hdk-stat-item__value" style={{ color: '#b45309' }}>
            {ACTIVITY_STATS_KHOA.choDuyetDK} đơn
          </span>
        </div>
        <div className="hdk-stat-item" style={{ borderLeftColor: '#15803d' }}>
          <span className="hdk-stat-item__label">Đã duyệt</span>
          <span className="hdk-stat-item__value" style={{ color: '#15803d' }}>
            {MOCK_DANG_KY_HOAT_DONG_KHOA.filter((r) => r.trangThaiDuyet === 'Đã duyệt').length} đơn
          </span>
        </div>
        <div className="hdk-stat-item" style={{ borderLeftColor: '#b91c1c' }}>
          <span className="hdk-stat-item__label">Từ chối</span>
          <span className="hdk-stat-item__value" style={{ color: '#b91c1c' }}>
            {MOCK_DANG_KY_HOAT_DONG_KHOA.filter((r) => r.trangThaiDuyet === 'Từ chối').length} đơn
          </span>
        </div>
        <div className="hdk-stat-item">
          <span className="hdk-stat-item__label">Tổng hoạt động khoa</span>
          <span className="hdk-stat-item__value">{MOCK_HOAT_DONG_KHOA.length}</span>
        </div>
      </div>

      {/* Toolbar */}
      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm theo tên đoàn viên, MSSV, tên hoạt động..."
        filterValue={hdFilter}
        onFilterChange={setHdFilter}
        filterOptions={hoatDongOptions}
      />

      {/* Table */}
      <div className="hdk-card">
        <table className="hdk-table">
          <thead>
            <tr>
              <th>MSSV</th>
              <th>Họ và Tên</th>
              <th>Hoạt động đăng ký</th>
              <th>Ngày đăng ký</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pendingRegs.map((reg, idx) => (
              <tr key={`${reg.idDV}-${reg.idHD}-${idx}`}>
                <td style={{ fontWeight: 600, color: '#004f9f' }}>{reg.idDV}</td>
                <td>{reg.hoTen}</td>
                <td style={{ fontWeight: 600 }}>{reg.tenHD}</td>
                <td>{new Date(reg.ngayDangKi).toLocaleDateString('vi-VN')}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="hdk-btn"
                      style={{ color: '#15803d' }}
                      title="Duyệt tham gia"
                    >
                      <CheckCircle size={17} /> Duyệt
                    </button>
                    <button
                      className="hdk-btn"
                      style={{ color: '#b91c1c' }}
                      title="Từ chối"
                    >
                      <XCircle size={17} /> Từ chối
                    </button>
                    <button className="hdk-btn" title="Ghi chú">
                      <ClipboardCheck size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pendingRegs.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  Không có đơn đăng ký nào đang chờ duyệt
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoatDongKhoaDuyet;
