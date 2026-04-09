import { useState, useMemo } from 'react';
import { Calendar, MapPin, Users, CheckCircle, XCircle } from 'lucide-react';
import { MOCK_AVAILABLE_HOAT_DONG } from '@/data/mockDoanVien';
import DataTableToolbar from '@/components/commons/DataTableToolbar/DataTableToolbar';
import './DangKy.css';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

const filterOptions = [
  { value: 'all',        label: 'Tất cả' },
  { value: 'available',  label: 'Chưa đăng ký' },
  { value: 'registered', label: 'Đã đăng ký' },
];

const DangKy = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter]         = useState('all');
  const [registeredIds, setRegisteredIds] = useState(
    MOCK_AVAILABLE_HOAT_DONG.filter(h => h.daDangKy).map(h => h.idHD)
  );

  const handleRegister = (idHD) => {
    setRegisteredIds(prev => [...prev, idHD]);
    alert('Đăng ký thành công! Vui lòng chờ duyệt.');
  };

  const handleCancel = (idHD) => {
    if (window.confirm('Bạn có chắc muốn hủy đăng ký?')) {
      setRegisteredIds(prev => prev.filter(id => id !== idHD));
    }
  };

  const filtered = useMemo(() => {
    return MOCK_AVAILABLE_HOAT_DONG.filter(hd => {
      const matchSearch = hd.tenHD.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hd.donViToChuc.toLowerCase().includes(searchTerm.toLowerCase());
      const isDangKy = registeredIds.includes(hd.idHD);
      const matchFilter =
        filter === 'all' ||
        (filter === 'registered' && isDangKy) ||
        (filter === 'available'  && !isDangKy);
      return matchSearch && matchFilter;
    });
  }, [searchTerm, filter, registeredIds]);

  return (
    <div className="dk-container">
      <h1 className="dk-title">Đăng ký hoạt động</h1>

      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm kiếm hoạt động, đơn vị tổ chức..."
        filterValue={filter}
        onFilterChange={setFilter}
        filterOptions={filterOptions}
      />

      <div className="dk-grid">
        {filtered.map(hd => {
          const isDangKy = registeredIds.includes(hd.idHD);
          const pct = Math.round((hd.soLuongDaDK / hd.soLuongMax) * 100);

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
                {isDangKy ? (
                  <button className="dk-btn dk-btn--danger" onClick={() => handleCancel(hd.idHD)}>
                    <XCircle size={14} /> Hủy đăng ký
                  </button>
                ) : (
                  <button className="dk-btn dk-btn--primary" onClick={() => handleRegister(hd.idHD)}>
                    <CheckCircle size={14} /> Đăng ký
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="dk-empty">Không có hoạt động phù hợp</div>
        )}
      </div>
    </div>
  );
};

export default DangKy;
