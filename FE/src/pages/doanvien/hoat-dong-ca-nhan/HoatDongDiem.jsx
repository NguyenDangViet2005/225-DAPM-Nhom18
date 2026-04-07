import { Star, TrendingUp, Award } from 'lucide-react';
import './HoatDongCaNhan.css';

// Mock điểm hoạt động của bản thân
const MOCK_DIEM = [
  { tenHD: 'Mùa hè xanh 2024',           ngay: '2024-07-01', diem: 15, trangThai: 'Đã xác nhận' },
  { tenHD: 'Ngày chủ nhật xanh tháng 10', ngay: '2024-10-10', diem: 2,  trangThai: 'Đã xác nhận' },
  { tenHD: 'Hội thảo Kỹ năng khởi nghiệp',ngay: '2024-11-15', diem: 5,  trangThai: 'Chờ xác nhận' },
];

const TIEU_CHUAN = 30; // điểm chuẩn/năm

const HoatDongDiem = () => {
  const tongDiem = MOCK_DIEM.filter(d => d.trangThai === 'Đã xác nhận').reduce((s, d) => s + d.diem, 0);
  const pct = Math.min(Math.round((tongDiem / TIEU_CHUAN) * 100), 100);

  return (
    <div className="hdcn-container">
      <div className="hdcn-header">
        <h1 className="hdcn-title">Điểm hoạt động</h1>
      </div>

      {/* Tổng điểm */}
      <div className="hdcn-score-card">
        <div className="hdcn-score-left">
          <Award size={40} style={{ color: '#004f9f', opacity: 0.8 }} />
          <div>
            <p className="hdcn-score-label">Tổng điểm đã xác nhận</p>
            <p className="hdcn-score-value">{tongDiem} <span>/ {TIEU_CHUAN} điểm</span></p>
          </div>
        </div>
        <div className="hdcn-score-right">
          <div className="hdcn-score-progress-wrap">
            <div className="hdcn-score-progress-bar" style={{ width: `${pct}%` }} />
          </div>
          <p className="hdcn-score-pct">{pct}% tiêu chuẩn năm học</p>
        </div>
      </div>

      {/* Bảng chi tiết */}
      <div className="hdcn-card">
        <h3 className="hdcn-section-title">Chi tiết điểm từng hoạt động</h3>
        <table className="hdcn-table">
          <thead>
            <tr>
              <th>Tên hoạt động</th>
              <th>Ngày tổ chức</th>
              <th>Điểm</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_DIEM.map((d, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600, color: '#0d1f3c' }}>{d.tenHD}</td>
                <td>{new Date(d.ngay).toLocaleDateString('vi-VN')}</td>
                <td>
                  <span className="hdcn-diem-cell">
                    <Star size={13} style={{ color: '#f59e0b' }} /> {d.diem}
                  </span>
                </td>
                <td>
                  <span className={`hdcn-badge ${d.trangThai === 'Đã xác nhận' ? 'hdcn-badge--approved' : 'hdcn-badge--pending'}`}>
                    {d.trangThai}
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

export default HoatDongDiem;
