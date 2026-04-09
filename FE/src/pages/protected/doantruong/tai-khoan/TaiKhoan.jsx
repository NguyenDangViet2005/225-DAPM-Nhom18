import { useState, useMemo } from 'react';
import { 
  UserPlus, 
  ShieldCheck, 
  UserX, 
  Key, 
  Edit, 
  Circle,
  Mail,
  Building,
  AtSign,
  Smartphone,
  Info,
  Users
} from 'lucide-react';
import { MOCK_TAI_KHOAN, ACCOUNT_STATS } from '@/data/mockTaiKhoan';
import DataTableToolbar from '@/components/commons/DataTableToolbar/DataTableToolbar';
import './TaiKhoan.css';

const TaiKhoan = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredAccounts = useMemo(() => {
    return MOCK_TAI_KHOAN.filter(tk => {
      const matchesSearch = tk.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           tk.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || tk.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [searchTerm, roleFilter]);

  const roleFilterOptions = [
    { value: 'all', label: 'Tất cả các quyền' },
    { value: 'DOANKHOA', label: 'Bí thư Khoa' },
    { value: 'BITHU', label: 'Bí thư Lớp' },
    { value: 'DOANTRUONG', label: 'Ban chấp hành Trường' }
  ];

  return (
    <div className="tk-container">
      <div className="tk-header">
        <h1 className="tk-title">Quản lý Tài khoản & Phân quyền</h1>
        <div className="tk-actions">
           <button className="tk-btn-primary" onClick={() => alert('Thêm tài khoản mới')}>
            <UserPlus size={18} />
            Thêm tài khoản mới
          </button>
        </div>
      </div>

      <div className="tk-stats">
        <div className="tk-stat-item">
          <span className="tk-stat-item__label">Tổng người dùng</span>
          <span className="tk-stat-item__value">{ACCOUNT_STATS.tongTaiKhoan}</span>
          <Users size={32} className="tk-stat-item__bg-icon" />
        </div>
        <div className="tk-stat-item" style={{ borderLeft: '3px solid #15803d' }}>
          <span className="tk-stat-item__label">Đang hoạt động</span>
          <span className="tk-stat-item__value">{ACCOUNT_STATS.dangHoatDong}</span>
          <ShieldCheck size={32} className="tk-stat-item__bg-icon" style={{ color: '#15803d' }} />
        </div>
        <div className="tk-stat-item" style={{ borderLeft: '3px solid #b91c1c' }}>
          <span className="tk-stat-item__label">Đã khóa / Tạm dừng</span>
          <span className="tk-stat-item__value">{ACCOUNT_STATS.daKhoa}</span>
          <UserX size={32} className="tk-stat-item__bg-icon" style={{ color: '#b91c1c' }} />
        </div>
      </div>

      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm theo Họ tên hoặc Tên đăng nhập (Email)..."
        filterValue={roleFilter}
        onFilterChange={setRoleFilter}
        filterOptions={roleFilterOptions}
      />

      <div className="tk-card">
        <table className="tk-table">
          <thead>
            <tr>
              <th>Thông tin cơ bản</th>
              <th>Đơn vị / Phân quyền</th>
              <th>Ngày tạo</th>
              <th>Đăng nhập cuối</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map(tk => (
              <tr key={tk.idTK}>
                <td>
                  <div className="tk-user-info">
                    <div className="tk-avatar">
                      {tk.hoTen.charAt(0).toUpperCase()}
                    </div>
                    <div>
                    <span className="tk-user-name">{tk.hoTen}</span>
                    <span className="tk-user-id">@{tk.username}</span>
                    <span className="tk-user-email">
                      <AtSign size={10} /> {tk.email}
                    </span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="tk-activity-info" style={{ fontWeight: 600, color: '#004f9f' }}>
                    <Building size={14} /> {tk.donVi}
                  </div>
                  <div className="tk-activity-info">
                    <ShieldCheck size={14} /> {tk.role}
                  </div>
                </td>
                <td>
                   <div className="tk-activity-info">
                    {new Date(tk.ngayTao).toLocaleDateString('vi-VN')}
                  </div>
                </td>
                <td>
                  <div className="tk-activity-info">
                    {tk.lastLogin ? new Date(tk.lastLogin).toLocaleString('vi-VN', { 
                      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
                    }) : 'Chưa đăng nhập'}
                  </div>
                </td>
                <td>
                  <span className={`tk-badge ${
                    tk.trangThai === 'Đang hoạt động' ? 'tk-badge--active' : 'tk-badge--locked'
                  }`}>
                    <Circle size={8} fill="currentColor" /> {tk.trangThai}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="tk-btn-icon" title="Cập nhật thông tin" onClick={() => alert(`Chỉnh sửa ${tk.hoTen}`)}>
                      <Edit size={16} />
                    </button>
                    <button className="tk-btn-icon" title="Cấp lại mật khẩu" onClick={() => alert('Đặt lại mật khẩu cho tài khoản này?')}>
                      <Key size={16} />
                    </button>
                    <button className={`tk-btn-icon ${tk.trangThai === 'Đã khóa' ? 'tk-btn-active' : 'tk-btn-lock'}`} 
                            title={tk.trangThai === 'Đã khóa' ? 'Mở khóa' : 'Khóa tài khoản'}>
                      {tk.trangThai === 'Đã khóa' ? <ShieldCheck size={16} /> : <UserX size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaiKhoan;
