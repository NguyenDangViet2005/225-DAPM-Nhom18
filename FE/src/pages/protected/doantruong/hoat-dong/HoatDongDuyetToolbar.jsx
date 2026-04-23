import { Search } from "lucide-react";

const HoatDongDuyetToolbar = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <div className="hd-toolbar" style={{ marginBottom: "1rem" }}>
      <div className="hd-search-wrap" style={{ flex: 1 }}>
        <Search size={18} />
        <input
          type="text"
          className="hd-search-input"
          placeholder="Tìm tên đoàn viên, MSSV hoặc tên hoạt động (Trường)..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <select
        className="hd-filter-select"
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
      >
        <option value="all">Tất cả</option>
        <option value="Chờ duyệt">Chờ duyệt</option>
        <option value="Đã duyệt">Đã duyệt</option>
        <option value="Từ chối">Từ chối</option>
      </select>
    </div>
  );
};

export default HoatDongDuyetToolbar;
