/**
 * Validation utilities - Các hàm validate dữ liệu
 */

/**
 * Validate email
 * @param {string} email - Email cần validate
 * @returns {boolean} - true nếu email hợp lệ
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate số điện thoại Việt Nam
 * @param {string} phone - Số điện thoại cần validate
 * @returns {boolean} - true nếu số điện thoại hợp lệ
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

/**
 * Validate chuỗi không rỗng
 * @param {string} value - Giá trị cần validate
 * @returns {boolean} - true nếu không rỗng
 */
export const isNotEmpty = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== "";
};

/**
 * Validate độ dài chuỗi
 * @param {string} value - Chuỗi cần validate
 * @param {number} min - Độ dài tối thiểu
 * @param {number} max - Độ dài tối đa
 * @returns {boolean} - true nếu độ dài hợp lệ
 */
export const isValidLength = (value, min = 0, max = Infinity) => {
  if (!value) return min === 0;
  const length = value.toString().trim().length;
  return length >= min && length <= max;
};

/**
 * Validate số
 * @param {any} value - Giá trị cần validate
 * @param {number} min - Giá trị tối thiểu
 * @param {number} max - Giá trị tối đa
 * @returns {boolean} - true nếu là số hợp lệ
 */
export const isValidNumber = (value, min = -Infinity, max = Infinity) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Validate ngày tháng
 * @param {string} date - Ngày cần validate (YYYY-MM-DD)
 * @returns {boolean} - true nếu ngày hợp lệ
 */
export const isValidDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

/**
 * Validate form với rules
 * @param {object} formData - Dữ liệu form
 * @param {object} rules - Rules validate cho từng field
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach((field) => {
    const value = formData[field];
    const fieldRules = rules[field];
    
    // Required
    if (fieldRules.required && !isNotEmpty(value)) {
      errors[field] = fieldRules.requiredMessage || `${field} không được để trống`;
      return;
    }
    
    // Skip other validations if empty and not required
    if (!isNotEmpty(value)) return;
    
    // Email
    if (fieldRules.email && !isValidEmail(value)) {
      errors[field] = fieldRules.emailMessage || "Email không hợp lệ";
      return;
    }
    
    // Phone
    if (fieldRules.phone && !isValidPhone(value)) {
      errors[field] = fieldRules.phoneMessage || "Số điện thoại không hợp lệ";
      return;
    }
    
    // Length
    if (fieldRules.minLength || fieldRules.maxLength) {
      const min = fieldRules.minLength || 0;
      const max = fieldRules.maxLength || Infinity;
      if (!isValidLength(value, min, max)) {
        errors[field] = fieldRules.lengthMessage || 
          `Độ dài phải từ ${min} đến ${max} ký tự`;
        return;
      }
    }
    
    // Number range
    if (fieldRules.min !== undefined || fieldRules.max !== undefined) {
      const min = fieldRules.min ?? -Infinity;
      const max = fieldRules.max ?? Infinity;
      if (!isValidNumber(value, min, max)) {
        errors[field] = fieldRules.numberMessage || 
          `Giá trị phải từ ${min} đến ${max}`;
        return;
      }
    }
    
    // Custom validator
    if (fieldRules.custom) {
      const customError = fieldRules.custom(value, formData);
      if (customError) {
        errors[field] = customError;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
