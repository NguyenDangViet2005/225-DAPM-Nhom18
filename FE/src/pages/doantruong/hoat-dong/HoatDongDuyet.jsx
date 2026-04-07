import { useState, useMemo } from 'react';
import { 
  CheckCircle, 
  XCircle,
  ClipboardCheck,
} from 'lucide-react';
import { MOCK_DANG_KY_HOAT_DONG, MOCK_HOAT_DONG } from '@/data/mockHoatDong';
import DataTableToolbar from '@/components/commons/DataTableToolbar/DataTableToolbar';
import './HoatDong.css';

const HoatDongDuyet = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc chỉ các Hoạt động do ĐOÀN TRƯỜNG tổ chức
  const schoolActivityIds = useMemo(() => {
    return MOCK_HOAT_DONG.filter(hd => hd.donViToChuc === 'Đoàn Trường').map(hd => hd.idHD);
  }, []);

  const registrationsPending = useMemo(() => {
    return MOCK_DANG_KY_HOAT_DONG.filter(reg => 
      schoolActivityIds.includes(reg.idHD) &&
      reg.trangThaiDuyet === 'Chờ duyệt' && (
        reg.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) || 
        reg.idDV.includes(searchTerm) || 
        reg.tenHD.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, schoolActivityIds]);

  return (
    <div className="hd-container">
      <div className="hd-header">
        <h1 className="hd-title">Duyệt đăng ký Đoàn trường</h1>
        <div className="hd-actions">
          <button className="hd-update-btn" style={{ backgroundColor: '#15803d', borderColor: '#15803d', color: '#fff' }}>
            <CheckCircle size={18} />
            Duyệt hàng loạt (School)
          </button>
        </div>
      </div>

      <div className="hd-stats">
        <div className="hd-stat-item" style={{ borderLeft: '3px solid #b45309' }}>
          <span className="hd-stat-item__label">Chờ xử lý (Cấp trường)</span>
          <span className="hd-stat-item__value">{registrationsPending.length} đơn</span>
        </div>
        <div className="hd-stat-item" style={{ borderLeft: '3px solid #004f9f' }}>
          <span className="hd-stat-item__label">Tổng hoạt động quản lý</span>
          <span className="hd-stat-item__value">{schoolActivityIds.length}</span>
        </div>
      </div>

      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm tên đoàn viên, MSSV hoặc tên hoạt động (Trường)..."
      />

      <div className="hd-card">
        <table className="hd-table">
          <thead>
            <tr>
              <th>MSSV</th>
              <th>Họ và Tên</th>
              <th>Hoạt động (Cấp trường)</th>
              <th>Ngày đăng ký</th>
              <th>Thao tác duyệt</th>
            </tr>
          </thead>
          <tbody>
            {registrationsPending.map((reg, idx) => (
              <tr key={`${reg.idDV}-${reg.idHD}-${idx}`}>
                <td style={{ fontWeight: 600, color: '#004f9f' }}>{reg.idDV}</td>
                <td>{reg.hoTen}</td>
                <td style={{ fontWeight: 600, color: '#0d1f3c' }}>{reg.tenHD}</td>
                <td>{new Date(reg.ngayDangKi).toLocaleDateString('vi-VN')}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="hd-update-btn" style={{ color: '#15803d' }} title="Duyệt tham gia">
                      <CheckCircle size={18} /> Duyệt
                    </button>
                    <button className="hd-update-btn" style={{ color: '#b91c1c' }} title="Từ chối">
                      <XCircle size={18} /> Từ chối
                    </button>
                    <button className="hd-update-btn" title="Ghi chú">
                      <ClipboardCheck size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {registrationsPending.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  Hiện tại không có đơn đăng ký nào cấp trường đang chờ duyệt
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoatDongDuyet;
