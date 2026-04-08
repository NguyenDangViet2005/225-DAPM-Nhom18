import { useState, useMemo } from 'react';
import { Download, FileText, TrendingUp } from 'lucide-react';
import {
  MOCK_HOAT_DONG_KHOA,
  MOCK_DANG_KY_HOAT_DONG_KHOA,
  ACTIVITY_STATS_KHOA,
} from '@/data/mockHoatDongKhoa';
import './BaoCao.css';

// Mock top đoàn viên tích cực
const TOP_DOAN_VIEN = [
  { idDV: '23110006', hoTen: 'Vũ Thị Phương',   soHD: 3, tongDiem: 28 },
  { idDV: '23110007', hoTen: 'Đặng Quốc Hùng',  soHD: 3, tongDiem: 25 },
  { idDV: '23110002', hoTen: 'Trần Thị Bích',   soHD: 2, tongDiem: 15 },
  { idDV: '23110004', hoTen: 'Phạm Thị Dung',   soHD: 2, tongDiem: 10 },
  { idDV: '23110001', hoTen: 'Nguyễn Văn An',   soHD: 1, tongDiem: 5  },
];

const NAM_HOC_OPTIONS = ['2024-2025', '2023-2024', '2022-2023'];
const HOC_KY_OPTIONS  = ['Tất cả', 'Học kỳ I', 'Học kỳ II'];

const BaoCao = () => {
  const [namHoc, setNamHoc]   = useState('2024-2025');
  const [hocKy, setHocKy]     = useState('Tất cả');

  // Tính toán thống kê từ mock data
  const tongDangKy = MOCK_DANG_KY_HOAT_DONG_KHOA.length;
  const daDuyet    = MOCK_DANG_KY_HOAT_DONG_KHOA.filter((r) => r.trangThaiDuyet === 'Đã duyệt').length;
  const tyLeThamGia = tongDangKy > 0 ? Math.round((daDuyet / tongDangKy) * 100) : 0;

  // Thống kê theo từng hoạt động
  const thongKeHD = useMemo(() => {
    return MOCK_HOAT_DONG_KHOA.map((hd) => {
      const regs     = MOCK_DANG_KY_HOAT_DONG_KHOA.filter((r) => r.idHD === hd.idHD);
      const approved = regs.filter((r) => r.trangThaiDuyet === 'Đã duyệt').length;
      const tyLe     = hd.soLuongMax > 0 ? Math.round((hd.soLuongDaDK / hd.soLuongMax) * 100) : 0;
      return { ...hd, soApproved: approved, tyLeDangKy: tyLe };
    });
  }, []);

  const getBadgeClass = (trangThai) => {
    switch (trangThai) {
      case 'Đang mở đăng ký': return 'bc-badge--open';
      case 'Đang diễn ra':    return 'bc-badge--ongoing';
      default:                return 'bc-badge--ended';
    }
  };

  return (
    <div className="bc-container">
      {/* Header */}
      <div className="bc-header">
        <h1 className="bc-title">Báo cáo & Thống kê Hoạt động Khoa</h1>
        <div className="bc-actions">
          <button className="bc-btn">
            <Download size={17} /> Xuất Excel
          </button>
          <button
            className="bc-btn"
            style={{ backgroundColor: '#004f9f', borderColor: '#004f9f', color: '#fff' }}
          >
            <FileText size={17} /> Xuất báo cáo PDF
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="bc-filter-bar">
        <span className="bc-filter-label">Lọc theo:</span>
        <select className="bc-select" value={namHoc} onChange={(e) => setNamHoc(e.target.value)}>
          {NAM_HOC_OPTIONS.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <select className="bc-select" value={hocKy} onChange={(e) => setHocKy(e.target.value)}>
          {HOC_KY_OPTIONS.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
        <button className="bc-btn">
          <TrendingUp size={16} /> Áp dụng
        </button>
      </div>

      {/* Stats */}
      <div className="bc-stats">
        <div className="bc-stat-card" style={{ '--bc-accent': '#004f9f' }}>
          <span className="bc-stat-card__label">Tổng hoạt động</span>
          <span className="bc-stat-card__value">{ACTIVITY_STATS_KHOA.tongHoatDong}</span>
          <span className="bc-stat-card__sub">Năm học {namHoc}</span>
        </div>
        <div className="bc-stat-card" style={{ '--bc-accent': '#15803d' }}>
          <span className="bc-stat-card__label">Đoàn viên tham gia</span>
          <span className="bc-stat-card__value">{ACTIVITY_STATS_KHOA.tongDoanVienThamGia}</span>
          <span className="bc-stat-card__sub">Lượt tham gia</span>
        </div>
        <div className="bc-stat-card" style={{ '--bc-accent': '#0369a1' }}>
          <span className="bc-stat-card__label">Tỷ lệ tham gia</span>
          <span className="bc-stat-card__value">{tyLeThamGia}%</span>
          <span className="bc-stat-card__sub">{daDuyet}/{tongDangKy} đơn được duyệt</span>
        </div>
        <div className="bc-stat-card" style={{ '--bc-accent': '#b45309' }}>
          <span className="bc-stat-card__label">Tổng điểm đã cấp</span>
          <span className="bc-stat-card__value">{ACTIVITY_STATS_KHOA.tongDiemDaCap}</span>
          <span className="bc-stat-card__sub">Điểm hoạt động</span>
        </div>
      </div>

      {/* Content grid */}
      <div className="bc-content-grid">

        {/* Bảng thống kê theo hoạt động */}
        <div className="bc-card">
          <div className="bc-card-header">
            <span className="bc-card-title">Thống kê theo Hoạt động</span>
          </div>
          <table className="bc-table">
            <thead>
              <tr>
                <th>Tên hoạt động</th>
                <th>Đăng ký / Tối đa</th>
                <th>Đã duyệt</th>
                <th>Điểm HD</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {thongKeHD.map((hd) => (
                <tr key={hd.idHD}>
                  <td style={{ fontWeight: 600, color: '#0d1f3c' }}>{hd.tenHD}</td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>
                      {hd.soLuongDaDK}/{hd.soLuongMax}
                    </div>
                    <div className="bc-progress-wrap">
                      <div
                        className="bc-progress-bar"
                        style={{ width: `${hd.tyLeDangKy}%` }}
                      />
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#15803d', textAlign: 'center' }}>
                    {hd.soApproved}
                  </td>
                  <td style={{ fontWeight: 800, color: '#004f9f', textAlign: 'center' }}>
                    +{hd.diemHD}
                  </td>
                  <td>
                    <span className={`bc-badge ${getBadgeClass(hd.trangThaiHD)}`}>
                      {hd.trangThaiHD}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top đoàn viên tích cực */}
        <div className="bc-card">
          <div className="bc-card-header">
            <span className="bc-card-title">Top Đoàn viên tích cực</span>
          </div>
          <div className="bc-top-list">
            {TOP_DOAN_VIEN.map((dv, idx) => (
              <div key={dv.idDV} className="bc-top-item">
                <div
                  className="bc-top-item__rank"
                  style={{ background: idx === 0 ? '#b45309' : idx === 1 ? '#64748b' : idx === 2 ? '#92400e' : '#004f9f' }}
                >
                  {idx + 1}
                </div>
                <div className="bc-top-item__info">
                  <div className="bc-top-item__name">{dv.hoTen}</div>
                  <div className="bc-top-item__sub">{dv.soHD} hoạt động</div>
                </div>
                <div className="bc-top-item__score">{dv.tongDiem} đ</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BaoCao;
