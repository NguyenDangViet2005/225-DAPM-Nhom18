import { useState } from "react";
import { Bell, Search } from "lucide-react";

const DashboardHeader = ({ user, searchTerm, onSearchChange }) => {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header__greeting">
        <h2 className="dashboard-header__title">
          Chào mừng trở lại, {(user?.name || "Đoàn Trường").split(" ").pop()}
        </h2>
        <p className="dashboard-header__date">
          {new Date().toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="dashboard-header__actions">
        <div className="dashboard-search">
          <Search size={16} className="dashboard-search__icon" />
          <input
            type="text"
            className="dashboard-search__input"
            placeholder="Tìm kiếm đoàn viên chờ duyệt..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button className="dashboard-header__bell" title="Thông báo">
          <Bell size={20} />
          <span className="dashboard-header__bell-dot" />
        </button>
        <div className="dashboard-header__avatar" title={user?.name}>
          {(user?.name || "D").charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
