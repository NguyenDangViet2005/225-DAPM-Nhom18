/**
 * Pagination utilities - Các hàm tiện ích cho phân trang
 */

/**
 * Tạo state pagination mặc định
 */
export const createPaginationState = (limit = 10) => ({
  page: 1,
  limit,
  total: 0,
  totalPages: 1,
});

/**
 * Cập nhật pagination state từ API response
 */
export const updatePaginationFromResponse = (response, currentLimit = 10) => {
  if (!response?.pagination) {
    return createPaginationState(currentLimit);
  }

  return {
    page: response.pagination.currentPage || response.pagination.page || 1,
    limit: currentLimit,
    total: response.pagination.totalItems || response.pagination.total || 0,
    totalPages: response.pagination.totalPages || 1,
  };
};

/**
 * Tính toán trang mới sau khi xóa item
 * Nếu xóa item cuối cùng của trang, quay về trang trước
 */
export const calculatePageAfterDelete = (
  currentPage,
  itemsInCurrentPage,
  totalPages,
) => {
  if (itemsInCurrentPage === 1 && currentPage > 1) {
    return currentPage - 1;
  }
  return currentPage;
};

/**
 * Kiểm tra có nên hiển thị pagination không
 */
export const shouldShowPagination = (totalPages) => totalPages > 1;
