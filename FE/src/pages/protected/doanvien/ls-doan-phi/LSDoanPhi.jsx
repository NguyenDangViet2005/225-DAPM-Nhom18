import { Wallet, CheckCircle, Clock } from 'lucide-react';
import { MOCK_MY_DOAN_PHI } from '@/data/mockDoanVien';
import './LSDoanPhi.css';

const fmtDate  = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';
const fmtMoney = (n) => n ? `${Number(n).toLocaleString()} ₫` : '—';

const LSDoanPhi = () => {
  const daDong   = MOCK_MY_DOAN_PHI.filter(d => d.trangThai === 'Đã đóng');
  const chuaDong = MOCK_MY_DOAN_PHI.filter(d => d.trangThai === 'Chưa đóng');
  const tongDaDong = daDong.reduce((s, d) => s + (d.soTien || 0), 0);

  return (
    <div className="lsdp-container">
      <h1 className="lsdp-title">Lịch sử đóng Đoàn phí</h1>

      {/* ── Stats ──────────────────────────────────────── */}
      <div className="lsdp-stats">
        <div className="lsdp-stat-item">
          <span className="lsdp-stat-item__label">Tổng đã đóng</span>
          <span className="lsdp-stat-item__value">{fmtMoney(tongDaDong)}</span>
          <Wallet size={36} style={{ position: 'absolute', right: 16, bottom: 16, opacity: 0.05 }} />
        </div>
        <div className="lsdp-stat-item" style={{ borderLeft: '3px solid #15803d' }}>
          <span className="lsdp-stat-item__label">Năm đã đóng</span>
          <span className="lsdp-stat-item__value">{daDong.length} / {MOCK_MY_DOAN_PHI.length}</span>
          <CheckCircle size={36} style={{ position: 'absolute', right: 16, bottom: 16, opacity: 0.08, color: '#15803d' }} />
        </div>
        <div className="lsdp-stat-item" style={{ borderLeft: '3px solid #b91c1c' }}>
          <span className="lsdp-stat-item__label">Còn nợ</span>
          <span className="lsdp-stat-item__value">{chuaDong.length} năm</span>
          <Clock size={36} style={{ position: 'absolute', right: 16, bottom: 16, opacity: 0.08, color: '#b91c1c' }} />
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────── */}
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
            {MOCK_MY_DOAN_PHI.map(dp => (
              <tr key={dp.idDoanPhi}>
                <td style={{ fontWeight: 600 }}>{dp.namHoc}</td>
                <td style={{ fontWeight: 700, color: '#0d1f3c' }}>{fmtMoney(dp.soTien)}</td>
                <td>{fmtDate(dp.ngayDong)}</td>
                <td style={{ fontFamily: 'monospace', color: '#004f9f' }}>{dp.idPhieuThu || '—'}</td>
                <td>
                  <span className={`lsdp-badge ${dp.trangThai === 'Đã đóng' ? 'lsdp-badge--paid' : 'lsdp-badge--unpaid'}`}>
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

