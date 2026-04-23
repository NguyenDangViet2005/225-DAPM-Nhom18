/**
 * Filter utilities - Các hàm lọc và tìm kiếm dữ liệu
 */

/**
 * Tìm kiếm trong chuỗi (không phân biệt hoa thường, loại bỏ khoảng trắng thừa)
 * @param {string} text - Chuỗi cần tìm
 * @param {string} searchTerm - Từ khóa tìm kiếm
 * @returns {boolean} - true nếu tìm thấy
 */
export const searchInText = (text, searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) return true;
  if (!text) return false;
  
  const normalizedText = text.toLowerCase().trim();
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  return normalizedText.includes(normalizedSearch);
};

/**
 * Tìm kiếm trong nhiều trường
 * @param {object} item - Object cần tìm
 * @param {string[]} fields - Mảng tên các trường cần tìm
 * @param {string} searchTerm - Từ khóa tìm kiếm
 * @returns {boolean} - true nếu tìm thấy ở bất kỳ trường nào
 */
export const searchInFields = (item, fields, searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) return true;
  
  return fields.some((field) => {
    const value = item[field];
    return searchInText(String(value || ""), searchTerm);
  });
};

/**
 * Lọc theo trạng thái
 * @param {string} itemStatus - Trạng thái của item
 * @param {string} filterStatus - Trạng thái filter ("all" hoặc giá trị cụ thể)
 * @returns {boolean} - true nếu khớp filter
 */
export const filterByStatus = (itemStatus, filterStatus) => {
  if (!filterStatus || filterStatus === "all") return true;
  return itemStatus?.trim() === filterStatus;
};

/**
 * Lọc danh sách theo search term và status
 * @param {Array} items - Danh sách cần lọc
 * @param {string[]} searchFields - Các trường để tìm kiếm
 * @param {string} searchTerm - Từ khóa tìm kiếm
 * @param {string} statusField - Tên trường chứa trạng thái
 * @param {string} statusFilter - Giá trị filter trạng thái
 * @returns {Array} - Danh sách đã lọc
 */
export const filterList = (
  items,
  searchFields,
  searchTerm,
  statusField = "trangThai",
  statusFilter = "all",
) => {
  return items.filter((item) => {
    const matchesSearch = searchInFields(item, searchFields, searchTerm);
    const matchesStatus = filterByStatus(item[statusField], statusFilter);
    return matchesSearch && matchesStatus;
  });
};

/**
 * Tạo filter options cho dropdown
 * @param {Array} statuses - Mảng các trạng thái
 * @param {string} allLabel - Label cho option "Tất cả"
 * @returns {Array} - Mảng options cho select
 */
export const createFilterOptions = (statuses, allLabel = "Tất cả trạng thái") => {
  return [
    { value: "all", label: allLabel },
    ...statuses.map((status) => ({
      value: status,
      label: status,
    })),
  ];
};
