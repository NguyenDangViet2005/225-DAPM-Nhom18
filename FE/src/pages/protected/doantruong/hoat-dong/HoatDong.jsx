import { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Filter,
  BarChart,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { MOCK_HOAT_DONG, ACTIVITY_STATS } from '@/data/mockHoatDong';
import './HoatDong.css';

const HoatDong = () => {
  const [activeTab, setActiveTab] = useState('activities');
  const [searchTerm, setSearchTerm] = useState('');
  const [hdFilter, setHdFilter] = useState('all');

  // State cho tab đăng ký
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [processingId, setProcessingId] = useState(null); // maSV-idHD đang xử lý

  // State modal từ chối
  const [rejectTarget, setRejectTarget] = useState(null); // { maSV, idHD, hoTen }
  const [lyDoTuChoi, setLyDoTuChoi] = useState('');

  // Fetch danh sách đăng ký chờ duyệt từ tất cả hoạt động
  const fetchRegistrations = useCallback(async () => {
    setLoadingRegs(true);
    try {
      // Lấy danh sách từ tất cả hoạt động đang mở
      const openActivities = MOCK_HOAT_DONG.filter(hd => hd.trangThaiHD === 'Đang mở đăng ký');
      const results = await Promise.all(
        openActivities.map(hd =>
          fetch(`http://localhost:5000/api/hoatdong/${hd.idHD}/dangky`)
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
      setLoadingRegs(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'registrations') fetchRegistrations();
  }, [activeTab, fetchRegistrations]);

  // Duyệt hoặc từ chối
  const handleDuyet = async (maSV, idHD, trangThai, lyDo = null) => {
    const key = `${maSV}-${idHD}`;
    setProcessingId(key);
    try {
      const res = await fetch(`http://localhost:5000/api/hoatdong/${idHD}/duyet`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maSV, trangThai, lyDo }),
      });
      const json = await res.json();
      if (json.success) {
        // Cập nhật state local thay vì fetch lại toàn bộ
        setRegistrations(prev =>
          prev.map(r =>
            r.maSV === maSV && r.idHD === idHD
              ? { ...r, trangThai }
              : r
          )
        );
      } else {
        alert(json.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      console.error('Lỗi duyệt đăng ký:', err);
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

  // Logic lọc hoạt động
  const filteredActivities = useMemo(() => {
    return MOCK_HOAT_DONG.filter(hd => {
      const matchesSearch = hd.tenHD.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           hd.donViToChuc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = hdFilter === 'all' || hd.trangThaiHD === hdFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, hdFilter]);

  // Logic lọc đăng ký
  const filteredRegistrations = useMemo(() => {
    return registrations.filter(reg => {
      const matchesSearch =
        (reg.hoTen || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (reg.maSV || '').includes(searchTerm) ||
        (reg.tenHD || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [registrations, searchTerm]);

  const pendingCount = registrations.filter(r => r.trangThai === 'Chờ duyệt').length;

  return (
    <div className="hd-container">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="hd-header">
        <h1 className="hd-title">Quản lý Hoạt động Đoàn</h1>
        <div className="hd-actions">
          <button className="hd-update-btn" style={{ borderColor: '#004f9f', color: '#004f9f' }}>
            <BarChart size={18} />
            Báo cáo tổng kết
          </button>
          <button className="hd-update-btn" style={{ backgroundColor: '#004f9f', borderColor: '#004f9f', color: '#fff' }}>
            <Plus size={18} />
            Tạo hoạt động mới
          </button>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────── */}
      <div className="hd-stats">
        <div className="hd-stat-item">
          <span className="hd-stat-item__label">Tổng hoạt động</span>
          <span className="hd-stat-item__value">{ACTIVITY_STATS.tongHoatDong}</span>
        </div>
        <div className="hd-stat-item" style={{ borderLeft: '3px solid #15803d' }}>
          <span className="hd-stat-item__label">Đang mở đăng ký</span>
          <span className="hd-stat-item__value">{ACTIVITY_STATS.dangMo}</span>
        </div>
        <div className="hd-stat-item" style={{ borderLeft: '3px solid #0369a1' }}>
          <span className="hd-stat-item__label">Sắp diễn ra</span>
          <span className="hd-stat-item__value">{ACTIVITY_STATS.sapDienRa}</span>
        </div>
        <div className="hd-stat-item" style={{ borderLeft: '3px solid #b45309' }}>
          <span className="hd-stat-item__label">Đăng ký chờ duyệt</span>
          <span className="hd-stat-item__value">{ACTIVITY_STATS.choDuyetDK}</span>
        </div>
      </div>

      {/* ── Tabs Navigation ─────────────────────────────── */}
      <div style={{ display: 'flex', borderBottom: '1px solid #eef2f6', marginBottom: '1rem' }}>
        <button 
          onClick={() => setActiveTab('activities')}
          style={{ 
            padding: '1rem 1.5rem', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'activities' ? '3px solid #004f9f' : '3px solid transparent',
            fontWeight: 700,
            color: activeTab === 'activities' ? '#004f9f' : '#64748b',
            cursor: 'pointer'
          }}
        >
          Danh sách Hoạt động
        </button>
        <button 
          onClick={() => setActiveTab('registrations')}
          style={{ 
            padding: '1rem 1.5rem', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'registrations' ? '3px solid #004f9f' : '3px solid transparent',
            fontWeight: 700,
            color: activeTab === 'registrations' ? '#004f9f' : '#64748b',
            cursor: 'pointer'
          }}
        >
          Duyệt đăng ký ({pendingCount})
        </button>
      </div>

      {/* ── Toolbar ────────────────────────────────────── */}
      <div className="hd-toolbar">
        <div className="hd-search-wrap">
          <Search size={18} />
          <input 
            type="text" 
            className="hd-search-input" 
            placeholder={activeTab === 'activities' ? "Tìm theo tên hoạt động, đơn vị tổ chức..." : "Tìm theo tên đoàn viên, MSSV, hoạt động..."} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {activeTab === 'activities' && (
          <select 
            className="hd-filter-select"
            value={hdFilter}
            onChange={(e) => setHdFilter(e.target.value)}
          >
            <option value="all">Tất cả trang thái</option>
            <option value="Đang mở đăng ký">Đang mở đăng ký</option>
            <option value="Đang diễn ra">Đang diễn ra</option>
            <option value="Đã kết thúc">Đã kết thúc</option>
          </select>
        )}
        <button className="hd-update-btn">
          <Filter size={18} />
          Bộ lọc nâng cao
        </button>
      </div>

      {/* ── Table Area ────────────────────────────────────── */}
      <div className="hd-card">
        {activeTab === 'activities' ? (
          <table className="hd-table">
            <thead>
              <tr>
                <th>Thông tin hoạt động</th>
                <th>Thời gian & Địa điểm</th>
                <th>Số lượng</th>
                <th>Điểm HD</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map(hd => (
                <tr key={hd.idHD}>
                  <td className="hd-name-cell">
                    <span className="hd-activity-title">{hd.tenHD}</span>
                    <span className="hd-activity-info">
                      <Users size={12} /> {hd.donViToChuc}
                    </span>
                  </td>
                  <td>
                    <div className="hd-activity-info">
                      <Calendar size={14} /> {new Date(hd.ngayToChuc).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="hd-activity-info">
                      <MapPin size={14} /> {hd.diaDiem}
                    </div>
                  </td>
                  <td>
                    <div className="hd-activity-info" style={{ justifyContent: 'space-between' }}>
                      <span>{hd.soLuongDaDK}/{hd.soLuongMax}</span>
                    </div>
                    <div className="hd-progress-wrap">
                      <div 
                        className="hd-progress-bar" 
                        style={{ width: `${(hd.soLuongDaDK / hd.soLuongMax) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#004f9f' }}>
                    {hd.diemHD}
                  </td>
                  <td>
                    <span className={`hd-badge ${
                      hd.trangThaiHD === 'Đang mở đăng ký' ? 'hd-badge--open' :
                      hd.trangThaiHD === 'Đang diễn ra' ? 'hd-badge--ongoing' :
                      hd.trangThaiHD === 'Đã kết thúc' ? 'hd-badge--ended' : 'hd-badge--closed'
                    }`}>
                      {hd.trangThaiHD}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="hd-update-btn" title="Chỉnh sửa"><Edit size={16} /></button>
                      <button className="hd-update-btn" title="Xóa"><Trash2 size={16} /></button>
                      <button className="hd-update-btn" title="Khác"><MoreHorizontal size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="hd-table">
            <thead>
              <tr>
                <th>MSSV</th>
                <th>Họ và Tên</th>
                <th>Chi đoàn</th>
                <th>Hoạt động đăng ký</th>
                <th>Ngày đăng ký</th>
                <th>Trạng thái</th>
                <th>Duyệt</th>
              </tr>
            </thead>
            <tbody>
              {loadingRegs ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Đang tải...</td></tr>
              ) : filteredRegistrations.map((reg, idx) => {
                const key = `${reg.maSV}-${reg.idHD}`;
                const isProcessing = processingId === key;
                const isDone = reg.trangThai !== 'Chờ duyệt';
                return (
                  <tr key={`${key}-${idx}`}>
                    <td style={{ fontWeight: 600, color: '#004f9f' }}>{reg.maSV}</td>
                    <td>{reg.hoTen}</td>
                    <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{reg.tenChiDoan || '—'}</td>
                    <td style={{ fontWeight: 600 }}>{reg.tenHD}</td>
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
                      {isDone ? (
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Đã xử lý</span>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="hd-update-btn"
                            style={{ color: '#15803d' }}
                            title="Duyệt"
                            disabled={isProcessing}
                            onClick={() => handleDuyet(reg.maSV, reg.idHD, 'Đã duyệt')}
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            className="hd-update-btn"
                            style={{ color: '#b91c1c' }}
                            title="Từ chối"
                            disabled={isProcessing}
                            onClick={() => setRejectTarget({ maSV: reg.maSV, idHD: reg.idHD, hoTen: reg.hoTen })}
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {(activeTab === 'activities' ? filteredActivities : filteredRegistrations).length === 0 && !loadingRegs && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            Không tìm thấy dữ liệu phù hợp
          </div>
        )}
      </div>

      {/* Modal nhập lý do từ chối */}
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

export default HoatDong;