import { useState, useMemo, useEffect, useCallback } from 'react';
import { Calendar, MapPin, Users, Plus, Edit, Trash2, BarChart } from 'lucide-react';
import DataTableToolbar from '@/components/commons/DataTableToolbar/DataTableToolbar';
import RegistrationListModal from '@/components/commons/modals/DanhSachDoanVienDangKiModal';
import './HoatDong.css';

const API = 'http://localhost:5000/api/hoatdong';

const HoatDongQuanLy = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hdFilter, setHdFilter]     = useState('all');

  const [activities, setActivities]     = useState([]);
  const [loadingList, setLoadingList]   = useState(false);

  const [showRegModal, setShowRegModal] = useState(false);
  const [selectedHD, setSelectedHD]     = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs]   = useState(false);

  // Fetch danh sách hoạt động từ DB
  const fetchActivities = useCallback(async () => {
    setLoadingList(true);
    try {
      const res  = await fetch(API);
      const json = await res.json();
      if (json.success) setActivities(json.data);
    } catch (err) {
      console.error('Lỗi fetch hoạt động:', err);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  // Fetch danh sách đăng ký khi chọn hoạt động
  useEffect(() => {
    if (!selectedHD) return;
    const fetch_ = async () => {
      setLoadingRegs(true);
      try {
        const res  = await fetch(`${API}/${selectedHD.idHD}/dangky`);
        const json = await res.json();
        if (json.success) setRegistrations(json.data);
        else setRegistrations([]);
      } catch {
        setRegistrations([]);
      } finally {
        setLoadingRegs(false);
      }
    };
    fetch_();
  }, [selectedHD]);

  // Stats tính từ dữ liệu thực
  const stats = useMemo(() => ({
    tong:      activities.length,
    dangMo:    activities.filter(h => h.trangThaiHD === 'Đang mở').length,
    sapDienRa: activities.filter(h => h.trangThaiHD === 'Chưa duyệt').length,
    daKetThuc: activities.filter(h => h.trangThaiHD === 'Đã kết thúc').length,
  }), [activities]);

  const filterOptions = [
    { value: 'all',           label: 'Tất cả trạng thái' },
    { value: 'Đang mở',       label: 'Đang mở đăng ký' },
    { value: 'Đã đóng',       label: 'Đã đóng' },
    { value: 'Đã kết thúc',   label: 'Đã kết thúc' },
    { value: 'Chưa duyệt',    label: 'Chưa duyệt' },
    { value: 'Đã duyệt',      label: 'Đã duyệt' },
  ];

  const filteredActivities = useMemo(() => {
    return activities.filter(hd => {
      const matchSearch = hd.tenHD.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (hd.donViToChuc || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchFilter = hdFilter === 'all' || hd.trangThaiHD === hdFilter;
      return matchSearch && matchFilter;
    });
  }, [activities, searchTerm, hdFilter]);

  const getBadgeClass = (trangThai) => {
    switch (trangThai) {
      case 'Đang mở':     return 'hd-badge--open';
      case 'Đang diễn ra': return 'hd-badge--ongoing';
      case 'Đã kết thúc': return 'hd-badge--ended';
      default:            return 'hd-badge--closed';
    }
  };

  return (
    <div className="hd-container">
      <div className="hd-header">
        <h1 className="hd-title">Quản lý Hoạt động</h1>
        <div className="hd-actions">
          <button className="hd-update-btn" style={{ borderColor: '#004f9f', color: '#004f9f' }}>
            <BarChart size={18} /> Thống kê chung
          </button>
          <button className="hd-update-btn" style={{ backgroundColor: '#004f9f', borderColor: '#004f9f', color: '#fff' }}>
            <Plus size={18} /> Tạo hoạt động mới
          </button>
        </div>
      </div>

      {/* Stats từ DB */}
      <div className="hd-stats">
        <div className="hd-stat-item">
          <span className="hd-stat-item__label">Tổng hoạt động</span>
          <span className="hd-stat-item__value">{stats.tong}</span>
        </div>
        <div className="hd-stat-item" style={{ borderLeft: '3px solid #15803d' }}>
          <span className="hd-stat-item__label">Đang mở đăng ký</span>
          <span className="hd-stat-item__value">{stats.dangMo}</span>
        </div>
        <div className="hd-stat-item" style={{ borderLeft: '3px solid #0369a1' }}>
          <span className="hd-stat-item__label">Chưa duyệt</span>
          <span className="hd-stat-item__value">{stats.sapDienRa}</span>
        </div>
        <div className="hd-stat-item" style={{ borderLeft: '3px solid #b45309' }}>
          <span className="hd-stat-item__label">Đã kết thúc</span>
          <span className="hd-stat-item__value">{stats.daKetThuc}</span>
        </div>
      </div>

      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm theo tên hoạt động, đơn vị tổ chức..."
        filterValue={hdFilter}
        onFilterChange={setHdFilter}
        filterOptions={filterOptions}
      />

      <div className="hd-card">
        <table className="hd-table">
          <thead>
            <tr>
              <th>Thông tin hoạt động</th>
              <th>Thời gian & Địa điểm</th>
              <th>Số lượng đăng ký</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loadingList ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Đang tải...</td></tr>
            ) : filteredActivities.map(hd => (
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
                </td>
                <td>
                  <div className="hd-activity-info"
                    style={{ cursor: 'pointer', color: '#004f9f', fontWeight: 700 }}
                    onClick={() => { setSelectedHD(hd); setShowRegModal(true); }}>
                    {hd.soLuongDaDK}/{hd.soLuongMax} (Xem)
                  </div>
                  <div className="hd-progress-wrap">
                    <div className="hd-progress-bar"
                      style={{ width: `${Math.min((hd.soLuongDaDK / hd.soLuongMax) * 100, 100)}%` }} />
                  </div>
                </td>
                <td>
                  <span className={`hd-badge ${getBadgeClass(hd.trangThaiHD)}`}>
                    {hd.trangThaiHD}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="hd-update-btn" title="Danh sách đăng ký"
                      onClick={() => { setSelectedHD(hd); setShowRegModal(true); }}>
                      <Users size={16} />
                    </button>
                    <button className="hd-update-btn" title="Chỉnh sửa"><Edit size={16} /></button>
                    <button className="hd-update-btn" title="Xóa"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!loadingList && filteredActivities.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Không tìm thấy hoạt động phù hợp</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <RegistrationListModal
        show={showRegModal}
        onClose={() => { setShowRegModal(false); setSelectedHD(null); }}
        activity={selectedHD}
        registrations={registrations}
        loading={loadingRegs}
        title="Danh sách Đăng ký"
      />
    </div>
  );
};

export default HoatDongQuanLy;
