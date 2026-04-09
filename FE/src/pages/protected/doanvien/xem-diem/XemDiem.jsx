import { MOCK_MY_DANG_KY } from '@/data/mockDoanVien';
import './XemDiem.css';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

const XemDiem = () => {
  const hoanThanh = MOCK_MY_DANG_KY.filter(dk => dk.trangThaiHoanThanh === 'Đã hoàn thành');
  const choDuyet  = MOCK_MY_DANG_KY.filter(dk => dk.trangThaiDuyet === 'Chờ duyệt');
  const tuChoi    = MOCK_MY_DANG_KY.filter(dk => dk.trangThaiDuyet === 'Từ chối');
  const tongDiem  = hoanThanh.reduce((s, dk) => s + (dk.diemDat || 0), 0);

  return (
    <div className="xd-container">
      <h1 className="xd-title">Điểm hoạt động</h1>

      {/* ── Score Hero ─────────────────────────────────── */}
      <div className="xd-hero">
        <div>
          <div className="xd-hero__score">{tongDiem}</div>
          <div className="xd-hero__label">Tổng điểm tích lũy</div>
        </div>
        <div className="xd-hero__breakdown">
          <div className="xd-hero__item">
            <span className="xd-hero__item-val">{hoanThanh.length}</span>
            <span className="xd-hero__item-lbl">Hoạt động hoàn thành</span>
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
            {MOCK_MY_DANG_KY.map((dk, i) => (
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default XemDiem;


