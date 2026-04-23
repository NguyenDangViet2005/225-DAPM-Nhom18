import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Pagination.css";

/**
 * Pagination Component - Component phân trang tái sử dụng
 * 
 * @param {number} currentPage - Trang hiện tại
 * @param {number} totalPages - Tổng số trang
 * @param {number} totalItems - Tổng số items
 * @param {Function} onPageChange - Callback khi đổi trang
 * @param {boolean} loading - Trạng thái loading
 * @param {string} itemLabel - Label cho items (VD: "hoạt động", "đoàn viên")
 */
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  loading = false,
  itemLabel = "mục",
}) => {
  // Không hiển thị nếu chỉ có 1 trang
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1 && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination-container">
      <button
        className="pagination-btn"
        onClick={handlePrevious}
        disabled={currentPage === 1 || loading}
        title="Trang trước"
        aria-label="Trang trước"
      >
        <ChevronLeft size={16} />
      </button>

      <span className="pagination-info">
        Trang <strong>{currentPage}</strong> / {totalPages}
        {totalItems > 0 && (
          <span className="pagination-total">
            ({totalItems.toLocaleString("vi-VN")} {itemLabel})
          </span>
        )}
      </span>

      <button
        className="pagination-btn"
        onClick={handleNext}
        disabled={currentPage === totalPages || loading}
        title="Trang sau"
        aria-label="Trang sau"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
