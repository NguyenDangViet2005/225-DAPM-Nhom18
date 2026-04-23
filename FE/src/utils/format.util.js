/**
 * Format utilities - Các hàm format dữ liệu hiển thị
 */

/**
 * Format số thành định dạng tiền tệ Việt Nam
 * @param {number} value - Số cần format
 * @returns {string} - Chuỗi đã format (VD: "1.000.000 ₫")
 */
export const formatMoney = (value) => {
  if (!value && value !== 0) return "—";
  return `${Number(value).toLocaleString("vi-VN")} ₫`;
};

/**
 * Format số với dấu phân cách hàng nghìn
 * @param {number} value - Số cần format
 * @returns {string} - Chuỗi đã format (VD: "1.000")
 */
export const formatNumber = (value) => {
  if (!value && value !== 0) return "0";
  return new Intl.NumberFormat("vi-VN").format(value);
};

/**
 * Format ngày giờ đầy đủ
 * @param {string|Date} date - Ngày giờ cần format
 * @returns {string} - Chuỗi ngày giờ đã format
 */
export const formatDateTime = (date) => {
  if (!date) return "—";
  
  return new Date(date).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format ngày cho input type="date"
 * @param {string|Date} date - Ngày cần format
 * @returns {string} - Chuỗi định dạng YYYY-MM-DD
 */
export const formatDateForInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

/**
 * Cắt chuỗi và thêm dấu "..." nếu quá dài
 * @param {string} text - Chuỗi cần cắt
 * @param {number} maxLength - Độ dài tối đa
 * @returns {string} - Chuỗi đã cắt
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Format số điện thoại Việt Nam
 * @param {string} phone - Số điện thoại
 * @returns {string} - Số điện thoại đã format
 */
export const formatPhone = (phone) => {
  if (!phone) return "—";
  // Format: 0xxx xxx xxx hoặc 0xxxx xxx xxx
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  }
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
  }
  return phone;
};
