const { body } = require("express-validator");

const createMucDoanPhiValidator = [
  body("namHoc")
    .trim()
    .notEmpty().withMessage("Năm học không được để trống")
    .matches(/^\d{4}-\d{4}$/).withMessage("Năm học phải có định dạng YYYY-YYYY"),

  body("soTien")
    .notEmpty().withMessage("Số tiền không được để trống")
    .isNumeric().withMessage("Số tiền phải là số")
    .custom((v) => v > 0).withMessage("Số tiền phải lớn hơn 0"),
];

module.exports = { createMucDoanPhiValidator };
