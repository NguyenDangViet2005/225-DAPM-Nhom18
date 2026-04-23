import { useState, useEffect, useMemo } from 'react';
import { Calendar, MapPin, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { doanviendangkiAPI } from '@/apis/doanviendangki.api';
import DataTableToolbar from '@/components/commons/DataTableToolbar/DataTableToolbar';
import './DangKy.css';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

const filterOptions = [
  { value: 'all',        label: 'Tất cả' },
  { value: 'available',  label: 'Chưa đăng ký' },
  { value: 'registered', label: 'Đã đăng ký' },
];

const DangKy = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter]         = useState('all');

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await doanviendangkiAPI.getAvailableActivities();
      if (res.success) setActivities(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchActivities(); }, []);

  const handleRegister = async (idHD) => {
    try {
      const res = await doanviendangkiAPI.dangKyHoatDong(idHD);
      alert(res.message);
      if (res.success) fetchActivities();
    } catch {
      alert('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  const handleCancel = async (idHD) => {
    if (!window.confirm('Bạn có chắc muốn hủy đăng ký?')) return;
    try {
      const res = await doanviendangkiAPI.huyDangKy(idHD);
      alert(res.message);
      if (res.success) fetchActivities();
    } catch {
      alert('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  const filtered = useMemo(() => {
    return activities.filter(hd => {
      const matchSearch =
        hd.tenHD.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (hd.donViToChuc ?? '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchFilter =
        filter === 'all' ||
        (filter === 'registered' && hd.daDangKy) ||
        (filter === 'available'  && !hd.daDangKy);
      return matchSearch && matchFilter;
    });
  }, [activities, searchTerm, filter]);

  return (
    <div className="dk-container">
      <h1 style={{ color: '#004f9f' }} className="dk-title">ĐĂNG KÝ HOẠT ĐỘNG</h1>

      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm kiếm hoạt động, đơn vị tổ chức..."
        filterValue={filter}
        onFilterChange={setFilter}
        filterOptions={filterOptions}
      />
      <h2 className="dk-title">Các hoạt động đang mở</h2>
      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
          Đang tải...
        </div>
      )}

      <div className="dk-grid">
        {filtered.map(hd => {
          const pct = hd.soLuongMax
            ? Math.round((hd.soLuongDaDK / hd.soLuongMax) * 100)
            : 0;

          return (
            <div className="dk-card" key={hd.idHD}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span className="dk-card__title">{hd.tenHD}</span>
                <span className="dk-diem-badge">+{hd.diemHD} điểm</span>
              </div>

              <p className="dk-card__desc">{hd.moTa}</p>

              <div className="dk-card__meta"><Calendar size={13} /> {fmtDate(hd.ngayToChuc)}</div>
              <div className="dk-card__meta"><MapPin size={13} /> {hd.diaDiem}</div>
              <div className="dk-card__meta">
                <Users size={13} /> {hd.soLuongDaDK}/{hd.soLuongMax} người đăng ký
              </div>

              <div className="dk-progress-wrap">
                <div className="dk-progress-bar" style={{ width: `${pct}%` }} />
              </div>

              <div className="dk-card__footer">
                <span className="dk-badge dk-badge--blue">{hd.trangThaiHD}</span>

                {hd.daDangKy ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {hd.trangThaiDangKy === 'Chờ duyệt' && (
                      <span style={{ fontSize: '0.75rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} /> Chờ duyệt
                      </span>
                    )}
                    {hd.trangThaiDangKy === 'Đã duyệt' && (
                      <span style={{ fontSize: '0.75rem', color: '#15803d', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle size={13} /> Đã duyệt
                      </span>
                    )}
                    {hd.trangThaiDangKy !== 'Đã duyệt' && (
                      <button className="dk-btn dk-btn--danger" onClick={() => handleCancel(hd.idHD)}>
                        <XCircle size={14} /> Hủy
                      </button>
                    )}
                  </div>
                ) : (
                  <button className="dk-btn dk-btn--primary" onClick={() => handleRegister(hd.idHD)}>
                    <CheckCircle size={14} /> Đăng ký
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {!loading && filtered.length === 0 && (
          <div className="dk-empty">Không có hoạt động phù hợp</div>
        )}
      </div>
    </div>
  );
};

export default DangKy;
