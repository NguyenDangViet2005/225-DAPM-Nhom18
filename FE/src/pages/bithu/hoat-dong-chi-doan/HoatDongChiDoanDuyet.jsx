import { useState, useMemo } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { MOCK_DANG_KY_HOAT_DONG, MOCK_HOAT_DONG } from '@/data/mockHoatDong';
import DataTableToolbar from '@/components/commons/DataTableToolbar/DataTableToolbar';
import './HoatDongChiDoan.css';

const HoatDongChiDoanDuyet = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Lấy các hoạt động không phải cấp trường (cấp khoa hoặc chi đoàn)
  const chiDoanActivityIds = useMemo(() =>
    MOCK_HOAT_DONG.filter(hd => hd.donViToChuc !== 'Đoàn Trường').map(hd => hd.idHD),
  []);

  const pending = useMemo(() =>
    MOCK_DANG_KY_HOAT_DONG.filter(reg =>
      chiDoanActivityIds.includes(reg.idHD) &&
      reg.trangThaiDuyet === 'Chờ duyệt' && (
        reg.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.idDV.includes(searchTerm) ||
        reg.tenHD.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ),
  [searchTerm, chiDoanActivityIds]);

  return (
    <div className="hdc-container">
      <div className="hdc-header">
        <h1 className="hdc-title">Duyệt đăng ký hoạt động chi đoàn</h1>
        <button className="hdc-btn hdc-btn--primary">
          <CheckCircle size={16} />
          Duyệt hàng loạt
        </button>
      </div>

      <div className="hdc-stats">
        <div className="hdc-stat-item" style={{ borderLeft: '3px solid #b45309' }}>
          <span className="hdc-stat-item__label">Chờ xử lý</span>
          <span className="hdc-stat-item__value">{pending.length} đơn</span>
        </div>
        <div className="hdc-stat-item" style={{ borderLeft: '3px solid #004f9f' }}>
          <span className="hdc-stat-item__label">Hoạt động đang quản lý</span>
          <span className="hdc-stat-item__value">{chiDoanActivityIds.length}</span>
        </div>
      </div>

      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm tên đoàn viên, MSSV hoặc tên hoạt động..."
      />

      <div className="hdc-card">
        <table className="hdc-table">
          <thead>
            <tr>
              <th>MSSV</th>
              <th>Họ và Tên</th>
              <th>Hoạt động</th>
              <th>Ngày đăng ký</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((reg, idx) => (
              <tr key={`${reg.idDV}-${reg.idHD}-${idx}`}>
                <td style={{ fontWeight: 600, color: '#004f9f' }}>{reg.idDV}</td>
                <td>{reg.hoTen}</td>
                <td style={{ fontWeight: 600 }}>{reg.tenHD}</td>
                <td>{new Date(reg.ngayDangKi).toLocaleDateString('vi-VN')}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="hdc-btn hdc-btn--approve">
                      <CheckCircle size={15} /> Duyệt
                    </button>
                    <button className="hdc-btn hdc-btn--reject">
                      <XCircle size={15} /> Từ chối
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pending.length === 0 && (
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

export default HoatDongChiDoanDuyet;
