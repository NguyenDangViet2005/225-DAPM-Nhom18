import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getSidebarItems } from "@/configs/SidebarConfig";
import { ROLE_LABELS } from "@/constants";
import SidebarItem from "./SidebarItem";
import { X } from "lucide-react";
import "./Sidebar.css";

const Sidebar = ({
  role,
  permissions = [],
  isCollapsed = false,
  isMobileOpen = false,
  onToggle,
  onCloseMobile,
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
    <aside
      className={`sidebar${isCollapsed ? " sidebar--collapsed" : ""}${isMobileOpen ? " sidebar--mobile-open" : ""}`}
    >
      {/* ── Branding ─────────────────────────────────────── */}
      <div className="sidebar__brand">
        <div className="sidebar__brand-logo-wrapper">
          <img src="/images/ute.png" alt="UTE Logo" className="sidebar__logo" />
          {(!isCollapsed || isMobileOpen) && (
            <span className="sidebar__brand-name">UTE ĐOÀN</span>
          )}
        </div>

        {/* Toggle cho Desktop */}
        <button
          className="sidebar__toggle-btn desktop-only"
          onClick={onToggle}
          title={isCollapsed ? "Mở rộng" : "Thu nhỏ"}
        >
          <SidebarIcon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} />
        </button>

        {/* Close cho Mobile */}
        <button
          className="sidebar__toggle-btn mobile-only"
          onClick={onCloseMobile}
        >
          <X size={20} />
        </button>
      </div>

      {/* ── Role badge ───────────────────────────────────── */}
      {(!isCollapsed || isMobileOpen) && (
        <div className="sidebar__role-badge">{ROLE_LABELS[role] ?? role}</div>
      )}

      <div className="sidebar__divider" />

      {/* ── Navigation ───────────────────────────────────── */}
      <nav className="sidebar__nav">
        {items.map((item) => (
          <SidebarItem
            key={item.key}
            item={item}
            isCollapsed={isCollapsed && !isMobileOpen} // Không collapse khi ở mobile drawer
            isActive={isActive}
            isGroupActive={isGroupActive}
            isOpen={openGroups[item.key] ?? isGroupActive(item)}
            toggleGroup={toggleGroup}
            navigate={navigate}
            SidebarIcon={SidebarIcon}
          />
        ))}
      </nav>

      {/* ── Footer ───────────────────────────────────────── */}
      <div className="sidebar__footer">
        <div className="sidebar__divider" />
        {(!isCollapsed || isMobileOpen) && (
          <div className="sidebar__user">
            <div className="sidebar__user-avatar">
              {user?.hoTen ? user.hoTen.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">
                {user?.hoTen ?? "Người dùng"}
              </span>
              <span className="sidebar__user-role">
                {ROLE_LABELS[role] ?? role}
              </span>
            </div>
          </div>
        )}
        <button
          className="sidebar__logout-btn"
          onClick={onLogout}
          title="Đăng xuất"
        >
          <div className="sidebar__item-icon-wrap">
            <SidebarIcon name="LogOut" />
          </div>
          {(!isCollapsed || isMobileOpen) && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};

/* ── Icon Paths Module (SVG Paths) ───────────────────────── */
const ICON_PATHS = {
  LayoutDashboard: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  BookOpen:
    "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  Wallet:
    "M21 12V7H5a2 2 0 0 1 0-4h14v4M21 12a2 2 0 0 1 0 4H5a2 2 0 0 1-2-2v-5",
  CalendarCheck: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3",
  ClipboardList:
    "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 12h6M9 16h6M9 8h6",
  Users:
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  User: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  Send: "M22 2 11 13M22 2 15 22 11 13 2 9l20-7z",
  BarChart2: "M18 20V10M12 20V4M6 20v-6",
  UserCircle:
    "M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zM12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM6.32 18.5A9.97 9.97 0 0 1 12 16c2.3 0 4.4.78 6.08 2.08",
  GraduationCap:
    "M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5",
  ChevronLeft: "M15 18l-6-6 6-6",
  ChevronRight: "M9 18l6-6-6-6",
  LogOut: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
};

const SidebarIcon = ({ name }) => {
  const d = ICON_PATHS[name];
  if (!d) return null;
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
};

export default Sidebar;
