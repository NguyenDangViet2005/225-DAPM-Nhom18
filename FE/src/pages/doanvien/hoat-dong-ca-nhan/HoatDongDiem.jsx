import { Star, Award } from 'lucide-react';
import '@/pages/bithu/bithu.css';

const MOCK_DIEM = [
  { tenHD: 'Mùa hè xanh 2024',            ngay: '2024-07-01', diem: 15, trangThai: 'Đã xác nhận' },
  { tenHD: 'Ngày chủ nhật xanh tháng 10',  ngay: '2024-10-10', diem: 2,  trangThai: 'Đã xác nhận' },
  { tenHD: 'Hội thảo Kỹ năng khởi nghiệp', ngay: '2024-11-15', diem: 5,  trangThai: 'Chờ xác nhận' },
];
const TIEU_CHUAN = 30;

const HoatDongDiem = () => {
  const tongDiem = MOCK_DIEM.filter(d => d.trangThai === 'Đã xác nhận').reduce((s, d) => s + d.diem, 0);
  const pct = Math.min(Math.round((tongDiem / TIEU_CHUAN) * 100), 100);

  return (
    <div className="bt-page">
      <div className="bt-header">
        <h1 className="bt-title">Điểm hoạt động</h1>
      </div>

      {/* Score card */}
      <div className="bt-glass" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(0,79,159,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={32} style={{ color: 'var(--bt-blue)' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--bt-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Tổng điểm đã xác nhận</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--bt-blue)', letterSpacing: -1, lineHeight: 1 }}>
              {tongDiem} <span style={{ fontSize: '1rem', color: 'var(--bt-text-light)', fontWeight: 600 }}>/ {TIEU_CHUAN} điểm</span>
            </p>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ height: 10, background: 'rgba(0,79,159,0.1)', borderRadius: 5, overflow: 'hidden', marginBottom: '0.5rem' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--bt-blue), var(--bt-cyan))', borderRadius: 5, transition: 'width 0.5s' }} />
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--bt-text-muted)', fontWeight: 600 }}>{pct}% tiêu chuẩn năm học</p>
        </div>
      </div>

      <div className="bt-glass bt-table-card">
        <div className="bt-table-card__header">
          <h3 className="bt-table-card__title">Chi tiết điểm từng hoạt động</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="bt-table">
            <thead>
              <tr><th>Tên hoạt động</th><th>Ngày tổ chức</th><th>Điểm</th><th>Trạng thái</th></tr>
            </thead>
            <tbody>
              {MOCK_DIEM.map((d, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{d.tenHD}</td>
                  <td style={{ color: 'var(--bt-text-muted)' }}>{new Date(d.ngay).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
                      <Star size={13} style={{ color: '#f59e0b' }} /> {d.diem}
                    </span>
                  </td>
                  <td>
                    <span className={`bt-status ${d.trangThai === 'Đã xác nhận' ? 'bt-status--approved' : 'bt-status--pending'}`}>
                      {d.trangThai}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HoatDongDiem;
