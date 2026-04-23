/**
 * API utilities - Các hàm tiện ích cho API calls
 */

/**
 * Xử lý lỗi API và trả về message thân thiện
 * @param {Error} error - Error object từ API
 * @param {string} defaultMessage - Message mặc định nếu không có message từ API
 * @returns {string} - Error message
 */
export const getErrorMessage = (error, defaultMessage = "Có lỗi xảy ra") => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return defaultMessage;
};

/**
 * Xử lý response từ API
 * @param {object} response - Response từ API
 * @returns {object} - { success, data, message }
 */
export const handleApiResponse = (response) => {
  if (response?.success) {
    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  }
  return {
    success: false,
    data: null,
    message: response?.message || "Không thể xử lý yêu cầu",
  };
};

/**
 * Tạo query params từ object
 * @param {object} params - Object chứa các params
 * @returns {string} - Query string (VD: "?page=1&limit=10")
 */
export const buildQueryParams = (params) => {
  const filtered = Object.entries(params).filter(
    ([_, value]) => value !== null && value !== undefined && value !== "",
  );
  
  if (filtered.length === 0) return "";
  
  const queryString = filtered
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  
  return `?${queryString}`;
};

/**
 * Retry API call với exponential backoff
 * @param {Function} apiCall - Hàm API cần gọi
 * @param {number} maxRetries - Số lần retry tối đa
 * @param {number} delay - Delay ban đầu (ms)
 * @returns {Promise} - Promise của API call
 */
export const retryApiCall = async (
  apiCall,
  maxRetries = 3,
  delay = 1000,
) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};

/**
 * Debounce function cho search
 * @param {Function} func - Hàm cần debounce
 * @param {number} wait - Thời gian chờ (ms)
 * @returns {Function} - Hàm đã debounce
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
