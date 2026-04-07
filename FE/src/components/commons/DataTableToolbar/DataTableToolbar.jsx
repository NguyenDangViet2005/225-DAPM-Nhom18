import { Search, Filter } from 'lucide-react';
import './DataTableToolbar.css';

/**
 * DataTableToolbar - Component dùng chung để tìm kiếm và lọc dữ liệu
 * 
 * @param {string} searchTerm      - Giá trị tìm kiếm hiện tại
 * @param {Function} onSearchChange - Hàm xử lý thay đổi tìm kiếm
 * @param {string} placeholder     - Gợi ý trong ô tìm kiếm
 * @param {string} filterValue     - Giá trị lọc hiện tại
 * @param {Function} onFilterChange - Hàm xử lý thay đổi bộ lọc
 * @param {Array} filterOptions    - Danh sách các option cho bộ lọc [{value, label}]
 * @param {ReactNode} children     - Các nút action bổ sung
 */
const DataTableToolbar = ({
  searchTerm,
  onSearchChange,
  placeholder = "Tìm kiếm...",
  filterValue,
  onFilterChange,
  filterOptions = [],
  children
}) => {
  return (
    <div className="common-toolbar">
      <div className="common-search-wrap">
        <Search size={18} />
        <input 
          type="text" 
          className="common-search-input" 
          placeholder={placeholder} 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="common-toolbar-actions">
        {filterOptions && filterOptions.length > 0 && (
          <select 
            className="common-filter-select"
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
          >
            {filterOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )}

        <button className="common-btn-outline">
          <Filter size={18} />
          <span>Bộ lọc</span>
        </button>

        {children}
      </div>
    </div>
  );
};

export default DataTableToolbar;
