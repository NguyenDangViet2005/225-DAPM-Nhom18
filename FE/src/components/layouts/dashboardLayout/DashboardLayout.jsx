import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layouts/sidebar/Sidebar';
import { ROLE_PERMISSIONS } from '@/constants/permissions';
import { useAuth } from '@/hooks/useAuth';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const userPerms = ROLE_PERMISSIONS[user?.role] ?? [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dl-wrapper">
      <Sidebar
        role={user?.role}
        permissions={userPerms}
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((c) => !c)}
        onLogout={handleLogout}
        user={{ name: user?.name }}
      />
      <div className="dl-content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
