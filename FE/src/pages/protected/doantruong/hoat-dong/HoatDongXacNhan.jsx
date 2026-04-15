import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar,
  FileCheck,
  CheckCheck,
  Users,
} from 'lucide-react';
import { MOCK_HOAT_DONG, MOCK_DANG_KY_HOAT_DONG } from '@/data/mockHoatDong';
import DataTableToolbar from '@/components/commons/DataTableToolbar/DataTableToolbar';
import RegistrationListModal from '@/components/commons/modals/DanhSachDoanVienDangKiModal';
import './HoatDong.css';

const HoatDongXacNhan = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHD, setSelectedHD] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [approvedMembers, setApprovedMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Lọc hoạt động đã kết thúc hoặc đang diễn ra để xác nhận
  const activitiesToConfirm = MOCK_HOAT_DONG.filter(hd => 
    (hd.trangThaiHD === 'Đang diễn ra' || hd.trangThaiHD === 'Đã kết thúc') &&
    hd.tenHD.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch danh sách đoàn viên đã duyệt từ API khi chọn hoạt động
  useEffect(() => {
    if (!selectedHD) return;
    const fetchMembers = async () => {
      setLoadingMembers(true);
      try {
        const res = await fetch(`http://localhost:5000/api/hoatdong/${selectedHD.idHD}/dangky`);
        const json = await res.json();
        if (json.success) {
          // Chỉ lấy đoàn viên đã duyệt
          setApprovedMembers(json.data.filter(r => r.trangThai === 'Đã duyệt'));
        }
      } catch (err) {
        console.error('Lỗi fetch danh sách tham gia:', err);
        setApprovedMembers([]);
      } finally {
        setLoadingMembers(false);
      }
    };
    fetchMembers();
  }, [selectedHD]);

  return (
    <div className="hd-container">
      <div className="hd-header">
        <h1 className="hd-title">Xác nhận Hoàn thành Hoạt động</h1>
        <div className="hd-actions">
          <button className="hd-update-btn" style={{ borderColor: '#004f9f', color: '#004f9f' }}>
            <FileCheck size={18} />
            Báo cáo tổng kết
          </button>
        </div>
      </div>

      <div className="hd-stats">
        <div className="hd-stat-item">
          <span className="hd-stat-item__label">HĐ chờ xác nhận</span>
          <span className="hd-stat-item__value">{activitiesToConfirm.length}</span>
        </div>
        <div className="hd-stat-item" style={{ borderLeft: '3px solid #15803d' }}>
          <span className="hd-stat-item__label">Tổng điểm đã cấp</span>
          <span className="hd-stat-item__value">450 điểm</span>
        </div>
      </div>

      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm tên hoạt động để nhập điểm/xác nhận..."
      />

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
            {activitiesToConfirm.map(hd => (
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
                <td style={{ textAlign: 'center', fontWeight: 600 }}>{hd.soLuongDaDK} SV</td>
                <td style={{ textAlign: 'center', fontWeight: 700, color: '#15803d' }}>
                  {MOCK_DANG_KY_HOAT_DONG.filter(r => r.idHD === hd.idHD && r.trangThaiDuyet === 'Đã duyệt').length} SV
                </td>
                <td style={{ color: '#004f9f', fontWeight: 800 }}>+{hd.diemHD}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="hd-update-btn" title="Xem danh sách sinh viên đã duyệt tham gia" 
                            onClick={() => { setSelectedHD(hd); setShowMemberModal(true); }}>
                      <Users size={18} /> Danh sách
                    </button>
                    <button className="hd-update-btn" style={{ backgroundColor: '#004f9f', color: '#fff', borderColor: '#004f9f' }}
                            onClick={() => alert(`Đã xác nhận hoàn thành & cấp ${hd.diemHD} điểm.`)}>
                      <CheckCheck size={18} /> Xác nhận toàn bộ
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
