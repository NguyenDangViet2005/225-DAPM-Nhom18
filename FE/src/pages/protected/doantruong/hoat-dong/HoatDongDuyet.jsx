import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, X, Filter } from 'lucide-react';
import DataTableToolbar from '@/components/commons/DataTableToolbar/DataTableToolbar';
import './HoatDong.css';

const API = 'http://localhost:5000/api/hoatdong';

const HoatDongDuyet = () => {
  const [searchTerm, setSearchTerm]     = useState('');
  const [statusFilter, setStatusFilter] = useState('Chờ duyệt'); // bộ lọc trạng thái
  const [hdFilter, setHdFilter]         = useState('all');        // bộ lọc theo hoạt động
  const [showFilter, setShowFilter]     = useState(false);

  const [schoolActivities, setSchoolActivities] = useState([]);
  const [registrations, setRegistrations]       = useState([]);
  const [loading, setLoading]                   = useState(false);
  const [processingId, setProcessingId]         = useState(null);

  // Modal từ chối
  const [rejectTarget, setRejectTarget] = useState(null);
  const [lyDoTuChoi, setLyDoTuChoi]     = useState('');

  // 1. Fetch danh sách hoạt động Đoàn Trường từ DB
  const fetchActivities = useCallback(async () => {
    try {
      const res  = await fetch(`${API}?donViToChuc=Đoàn Trường`);
      const json = await res.json();
      if (json.success) setSchoolActivities(json.data);
    } catch (err) {
      console.error('Lỗi fetch hoạt động:', err);
    }
  }, []);

  // 2. Fetch đăng ký từ tất cả hoạt động Đoàn Trường
  const fetchRegistrations = useCallback(async (activities) => {
    if (!activities.length) return;
    setLoading(true);
    try {
      const results = await Promise.all(
        activities.map(hd =>
          fetch(`${API}/${hd.idHD}/dangky`)
            .then(r => r.json())
            .then(json => json.success
              ? json.data.map(reg => ({ ...reg, idHD: hd.idHD, tenHD: hd.tenHD }))
              : []
            )
            .catch(() => [])
        )
      );
      setRegistrations(results.flat());
    } catch (err) {
      console.error('Lỗi fetch đăng ký:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    if (schoolActivities.length) fetchRegistrations(schoolActivities);
  }, [schoolActivities, fetchRegistrations]);

  // Duyệt / Từ chối
  const handleDuyet = async (maSV, idHD, trangThai, lyDo = null) => {
    const key = `${maSV}-${idHD}`;
    setProcessingId(key);
    try {
      const res  = await fetch(`${API}/${idHD}/duyet`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maSV, trangThai, lyDo }),
      });
      const json = await res.json();
      if (json.success) {
        setRegistrations(prev =>
          prev.map(r => r.maSV === maSV && r.idHD === idHD ? { ...r, trangThai } : r)
        );
      } else {
        alert(json.message || 'Có lỗi xảy ra');
      }
    } catch {
      alert('Không thể kết nối server');
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectTarget) return;
    await handleDuyet(rejectTarget.maSV, rejectTarget.idHD, 'Từ chối', lyDoTuChoi);
    setRejectTarget(null);
    setLyDoTuChoi('');
  };

  // Stats
  const pendingRegs  = registrations.filter(r => r.trangThai === 'Chờ duyệt');
  const approvedRegs = registrations.filter(r => r.trangThai === 'Đã duyệt');
  const rejectedRegs = registrations.filter(r => r.trangThai === 'Từ chối');

  // Lọc hiển thị
  const filtered = registrations.filter(reg => {
    const matchSearch =
      (reg.hoTen  || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reg.maSV   || '').includes(searchTerm) ||
      (reg.tenHD  || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || reg.trangThai === statusFilter;
    const matchHD     = hdFilter === 'all' || reg.idHD === hdFilter;
    return matchSearch && matchStatus && matchHD;
  });

  return (
    <div className="hd-container">
      {/* Header */}
      <div className="hd-header">
        <h1 className="hd-title">Duyệt đăng ký Đoàn trường</h1>
        <div className="hd-actions">
          <button
            className="hd-update-btn"
            style={{ backgroundColor: '#15803d', borderColor: '#15803d', color: '#fff' }}
            disabled={pendingRegs.length === 0}
            onClick={async () => {
              for (const reg of pendingRegs) await handleDuyet(reg.maSV, reg.idHD, 'Đã duyệt');
            }}
          >
            <CheckCircle size={18} />
            Duyệt hàng loạt ({pendingRegs.length})
          </button>
        </div>
      </div>

      {/* Stats — lấy từ DB */}
      <div className="hd-stats">
        <div className="hd-stat-item" style={{ borderLeft: '3px solid #b45309', cursor: 'pointer' }}
          onClick={() => setStatusFilter('Chờ duyệt')}>
          <span className="hd-stat-item__label">Chờ xử lý (Cấp trường)</span>
          <span className="hd-stat-item__value" style={{ color: '#b45309' }}>{pendingRegs.length} đơn</span>
        </div>
        <div className="hd-stat-item" style={{ borderLeft: '3px solid #15803d', cursor: 'pointer' }}
          onClick={() => setStatusFilter('Đã duyệt')}>
          <span className="hd-stat-item__label">Đã duyệt</span>
          <span className="hd-stat-item__value" style={{ color: '#15803d' }}>{approvedRegs.length} đơn</span>
        </div>
        <div className="hd-stat-item" style={{ borderLeft: '3px solid #dc2626', cursor: 'pointer' }}
          onClick={() => setStatusFilter('Từ chối')}>
          <span className="hd-stat-item__label">Từ chối</span>
          <span className="hd-stat-item__value" style={{ color: '#dc2626' }}>{rejectedRegs.length} đơn</span>
        </div>
        <div className="hd-stat-item" style={{ borderLeft: '3px solid #004f9f' }}>
          <span className="hd-stat-item__label">Tổng hoạt động quản lý</span>
          <span className="hd-stat-item__value">{schoolActivities.length}</span>
        </div>
      </div>

      {/* Toolbar + Bộ lọc */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          <DataTableToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Tìm tên đoàn viên, MSSV hoặc tên hoạt động (Trường)..."
          />
        </div>
        <button
          className="hd-update-btn"
          style={{ whiteSpace: 'nowrap', borderColor: showFilter ? '#004f9f' : undefined, color: showFilter ? '#004f9f' : undefined }}
          onClick={() => setShowFilter(v => !v)}
        >
          <Filter size={16} /> Bộ lọc
        </button>
      </div>

      {/* Panel bộ lọc */}
      {showFilter && (
        <div style={{ display: 'flex', gap: '12px', padding: '1rem', background: '#f8fafc', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Trạng thái</label>
            <select className="hd-filter-select" style={{ width: '100%' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="Chờ duyệt">Chờ duyệt</option>
              <option value="Đã duyệt">Đã duyệt</option>
              <option value="Từ chối">Từ chối</option>
            </select>
          </div>
          <div style={{ flex: 2 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Hoạt động</label>
            <select className="hd-filter-select" style={{ width: '100%' }} value={hdFilter} onChange={e => setHdFilter(e.target.value)}>
              <option value="all">Tất cả hoạt động</option>
              {schoolActivities.map(hd => (
                <option key={hd.idHD} value={hd.idHD}>{hd.tenHD}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="hd-update-btn" onClick={() => { setStatusFilter('Chờ duyệt'); setHdFilter('all'); setSearchTerm(''); }}>
              Đặt lại
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="hd-card">
        <table className="hd-table">
          <thead>
            <tr>
              <th>MSSV</th>
              <th>Họ và Tên</th>
              <th>Chi đoàn</th>
              <th>Hoạt động (Cấp trường)</th>
              <th>Ngày đăng ký</th>
              <th>Trạng thái</th>
              <th>Thao tác duyệt</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Đang tải...</td></tr>
            ) : filtered.map((reg, idx) => {
              const key          = `${reg.maSV}-${reg.idHD}`;
              const isProcessing = processingId === key;
              const isPending    = reg.trangThai === 'Chờ duyệt';
              return (
                <tr key={`${key}-${idx}`}>
                  <td style={{ fontWeight: 600, color: '#004f9f' }}>{reg.maSV}</td>
                  <td>{reg.hoTen}</td>
                  <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{reg.tenChiDoan || '—'}</td>
                  <td style={{ fontWeight: 600, color: '#0d1f3c' }}>{reg.tenHD}</td>
                  <td>{new Date(reg.ngayDangKy).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <span className={`hd-badge ${
                      reg.trangThai === 'Đã duyệt' ? 'hd-badge--open' :
                      reg.trangThai === 'Chờ duyệt' ? 'hd-badge--ongoing' : 'hd-badge--closed'
                    }`}>
                      {reg.trangThai}
                    </span>
                  </td>
                  <td>
                    {isPending ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="hd-update-btn" style={{ color: '#15803d' }}
                          disabled={isProcessing}
                          onClick={() => handleDuyet(reg.maSV, reg.idHD, 'Đã duyệt')}>
                          <CheckCircle size={18} /> Duyệt
                        </button>
                        <button className="hd-update-btn" style={{ color: '#b91c1c' }}
                          disabled={isProcessing}
                          onClick={() => setRejectTarget({ maSV: reg.maSV, idHD: reg.idHD, hoTen: reg.hoTen })}>
                          <XCircle size={18} /> Từ chối
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Đã xử lý</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  Không có đơn đăng ký nào phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal từ chối */}
      {rejectTarget && (
        <div className="dp-modal-overlay">
          <div className="dp-modal" style={{ width: '480px', maxWidth: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="dp-modal-title">Từ chối đăng ký</h2>
              <button className="dp-update-btn" onClick={() => { setRejectTarget(null); setLyDoTuChoi(''); }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ margin: '0.75rem 0', color: '#475569' }}>
              Từ chối đăng ký của <strong>{rejectTarget.hoTen}</strong>
            </p>
            <textarea
              style={{ width: '100%', minHeight: '100px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box' }}
              placeholder="Nhập lý do từ chối (không bắt buộc)..."
              value={lyDoTuChoi}
              onChange={e => setLyDoTuChoi(e.target.value)}
            />
            <div className="dp-modal-actions">
              <button className="dp-btn-cancel" onClick={() => { setRejectTarget(null); setLyDoTuChoi(''); }}>Hủy</button>
              <button className="dp-btn-save" style={{ background: '#b91c1c', borderColor: '#b91c1c' }} onClick={handleConfirmReject}>
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoatDongDuyet;
