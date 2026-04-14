import { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  BarChart,
} from 'lucide-react';
import { MOCK_HOAT_DONG, ACTIVITY_STATS } from '@/data/mockHoatDong';
import DataTableToolbar from '@/components/commons/DataTableToolbar/DataTableToolbar';
import RegistrationListModal from '@/components/commons/modals/DanhSachDoanVienDangKiModal';
import './HoatDong.css';

const HoatDongQuanLy = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hdFilter, setHdFilter] = useState('all');
  
  const [showRegModal, setShowRegModal] = useState(false);
  const [selectedHD, setSelectedHD] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);

  const filteredActivities = useMemo(() => {
    return MOCK_HOAT_DONG.filter(hd => {
      const matchesSearch = hd.tenHD.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           hd.donViToChuc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = hdFilter === 'all' || hd.trangThaiHD === hdFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, hdFilter]);

  const filterOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'Đang mở đăng ký', label: 'Đang mở đăng ký' },
    { value: 'Đang diễn ra', label: 'Đang diễn ra' },
    { value: 'Đã kết thúc', label: 'Đã kết thúc' }
  ];

  // Fetch danh sách đăng ký từ API khi chọn hoạt động
  useEffect(() => {
    if (!selectedHD) return;
    const fetchDangKy = async () => {
      setLoadingRegs(true);
      try {
        const res = await fetch(`http://localhost:5000/api/hoatdong/${selectedHD.idHD}/dangky`);
        const json = await res.json();
        if (json.success) setRegistrations(json.data);
      } catch (err) {
        console.error('Lỗi fetch danh sách đăng ký:', err);
        setRegistrations([]);
      } finally {
        setLoadingRegs(false);
      }
    };
    fetchDangKy();
  }, [selectedHD]);

  return (
    <div className="hd-container">
      <div className="hd-header">
        <h1 className="hd-title">Quản lý Hoạt động</h1>
        <div className="hd-actions">
          <button className="hd-update-btn" style={{ borderColor: '#004f9f', color: '#004f9f' }}>
            <BarChart size={18} />
            Thống kê chung
          </button>
          <button className="hd-update-btn" style={{ backgroundColor: '#004f9f', borderColor: '#004f9f', color: '#fff' }}>
            <Plus size={18} />
            Tạo hoạt động mới
          </button>
        </div>
      </div>

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
          <span className="hd-stat-item__label">Hoàn thành tháng này</span>
          <span className="hd-stat-item__value">5</span>
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
                  <div className="hd-activity-info" style={{ justifyContent: 'space-between', cursor: 'pointer', color: '#004f9f', fontWeight: 700 }} 
                       onClick={() => { setSelectedHD(hd); setShowRegModal(true); }}>
                    <span>{hd.soLuongDaDK}/{hd.soLuongMax} (Xem)</span>
                  </div>
                  <div className="hd-progress-wrap">
                    <div 
                      className="hd-progress-bar" 
                      style={{ width: `${(hd.soLuongDaDK / hd.soLuongMax) * 100}%` }}
                    />
                  </div>
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
                    <button className="hd-update-btn" title="Danh sách đăng ký" onClick={() => { setSelectedHD(hd); setShowRegModal(true); }}>
                      <Users size={16} />
                    </button>
                    <button className="hd-update-btn" title="Chỉnh sửa"><Edit size={16} /></button>
                    <button className="hd-update-btn" title="Xóa"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
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
