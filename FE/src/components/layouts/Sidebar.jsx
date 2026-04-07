import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSidebarItems } from '../../configs/SidebarConfig';
import { ROLE_LABELS } from '../../constants/roles';
import './Sidebar.css';

const Sidebar = ({
  role,
  permissions = [],
  isCollapsed = false,
  onToggle,
  onLogout,
  user = {},
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState({});

  const items = getSidebarItems(role, permissions);

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (path) => location.pathname === path;
  const isGroupActive = (item) =>
    item.children?.some((c) => location.pathname.startsWith(c.path));

  return (
    <aside className={`sidebar${isCollapsed ? ' sidebar--collapsed' : ''}`}>

      {/* ── Branding ─────────────────────────────────────── */}
      <div className="sidebar__brand">
        <img src="/images/ute.png" alt="UTE Logo" className="sidebar__logo" />
        {!isCollapsed && (
          <span className="sidebar__brand-name">UTE Đoàn</span>
        )}
        <button
          className="sidebar__toggle-btn"
          onClick={onToggle}
          title={isCollapsed ? 'Mở rộng' : 'Thu nhỏ'}
        >
          {isCollapsed ? '›' : '‹'}
        </button>
      </div>

      {/* ── Role badge ───────────────────────────────────── */}
      {!isCollapsed && (
        <div className="sidebar__role-badge">
          {ROLE_LABELS[role] ?? role}
        </div>
      )}

      <div className="sidebar__divider" />

      {/* ── Navigation ───────────────────────────────────── */}
      <nav className="sidebar__nav">
        {items.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const groupActive = isGroupActive(item);
          const isOpen = openGroups[item.key] ?? groupActive;

          return (
            <div key={item.key} className="sidebar__item-group">
              {/* Parent Item */}
              <button
                className={`sidebar__item${
                  isActive(item.path) || (groupActive && !hasChildren)
                    ? ' sidebar__item--active'
                    : ''
                }${groupActive && hasChildren ? ' sidebar__item--group-active' : ''}`}
                onClick={() => {
                  if (hasChildren) {
                    toggleGroup(item.key);
                  } else {
                    navigate(item.path);
                  }
                }}
                title={isCollapsed ? item.label : undefined}
              >
                <SidebarIcon name={item.icon} />
                {!isCollapsed && (
                  <>
                    <span className="sidebar__item-label">{item.label}</span>
                    {hasChildren && (
                      <span className={`sidebar__chevron${isOpen ? ' sidebar__chevron--open' : ''}`}>
                        ›
                      </span>
                    )}
                  </>
                )}
              </button>

              {/* Children */}
              {hasChildren && isOpen && !isCollapsed && (
                <div className="sidebar__children">
                  {item.children.map((child) => (
                    <button
                      key={child.key}
                      className={`sidebar__child-item${
                        isActive(child.path) ? ' sidebar__child-item--active' : ''
                      }`}
                      onClick={() => navigate(child.path)}
                    >
                      <span className="sidebar__child-dot" />
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── Spacer + User info + Logout ──────────────────── */}
      <div className="sidebar__footer">
        <div className="sidebar__divider" />
        {!isCollapsed && (
          <div className="sidebar__user">
            <div className="sidebar__user-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">{user.name ?? 'Người dùng'}</span>
              <span className="sidebar__user-role">{ROLE_LABELS[role] ?? role}</span>
            </div>
          </div>
        )}
        <button
          className="sidebar__logout-btn"
          onClick={onLogout}
          title="Đăng xuất"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {!isCollapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};

/* ── Icon renderer (lucide-style SVG paths) ──────────────── */
const ICON_PATHS = {
  LayoutDashboard: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  BookOpen: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
  Wallet: 'M21 12V7H5a2 2 0 0 1 0-4h14v4M21 12a2 2 0 0 1 0 4H5a2 2 0 0 1-2-2v-5',
  CalendarCheck: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
  ClipboardList: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 12h6M9 16h6M9 8h6',
  Users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  Send: 'M22 2 11 13M22 2 15 22 11 13 2 9l20-7z',
  BarChart2: 'M18 20V10M12 20V4M6 20v-6',
  UserCircle: 'M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zM12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM6.32 18.5A9.97 9.97 0 0 1 12 16c2.3 0 4.4.78 6.08 2.08',
};

const SidebarIcon = ({ name }) => {
  const d = ICON_PATHS[name];
  if (!d) return <span className="sidebar__icon-placeholder" />;
  return (
    <svg
      className="sidebar__icon"
      width="18" height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
    >
      <path d={d} />
    </svg>
  );
};

export default Sidebar;
