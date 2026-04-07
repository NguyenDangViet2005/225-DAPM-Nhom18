import { useState, useMemo } from 'react';
import { CheckCircle } from 'lucide-react';
import { MOCK_DANG_KY_HOAT_DONG, MOCK_HOAT_DONG } from '@/data/mockHoatDong';
import DataTableToolbar from '@/components/commons/DataTableToolbar/DataTableToolbar';
import './HoatDongChiDoan.css';

const HoatDongChiDoanXacNhan = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const chiDoanActivityIds = useMemo(() =>
    MOCK_HOAT_DONG.filter(hd => hd.donViToChuc !== 'Đoàn Trường').map(hd => hd.idHD),
  []);

  // Đã duyệt nhưng chưa xác nhận hoàn thành (giả lập bằng trạng thái "Đã duyệt")
  const approved = useMemo(() =>
    MOCK_DANG_KY_HOAT_DONG.filter(reg =>
      chiDoanActivityIds.includes(reg.idHD) &&
      reg.trangThaiDuyet === 'Đã duyệt' && (
        reg.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.idDV.includes(searchTerm) ||
        reg.tenHD.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ),
  [searchTerm, chiDoanActivityIds]);

  return (
    <div className="hdc-container">
      <div className="hdc-header">
        <h1 className="hdc-title">Xác nhận hoàn thành hoạt động</h1>
        <button className="hdc-btn hdc-btn--primary">
          <CheckCircle size={16} />
          Xác nhận hàng loạt
        </button>
      </div>

      <div className="hdc-stats">
        <div className="hdc-stat-item" style={{ borderLeft: '3px solid #15803d' }}>
          <span className="hdc-stat-item__label">Chờ xác nhận hoàn thành</span>
          <span className="hdc-stat-item__value">{approved.length} đoàn viên</span>
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
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {approved.map((reg, idx) => (
              <tr key={`${reg.idDV}-${reg.idHD}-${idx}`}>
                <td style={{ fontWeight: 600, color: '#004f9f' }}>{reg.idDV}</td>
                <td>{reg.hoTen}</td>
                <td style={{ fontWeight: 600 }}>{reg.tenHD}</td>
                <td>{new Date(reg.ngayDangKi).toLocaleDateString('vi-VN')}</td>
                <td>
                  <span className="hdc-badge hdc-badge--approved">Đã duyệt</span>
                </td>
                <td>
                  <button className="hdc-btn hdc-btn--confirm">
                    <CheckCircle size={15} /> Xác nhận hoàn thành
                  </button>
                </td>
              </tr>
            ))}
            {approved.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  Không có đoàn viên nào chờ xác nhận hoàn thành
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoatDongChiDoanXacNhan;
