import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '@/components/layouts/sidebar/Sidebar';
import { ROLE_PERMISSIONS } from '@/constants/permissions';
import { useAuth } from '@/hooks/useAuth';
import { ROLES } from '@/constants';
import { Menu, X } from 'lucide-react';
import './DashboardLayout.css';

const ROLE_TITLES = {
  [ROLES.DOANTRUONG]: 'UTE – Đoàn Trường',
  [ROLES.DOANKHOA]:   'UTE – Đoàn Khoa',
  [ROLES.BITHU]:      'UTE – Bí thư Chi đoàn',
  [ROLES.DOANVIEN]:   'UTE – Đoàn Viên',
};

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userPerms = ROLE_PERMISSIONS[user?.role] ?? [];

  // Set browser tab title theo role
  useEffect(() => {
    document.title = ROLE_TITLES[user?.role] ?? 'UTE – Hệ thống quản lý đoàn viên';
  }, [user?.role]);

  // Đóng menu mobile mỗi khi chuyển trang
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dl-wrapper">
      {/* Mobile Top Header */}
      <div className="dl-mobile-header">
        <button 
          className="dl-menu-btn" 
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
        <div className="dl-mobile-brand">
          <img src="/images/ute.png" alt="Logo" className="dl-mobile-logo" />
          <span className="dl-mobile-title">UTE Đoàn</span>
        </div>
        <div style={{ width: 40 }} /> {/* Spacer */}
      </div>

      {/* Overlay cho Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          className="dl-overlay" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      <Sidebar
        role={user?.role}
        permissions={userPerms}
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileMenuOpen}
        onToggle={() => setIsCollapsed((c) => !c)}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
        user={user}
      />
      <div className="dl-content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
