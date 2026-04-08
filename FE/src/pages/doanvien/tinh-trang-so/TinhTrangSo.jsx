import { BookOpen, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { MOCK_MY_SO_DOAN } from '@/data/mockDoanVien';
import './TinhTrangSo.css';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

const STATUS_CONFIG = {
  'Đang lưu giữ': {
    cls: 'green',
    icon: <CheckCircle size={30} />,
    title: 'Sổ đoàn đang được lưu giữ',
    desc: (s) => `Cấp ngày ${fmtDate(s.ngayCap)} tại ${s.noiCap}`,
  },
  'Đã rút': {
    cls: 'yellow',
    icon: <AlertTriangle size={30} />,
    title: 'Sổ đoàn đã được rút',
    desc: (s) => `Ngày rút: ${fmtDate(s.ngayRutSo)}${s.ghiChu ? ' — ' + s.ghiChu : ''}`,
  },
  'Thất lạc': {
    cls: 'red',
    icon: <XCircle size={30} />,
    title: 'Sổ đoàn bị thất lạc',
    desc: (s) => s.ghiChu || 'Vui lòng liên hệ Đoàn trường để được hỗ trợ.',
  },
};

const TinhTrangSo = () => {
  const soDoan = MOCK_MY_SO_DOAN;
  const cfg = STATUS_CONFIG[soDoan.trangThai] ?? {
    cls: 'yellow',
    icon: <BookOpen size={30} />,
    title: soDoan.trangThai,
    desc: () => '',
  };

  return (
    <div className="tts-container">
      <h1 className="tts-title">Tình trạng Sổ đoàn</h1>

      {/* ── Status Banner ──────────────────────────────── */}
      <div className={`tts-banner tts-banner--${cfg.cls}`}>
        <div className={`tts-banner-icon tts-banner-icon--${cfg.cls}`}>{cfg.icon}</div>
        <div className="tts-banner-text">
          <h3>{cfg.title}</h3>
          <p>{cfg.desc(soDoan)}</p>
        </div>
      </div>

      {/* ── Detail Table ───────────────────────────────── */}
      <div className="tts-card">
        <table className="tts-table">
          <thead>
            <tr>
              <th>Mã sổ đoàn</th>
              <th>Ngày cấp</th>
              <th>Nơi cấp</th>
              <th>Trạng thái</th>
              <th>Ngày rút</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 600, color: '#004f9f', fontFamily: 'monospace' }}>
                {soDoan.idSoDoan}
              </td>
              <td>{fmtDate(soDoan.ngayCap)}</td>
              <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{soDoan.noiCap}</td>
              <td>
                <span className={`tts-badge tts-badge--${cfg.cls}`}>
                  {soDoan.trangThai}
                </span>
              </td>
              <td>{fmtDate(soDoan.ngayRutSo)}</td>
              <td style={{ color: '#64748b' }}>{soDoan.ghiChu || '—'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TinhTrangSo;
