import { useState, useEffect } from 'react';
import { doanviendangkiAPI } from '@/apis/doanviendangki.api';
import './XemDiem.css';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

const XemDiem = () => {
  const [data, setData]         = useState([]);
  const [tongDiem, setTongDiem] = useState(0);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await doanviendangkiAPI.getXemDiem();
        if (res.success) {
          setData(res.data);
          setTongDiem(res.tongDiem ?? 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const hoanThanh = data.filter(dk => dk.trangThaiHoanThanh === 'Đã hoàn thành');
  const daDuyet   = data.filter(dk => dk.trangThaiDuyet === 'Đã duyệt');
  const choDuyet  = data.filter(dk => dk.trangThaiDuyet === 'Chờ duyệt');
  const tuChoi    = data.filter(dk => dk.trangThaiDuyet === 'Từ chối');

  return (
    <div className="xd-container">
      <h1 style={{ color: '#004f9f' }} className="xd-title">ĐIỂM HOẠT ĐỘNG</h1>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Đang tải...</div>
      )}

      {/* ── Score Hero ─────────────────────────────────── */}
      <div className="xd-hero">
        <div>
          <div className="xd-hero__score">{tongDiem}</div>
          <div className="xd-hero__label">Tổng điểm tích lũy</div>
        </div>
        <div className="xd-hero__breakdown">
          <div className="xd-hero__item">
            <span className="xd-hero__item-val">{daDuyet.length}</span>
            <span className="xd-hero__item-lbl">Đã được duyệt</span>
          </div>
          <div className="xd-hero__item">
            <span className="xd-hero__item-val">{choDuyet.length}</span>
            <span className="xd-hero__item-lbl">Đang chờ duyệt</span>
          </div>
          <div className="xd-hero__item">
            <span className="xd-hero__item-val">{tuChoi.length}</span>
            <span className="xd-hero__item-lbl">Bị từ chối</span>
          </div>
        </div>
      </div>

      {/* ── Detail Table ───────────────────────────────── */}
      <div className="xd-card">
        <table className="xd-table">
          <thead>
            <tr>
              <th>Tên hoạt động</th>
              <th>Ngày tổ chức</th>
              <th>Điểm tối đa</th>
              <th>Điểm đạt được</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {data.map((dk, i) => (
              <tr key={`${dk.idHD}-${i}`}>
                <td style={{ fontWeight: 600 }}>{dk.tenHD}</td>
                <td>{fmtDate(dk.ngayToChuc)}</td>
                <td style={{ color: '#64748b' }}>+{dk.diemHD}</td>
                <td style={{ fontWeight: 700, color: dk.diemDat ? '#15803d' : '#94a3b8' }}>
                  {dk.diemDat != null ? `+${dk.diemDat}` : '—'}
                </td>
                <td>
                  <span className={`xd-badge ${
                    dk.trangThaiHoanThanh === 'Đã hoàn thành' ? 'xd-badge--green' :
                    dk.trangThaiDuyet === 'Chờ duyệt'         ? 'xd-badge--yellow' :
                    dk.trangThaiDuyet === 'Từ chối'           ? 'xd-badge--red' :
                    'xd-badge--gray'
                  }`}>
                    {dk.trangThaiHoanThanh || dk.trangThaiDuyet}
                  </span>
                </td>
              </tr>
            ))}
            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  Chưa có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default XemDiem;
