import { useState, useMemo } from 'react';
import { CheckCircle, Search } from 'lucide-react';
import { MOCK_DANG_KY_HOAT_DONG, MOCK_HOAT_DONG } from '@/data/mockHoatDong';
import '@/pages/bithu/bithu.css';

const HoatDongChiDoanXacNhan = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const chiDoanActivityIds = useMemo(() =>
    MOCK_HOAT_DONG.filter(hd => hd.donViToChuc !== 'Đoàn Trường').map(hd => hd.idHD), []);

  const approved = useMemo(() =>
    MOCK_DANG_KY_HOAT_DONG.filter(reg =>
      chiDoanActivityIds.includes(reg.idHD) &&
      reg.trangThaiDuyet === 'Đã duyệt' && (
        reg.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.idDV.includes(searchTerm) ||
        reg.tenHD.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ), [searchTerm, chiDoanActivityIds]);

  return (
    <div className="bt-page">
      <div className="bt-header">
        <div>
          <h1 className="bt-title">Xác nhận hoàn thành hoạt động</h1>
          <p className="bt-subtitle">Xác nhận đoàn viên đã tham gia hoàn thành</p>
        </div>
        <button className="bt-btn bt-btn--primary">
          <CheckCircle size={15} /> Xác nhận hàng loạt
        </button>
      </div>

      <div className="bt-glass bt-stat-card" style={{ maxWidth: 280 }}>
        <div className="bt-stat-card__icon" style={{ background: '#10b98118', color: '#10b981' }}>
          <CheckCircle size={20} />
        </div>
        <div>
          <p className="bt-stat-card__label">Chờ xác nhận hoàn thành</p>
          <p className="bt-stat-card__value" style={{ fontSize: '1.5rem' }}>{approved.length} đoàn viên</p>
        </div>
      </div>

      <div className="bt-glass" style={{ padding: '0.875rem 1rem' }}>
        <div className="bt-search-wrap">
          <Search size={15} />
          <input className="bt-search-input" placeholder="Tìm tên đoàn viên, MSSV hoặc tên hoạt động..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="bt-glass bt-table-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="bt-table">
            <thead>
              <tr><th>MSSV</th><th>Họ và Tên</th><th>Hoạt động</th><th>Ngày đăng ký</th><th>Trạng thái</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              {approved.map((reg, idx) => (
                <tr key={`${reg.idDV}-${reg.idHD}-${idx}`}>
                  <td style={{ fontWeight: 700, color: 'var(--bt-blue)' }}>{reg.idDV}</td>
                  <td style={{ fontWeight: 600 }}>{reg.hoTen}</td>
                  <td>{reg.tenHD}</td>
                  <td style={{ color: 'var(--bt-text-muted)' }}>{new Date(reg.ngayDangKi).toLocaleDateString('vi-VN')}</td>
                  <td><span className="bt-status bt-status--approved">Đã duyệt</span></td>
                  <td>
                    <button className="bt-btn bt-btn--primary bt-btn--sm">
                      <CheckCircle size={13} /> Xác nhận hoàn thành
                    </button>
                  </td>
                </tr>
              ))}
              {approved.length === 0 && <tr><td colSpan="6" className="bt-empty">Không có đoàn viên nào chờ xác nhận</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HoatDongChiDoanXacNhan;
