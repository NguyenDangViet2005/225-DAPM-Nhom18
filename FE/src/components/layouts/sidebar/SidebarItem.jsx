/**
 * SidebarItem – Component con phục vụ việc render từng mục navigation
 * Bao gồm cả mục đơn và mục có chứa các sub-item (dropdown)
 */

const SidebarItem = ({
  item,
  isCollapsed,
  isActive,
  isGroupActive,
  isOpen,
  toggleGroup,
  navigate,
  SidebarIcon,
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const groupActive = isGroupActive(item);

  return (
    <div key={item.key} className="sidebar__item-group">
      <button
        className={`sidebar__item${
          isActive(item.path) || (groupActive && !hasChildren)
            ? " sidebar__item--active"
            : ""
        }${groupActive && hasChildren ? " sidebar__item--group-active" : ""}`}
        onClick={() => {
          if (hasChildren) {
            toggleGroup(item.key);
          } else {
            navigate(item.path);
          }
        }}
        title={isCollapsed ? item.label : undefined}
      >
        <div className="sidebar__item-icon-wrap">
          <SidebarIcon name={item.icon} />
        </div>
        {!isCollapsed && (
          <>
            <span className="sidebar__item-label">{item.label}</span>
            {hasChildren && (
              <span
                className={`sidebar__chevron${isOpen ? " sidebar__chevron--open" : ""}`}
              >
                <SidebarIcon name="ChevronRight" />
              </span>
            )}
          </>
        )}
      </button>

      {hasChildren && isOpen && !isCollapsed && (
        <div className="sidebar__children">
          {item.children.map((child) => (
            <button
              key={child.key}
              className={`sidebar__child-item${
                isActive(child.path) ? " sidebar__child-item--active" : ""
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
};

export default SidebarItem;
