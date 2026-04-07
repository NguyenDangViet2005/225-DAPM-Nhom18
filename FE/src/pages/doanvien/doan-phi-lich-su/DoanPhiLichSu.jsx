import { Wallet, CheckCircle, Clock } from 'lucide-react';
import { MOCK_DOAN_PHI, MOCK_MUC_DOAN_PHI } from '@/data/mockDoanPhi';
import './DoanPhiLichSu.css';

// Giả lập lịch sử đoàn phí của bản thân
const MY_ID = '23110245';

const MOCK_LICH_SU = [
  { namHoc: '2024-2025', soTien: 60000, trangThai: 'Đã đóng', ngayDong: '2024-10-20', idPhieuThu: 'PT01' },
  { namHoc: '2023-2024', soTien: 50000, trangThai: 'Đã đóng', ngayDong: '2023-11-05', idPhieuThu: 'PT00' },
  { namHoc: '2022-2023', soTien: 50000, trangThai: 'Đã đóng', ngayDong: '2022-10-18', idPhieuThu: 'PT-1' },
];

const DoanPhiLichSu = () => {
  const currentRate = MOCK_MUC_DOAN_PHI.find(r => r.trangThai === 'Áp dụng') || MOCK_MUC_DOAN_PHI[0];
  const myRecord = MOCK_DOAN_PHI.find(p => p.idDV === MY_ID);
  const namHocHienTai = currentRate.namHoc;
  const daDongNamNay = myRecord?.trangThai === 'Đã đóng';

  return (
    <div className="dpls-container">
      <div className="dpls-header">
        <h1 className="dpls-title">Lịch sử đoàn phí</h1>
      </div>

      {/* Trạng thái năm hiện tại */}
      <div className={`dpls-current-card ${daDongNamNay ? 'dpls-current-card--paid' : 'dpls-current-card--unpaid'}`}>
        <div className="dpls-current-icon">
          {daDongNamNay ? <CheckCircle size={28} /> : <Clock size={28} />}
        </div>
        <div>
          <p className="dpls-current-label">Năm học {namHocHienTai}</p>
          <p className="dpls-current-status">
            {daDongNamNay
              ? `Đã đóng đoàn phí — ${currentRate.soTien.toLocaleString()} ₫`
              : `Chưa đóng đoàn phí — ${currentRate.soTien.toLocaleString()} ₫`}
          </p>
        </div>
      </div>

      {/* Bảng lịch sử */}
      <div className="dpls-card">
        <h3 className="dpls-section-title">Lịch sử các năm</h3>
        <table className="dpls-table">
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
            {MOCK_LICH_SU.map((item, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 700 }}>{item.namHoc}</td>
                <td style={{ color: '#004f9f', fontWeight: 700 }}>{item.soTien.toLocaleString()} ₫</td>
                <td>{item.ngayDong ? new Date(item.ngayDong).toLocaleDateString('vi-VN') : '—'}</td>
                <td style={{ color: '#64748b' }}>{item.idPhieuThu || '—'}</td>
                <td>
                  <span className={`dpls-badge ${item.trangThai === 'Đã đóng' ? 'dpls-badge--paid' : 'dpls-badge--unpaid'}`}>
                    {item.trangThai}
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

export default DoanPhiLichSu;
