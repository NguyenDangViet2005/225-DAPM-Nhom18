import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import doanvienAPI from '@/apis/doanvien.api';
import './TinhTrangSo.css';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

const STATUS_CONFIG = {
  'Đang hoạt động': {
    cls: 'green',
    icon: <CheckCircle size={30} />,
    title: 'Sổ đoàn đang được lưu giữ',
    desc: (s) => `Cấp ngày ${fmtDate(s.ngayCap)} tại ${s.noiCap || '—'}`,
  },
  'Đã rút sổ': {
    cls: 'yellow',
    icon: <AlertTriangle size={30} />,
    title: 'Sổ đoàn đã được rút',
    desc: (s) => `Ngày rút: ${fmtDate(s.ngayRutSo)}`,
  },
  'Thất lạc': {
    cls: 'red',
    icon: <XCircle size={30} />,
    title: 'Sổ đoàn bị thất lạc',
    desc: () => 'Vui lòng liên hệ Đoàn trường để được hỗ trợ.',
  },
};

const TinhTrangSo = () => {
  const [soDoan, setSoDoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true);
      try {
        const result = await doanvienAPI.getMySoDoan();
        if (result.success) {
          setSoDoan(result.data);
        } else {
          setError(result.message || 'Không thể tải thông tin sổ đoàn');
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Chưa có thông tin sổ đoàn. Vui lòng liên hệ Đoàn trường.');
        } else {
          setError(err.response?.data?.message || 'Lỗi kết nối server');
        }
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, []);

  if (loading) {
    return (
      <div className="tts-container">
        <h1 className="tts-title">Tình trạng Sổ đoàn</h1>
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          Đang tải...
        </div>
      </div>
    );
  }

  if (error || !soDoan) {
    return (
      <div className="tts-container">
        <h1 className="tts-title">Tình trạng Sổ đoàn</h1>
        <div className="tts-banner tts-banner--yellow">
          <div className="tts-banner-icon tts-banner-icon--yellow">
            <BookOpen size={30} />
          </div>
          <div className="tts-banner-text">
            <h3>Chưa có thông tin sổ đoàn</h3>
            <p>{error || 'Vui lòng liên hệ Đoàn trường để được hỗ trợ.'}</p>
          </div>
        </div>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[soDoan.trangThai] ?? {
    cls: 'yellow',
    icon: <BookOpen size={30} />,
    title: soDoan.trangThai,
    desc: () => '',
  };

  return (
    <div className="tts-container">
      <h1 className="tts-title">Tình trạng Sổ đoàn</h1>

      {/* Status Banner */}
      <div className={`tts-banner tts-banner--${cfg.cls}`}>
        <div className={`tts-banner-icon tts-banner-icon--${cfg.cls}`}>{cfg.icon}</div>
        <div className="tts-banner-text">
          <h3>{cfg.title}</h3>
          <p>{cfg.desc(soDoan)}</p>
        </div>
      </div>

      {/* Detail Table */}
      <div className="tts-card">
        <table className="tts-table">
          <thead>
            <tr>
              <th>Mã sổ đoàn</th>
              <th>Ngày cấp</th>
              <th>Nơi cấp</th>
              <th>Trạng thái</th>
              <th>Ngày rút</th>
              <th>Ngày vào đoàn</th>
              <th>Nơi kết nạp</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 600, color: '#004f9f', fontFamily: 'monospace' }}>
                {soDoan.idSoDoan}
              </td>
              <td>{fmtDate(soDoan.ngayCap)}</td>
              <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{soDoan.noiCap || '—'}</td>
              <td>
                <span className={`tts-badge tts-badge--${cfg.cls}`}>
                  {soDoan.trangThai}
                </span>
              </td>
              <td>{fmtDate(soDoan.ngayRutSo)}</td>
              <td>{fmtDate(soDoan.ngayVaoDoan)}</td>
              <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{soDoan.noiKetNap || '—'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TinhTrangSo;
