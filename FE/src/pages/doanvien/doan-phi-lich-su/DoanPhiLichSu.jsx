import { CheckCircle, Clock } from 'lucide-react';
import { MOCK_DOAN_PHI, MOCK_MUC_DOAN_PHI } from '@/data/mockDoanPhi';
import '@/pages/bithu/bithu.css';

const MY_ID = '23110245';
const MOCK_LICH_SU = [
  { namHoc: '2024-2025', soTien: 60000, trangThai: 'Đã đóng', ngayDong: '2024-10-20', idPhieuThu: 'PT01' },
  { namHoc: '2023-2024', soTien: 50000, trangThai: 'Đã đóng', ngayDong: '2023-11-05', idPhieuThu: 'PT00' },
  { namHoc: '2022-2023', soTien: 50000, trangThai: 'Đã đóng', ngayDong: '2022-10-18', idPhieuThu: 'PT-1' },
];

const DoanPhiLichSu = () => {
  const currentRate = MOCK_MUC_DOAN_PHI.find(r => r.trangThai === 'Áp dụng') || MOCK_MUC_DOAN_PHI[0];
  const myRecord = MOCK_DOAN_PHI.find(p => p.idDV === MY_ID);
  const daDong = myRecord?.trangThai === 'Đã đóng';

  return (
    <div className="bt-page">
      <div className="bt-header">
        <h1 className="bt-title">Lịch sử đoàn phí</h1>
      </div>

      {/* Trạng thái năm hiện tại */}
      <div className="bt-glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderLeft: `4px solid ${daDong ? '#10b981' : '#f59e0b'}` }}>
        <div style={{ color: daDong ? '#10b981' : '#f59e0b' }}>
          {daDong ? <CheckCircle size={32} /> : <Clock size={32} />}
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--bt-text-muted)', marginBottom: 4 }}>
            Năm học {currentRate.namHoc}
          </p>
          <p style={{ fontSize: '1.1rem', fontWeight: 800, color: daDong ? '#059669' : '#d97706' }}>
            {daDong ? `Đã đóng đoàn phí — ${currentRate.soTien.toLocaleString()} ₫` : `Chưa đóng đoàn phí — ${currentRate.soTien.toLocaleString()} ₫`}
          </p>
        </div>
      </div>

      <div className="bt-glass bt-table-card">
        <div className="bt-table-card__header">
          <h3 className="bt-table-card__title">Lịch sử các năm</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="bt-table">
            <thead>
              <tr><th>Năm học</th><th>Số tiền</th><th>Ngày đóng</th><th>Mã phiếu thu</th><th>Trạng thái</th></tr>
            </thead>
            <tbody>
              {MOCK_LICH_SU.map((item, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700 }}>{item.namHoc}</td>
                  <td style={{ color: 'var(--bt-blue)', fontWeight: 700 }}>{item.soTien.toLocaleString()} ₫</td>
                  <td style={{ color: 'var(--bt-text-muted)' }}>{item.ngayDong ? new Date(item.ngayDong).toLocaleDateString('vi-VN') : '—'}</td>
                  <td style={{ color: 'var(--bt-text-muted)' }}>{item.idPhieuThu || '—'}</td>
                  <td><span className={`bt-status ${item.trangThai === 'Đã đóng' ? 'bt-status--paid' : 'bt-status--unpaid'}`}>{item.trangThai}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoanPhiLichSu;
