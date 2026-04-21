import { useState, useEffect } from 'react';
import { Wallet, CheckCircle, Clock } from 'lucide-react';
import doanvienAPI from '@/apis/doanvien.api';
import './LSDoanPhi.css';

const fmtDate  = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';
const fmtMoney = (n) => n ? `${Number(n).toLocaleString()} ₫` : '—';

const getBadgeClass = (trangThai) => {
  switch (trangThai) {
    case 'Đã đóng':        return 'lsdp-badge--paid';
    case 'Đang chờ duyệt': return 'lsdp-badge--pending';
    default:               return 'lsdp-badge--unpaid';
  }
};

const LSDoanPhi = () => {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true);
      try {
        const result = await doanvienAPI.getMyDoanPhi();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message || 'Không thể tải lịch sử đoàn phí');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Lỗi kết nối server');
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, []);

  const daDong     = data.filter(d => d.trangThai === 'Đã đóng');
  const chuaDong   = data.filter(d => d.trangThai === 'Chưa đóng');
  const tongDaDong = daDong.reduce((s, d) => s + Number(d.soTien || 0), 0);

  if (loading) {
    return (
      <div className="lsdp-container">
        <h1 className="lsdp-title">Lịch sử đóng Đoàn phí</h1>
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lsdp-container">
        <h1 className="lsdp-title">Lịch sử đóng Đoàn phí</h1>
        <div style={{ padding: '12px 16px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="lsdp-container">
      <h1 className="lsdp-title">Lịch sử đóng Đoàn phí</h1>

      {/* Stats */}
      <div className="lsdp-stats">
        <div className="lsdp-stat-item">
          <span className="lsdp-stat-item__label">Tổng đã đóng</span>
          <span className="lsdp-stat-item__value">{fmtMoney(tongDaDong)}</span>
          <Wallet size={36} style={{ position: 'absolute', right: 16, bottom: 16, opacity: 0.05 }} />
        </div>
        <div className="lsdp-stat-item" style={{ borderLeft: '3px solid #15803d' }}>
          <span className="lsdp-stat-item__label">Năm đã đóng</span>
          <span className="lsdp-stat-item__value">{daDong.length} / {data.length}</span>
          <CheckCircle size={36} style={{ position: 'absolute', right: 16, bottom: 16, opacity: 0.08, color: '#15803d' }} />
        </div>
        <div className="lsdp-stat-item" style={{ borderLeft: '3px solid #b91c1c' }}>
          <span className="lsdp-stat-item__label">Còn nợ</span>
          <span className="lsdp-stat-item__value">{chuaDong.length} năm</span>
          <Clock size={36} style={{ position: 'absolute', right: 16, bottom: 16, opacity: 0.08, color: '#b91c1c' }} />
        </div>
      </div>

      {/* Table */}
      <div className="lsdp-card">
        <table className="lsdp-table">
          <thead>
            <tr>
              <th>Năm học</th>
              <th>Số tiền</th>
              <th>Ngày đóng</th>
              <th>Mã phiếu thu</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  Chưa có dữ liệu đoàn phí
                </td>
              </tr>
            ) : data.map(dp => (
              <tr key={dp.idDoanPhi}>
                <td style={{ fontWeight: 600 }}>{dp.namHoc || '—'}</td>
                <td style={{ fontWeight: 700, color: '#0d1f3c' }}>{fmtMoney(dp.soTien)}</td>
                <td>{fmtDate(dp.ngayDong)}</td>
                <td style={{ fontFamily: 'monospace', color: '#004f9f' }}>{dp.idPhieuThu || '—'}</td>
                <td>
                  <span className={`lsdp-badge ${getBadgeClass(dp.trangThai)}`}>
                    {dp.trangThai}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LSDoanPhi;
