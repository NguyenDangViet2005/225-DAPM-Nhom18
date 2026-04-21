const { body } = require("express-validator");

/**
 * Validator cho việc TẠO tài khoản mới
 */
const createTaiKhoanValidator = [
  body("tenNguoiDung")
    .trim()
    .notEmpty()
    .withMessage("Tên đăng nhập không được để trống")
    .isLength({ min: 4, max: 100 })
    .withMessage("Tên đăng nhập phải từ 4-100 ký tự")
    // Cho phép chữ, số, dấu chấm, @, gạch dưới, gạch ngang
    .matches(/^[a-zA-Z0-9._@\-_]+$/)
    .withMessage("Tên đăng nhập chỉ chứa chữ, số, dấu chấm, @, gạch dưới hoặc gạch ngang"),

  body("matKhau")
    .notEmpty()
    .withMessage("Mật khẩu không được để trống")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải ít nhất 6 ký tự"),

  body("idVaiTro")
    .trim()
    .notEmpty()
    .withMessage("Vai trò không được để trống"),

  // idDV: optional — có thể null, undefined, hoặc chuỗi bất kỳ (bao gồm mã SV 14+ ký tự)
  body("idDV")
    .optional({ nullable: true, checkFalsy: false })
    .trim()
    .isLength({ max: 15 })
    .withMessage("Mã Đoàn viên không được quá 15 ký tự"),

  // idKhoa: optional
  body("idKhoa")
    .optional({ nullable: true, checkFalsy: false })
    .trim()
    .isLength({ max: 15 })
    .withMessage("Mã Khoa không được quá 15 ký tự"),
];

/**
 * Validator cho việc CẬP NHẬT tài khoản
 */
const updateTaiKhoanValidator = [
  body("tenNguoiDung")
    .optional()
    .trim()
    .isLength({ min: 4, max: 100 })
    .withMessage("Tên đăng nhập phải từ 4-100 ký tự")
    .matches(/^[a-zA-Z0-9._@\-_]+$/)
    .withMessage("Tên đăng nhập chỉ chứa chữ, số, dấu chấm, @, gạch dưới hoặc gạch ngang"),

  body("idVaiTro")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Vai trò không được để trống"),

  body("trangThai")
    .optional()
    .isBoolean()
    .withMessage("Trạng thái phải là true hoặc false"),

  body("idDV")
    .optional({ nullable: true, checkFalsy: false })
    .trim()
    .isLength({ max: 15 })
    .withMessage("Mã Đoàn viên không được quá 15 ký tự"),

  body("idKhoa")
    .optional({ nullable: true, checkFalsy: false })
    .trim()
    .isLength({ max: 15 })
    .withMessage("Mã Khoa không được quá 15 ký tự"),
];

/**
 * Validator cho việc ĐẶT LẠI mật khẩu
 */
const resetPasswordValidator = [
  body("matKhauMoi")
    .notEmpty()
    .withMessage("Mật khẩu mới không được để trống")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu mới phải ít nhất 6 ký tự"),
];

module.exports = {
  createTaiKhoanValidator,
  updateTaiKhoanValidator,
  resetPasswordValidator,
};
