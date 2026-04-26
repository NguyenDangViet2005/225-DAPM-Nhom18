import { locationVietNam } from "../data/LocationVietNam.js";

/**
 * Utility functions for address parsing and formatting
 */

/**
 * Parse địa chỉ từ chuỗi đầy đủ thành các thành phần riêng biệt
 * @param {string} fullAddress - Địa chỉ đầy đủ (VD: "789 Hùng Vương, Thanh Khê, Đà Nẵng")
 * @returns {object} - {duong: string, quan: string, tinh: string}
 */
export const parseAddress = (fullAddress) => {
  if (!fullAddress || typeof fullAddress !== 'string' || fullAddress.trim() === '') {
    return { duong: '', quan: '', tinh: '' };
  }

  // Tách địa chỉ theo dấu phẩy
  const parts = fullAddress.split(',').map(part => part.trim());
  
  if (parts.length >= 3) {
    // Trường hợp: "789 Hùng Vương, Thanh Khê, Đà Nẵng"
    return {
      duong: parts[0] || '',
      quan: parts[1] || '',
      tinh: parts[2] || ''
    };
  } else if (parts.length === 2) {
    // Trường hợp: "Thanh Khê, Đà Nẵng"
    return {
      duong: '',
      quan: parts[0] || '',
      tinh: parts[1] || ''
    };
  } else if (parts.length === 1) {
    // Trường hợp chỉ có 1 phần
    return {
      duong: parts[0] || '',
      quan: '',
      tinh: ''
    };
  }

  return { duong: '', quan: '', tinh: '' };
};

/**
 * Ghép các thành phần địa chỉ thành chuỗi đầy đủ
 * @param {string} duong - Số nhà, tên đường
 * @param {string} quan - Phường/Xã
 * @param {string} tinh - Tỉnh/Thành phố
 * @returns {string} - Địa chỉ đầy đủ
 */
export const formatAddress = (duong, quan, tinh) => {
  const parts = [duong, quan, tinh].filter(part => part && part.trim());
  return parts.join(', ');
};

/**
 * Lấy danh sách phường/xã theo tỉnh
 * @param {string} provinceName - Tên tỉnh/thành phố
 * @returns {array} - Danh sách phường/xã
 */
export const getWardsByProvince = (provinceName) => {
  if (!provinceName) return [];
  
  const selectedProvince = locationVietNam.find((p) => p.name === provinceName);
  return selectedProvince ? selectedProvince.wards : [];
};

/**
 * Tìm ward khớp với tên hiện tại (có thể không có prefix "Phường"/"Xã")
 * @param {string} wardName - Tên phường/xã cần tìm
 * @param {array} wards - Danh sách phường/xã
 * @returns {string} - Tên phường/xã đã chuẩn hóa
 */
export const findMatchingWard = (wardName, wards) => {
  if (!wardName || !wards || wards.length === 0) return "";
  
  // Tìm chính xác trước
  let found = wards.find(w => w.name === wardName);
  if (found) return found.name;
  
  // Tìm với prefix "Phường"
  found = wards.find(w => w.name === `Phường ${wardName}`);
  if (found) return found.name;
  
  // Tìm với prefix "Xã"
  found = wards.find(w => w.name === `Xã ${wardName}`);
  if (found) return found.name;
  
  // Tìm bằng cách bỏ prefix
  found = wards.find(w => w.name.replace(/^(Phường|Xã)\s+/, '') === wardName);
  if (found) return found.name;
  
  return wardName; // Trả về tên gốc nếu không tìm thấy
};

/**
 * Lấy danh sách tỉnh/thành phố
 * @returns {array} - Danh sách tỉnh/thành phố
 */
export const getProvinces = () => {
  return locationVietNam;
};