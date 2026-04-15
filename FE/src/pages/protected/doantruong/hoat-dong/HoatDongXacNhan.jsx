import { useState, useEffect, useCallback } from 'react';
import { MapPin, Calendar, FileCheck, CheckCheck, Users, Search } from 'lucide-react';
import hoatdongAPI from '@/apis/hoatdong.api';
import RegistrationListModal from '@/components/commons/modals/DanhSachDoanVienDangKiModal';
import './HoatDong.css';

const API_BASE = 'http://localhost:8000/api';

const HoatDongXacNhan = () => {
  const [searchTerm, setSearchTerm]         = useState('');
  const [activities, setActivities]         = useState([]);
  const [loading, setLoading]               = useState(false);
  const [confirming, setConfirming]         = useState(null); // idHD đang xử lý

  const [selectedHD, setSelectedHD]         = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [approvedMembers, setApprovedMembers] = useState([]);
  const [loadingMembers, setLoadingMembers]   = useState(false);

  // Fetch hoạt động cấp Đoàn Trường đang diễn ra hoặc đã đóng đăng ký
  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const result = await hoatdongAPI.getAllSchoolActivities({ page: 1, limit: 100 });
      if (result.success) {
        // Chỉ lấy hoạt động chưa kết thúc (cần xác nhận)
        setActivities(result.data.filter(hd =>
          hd.trangThaiHD !== 'Đã kết thúc' && hd.trangThaiHD !== 'Chưa duyệt'
        ));
      }
    } catch (err) {
      console.error('Lỗi fetch hoạt động:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  // Fetch danh sách đoàn viên đã duyệt khi chọn hoạt động
  useEffect(() => {
    if (!selectedHD) return;
    const fetch_ = async () => {
      setLoadingMembers(true);
      try {
        const result = await hoatdongAPI.getActivityRegistrations(selectedHD.idHD);
        if (result.success) {
          setApprovedMembers(result.data.filter(r => r.trangThaiDuyet?.trim() === 'Đã duyệt'));
        }
      } catch { setApprovedMembers([]); }
      finally { setLoadingMembers(false); }
    };
    fetch_();
  }, [selectedHD]);

  // Xác nhận hoàn thành & cộng điểm
  const handleXacNhan = async (hd) => {
    if (!window.confirm(`Xác nhận hoàn thành "${hd.tenHD}" và cộng +${hd.diemHD} điểm cho đoàn viên đã duyệt?`)) return;
    setConfirming(hd.idHD);
    try {
      const result = await hoatdongAPI.xacNhanHoanThanh(hd.idHD);
      if (result.success) {
        alert(result.message);
        fetchActivities(); // Reload danh sách
      } else {
        alert(result.message || 'Có lỗi xảy ra');
      }
    } catch {
      alert('Không thể kết nối server');
    } finally {
      setConfirming(null);
    }
  };

  const filtered = activities.filter(hd =>
    hd.tenHD.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tongDiemDaCap = activities
    .filter(hd => hd.trangThaiHD === 'Đã kết thúc')
    .reduce((sum, hd) => sum + (hd.diemHD || 0), 0);

  return (
    <div className="hd-container">
      <div className="hd-header">
        <h1 className="hd-title">Xác nhận Hoàn thành Hoạt động</h1>
        <div className="hd-actions">
          <button className="hd-update-btn" style={{ borderColor: '#004f9f', color: '#004f9f' }}>
            <FileCheck size={18} /> Báo cáo tổng kết
          </button>
        </div>
      </div>

      <div className="hd-stats">
        <div className="hd-stat-item">
          <span className="hd-stat-item__label">HĐ chờ xác nhận</span>
          <span className="hd-stat-item__value">{filtered.length}</span>
        </div>
        <div className="hd-stat-item" style={{ borderLeft: '3px solid #15803d' }}>
          <span className="hd-stat-item__label">Tổng điểm đã cấp</span>
          <span className="hd-stat-item__value">{tongDiemDaCap} điểm</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="hd-toolbar" style={{ marginBottom: '1rem' }}>
        <div className="hd-search-wrap" style={{ flex: 1 }}>
          <Search size={18} />
          <input
            type="text"
            className="hd-search-input"
            placeholder="Tìm tên hoạt động để nhập điểm/xác nhận..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="hd-card">
        <table className="hd-table">
          <thead>
            <tr>
              <th>Tên hoạt động</th>
              <th>Thời gian & Địa điểm</th>
              <th>Số lượng đăng ký</th>
              <th>Số lượng tham gia</th>
              <th>Điểm</th>
              <th>Xác nhận & Ghi điểm</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Đang tải...</td></tr>
            ) : filtered.map(hd => (
              <tr key={hd.idHD}>
                <td style={{ fontWeight: 700, color: '#0d1f3c' }}>{hd.tenHD}</td>
                <td>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    <Calendar size={12} /> {new Date(hd.ngayToChuc).toLocaleDateString('vi-VN')}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    <MapPin size={12} /> {hd.diaDiem}
                  </div>
                </td>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>{hd.soLuongDaDK || 0} SV</td>
                <td style={{ textAlign: 'center', fontWeight: 700, color: '#15803d' }}>
                  — SV
                </td>
                <td style={{ color: '#004f9f', fontWeight: 800 }}>+{hd.diemHD || 0}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="hd-update-btn"
                      title="Xem danh sách tham gia"
                      onClick={() => { setSelectedHD(hd); setShowMemberModal(true); }}
                    >
                      <Users size={18} /> Danh sách
                    </button>
                    <button
                      className="hd-update-btn"
                      style={{ backgroundColor: '#004f9f', color: '#fff', borderColor: '#004f9f' }}
                      disabled={confirming === hd.idHD}
                      onClick={() => handleXacNhan(hd)}
                    >
                      <CheckCheck size={18} />
                      {confirming === hd.idHD ? 'Đang xử lý...' : 'Xác nhận toàn bộ'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Không có hoạt động nào chờ xác nhận</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <RegistrationListModal
        show={showMemberModal}
        onClose={() => { setShowMemberModal(false); setSelectedHD(null); }}
        activity={selectedHD}
        registrations={approvedMembers}
        loading={loadingMembers}
        title="Danh sách Tham gia thực tế"
      />
    </div>
  );
};

export default HoatDongXacNhan;
