const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Hàm tạo thư mục nếu chưa có
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Cấu hình lưu trữ động theo subfolder
const createStorage = (subfolder) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(__dirname, `../../uploads/${subfolder}`);
      ensureDir(uploadDir);
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });
};

// Kiểm tra loại file cho phiếu thu (ảnh + PDF)
const phieuThuFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ hỗ trợ định dạng JPG, PNG hoặc PDF!"), false);
  }
};

// Kiểm tra loại file cho ảnh thẻ (chỉ ảnh)
const photoFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ hỗ trợ định dạng JPG, PNG!"), false);
  }
};

// Upload cho phiếu thu (10MB, ảnh + PDF)
const uploadPhieuThu = multer({
  storage: createStorage("phieuthu"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: phieuThuFilter,
});

// Upload cho ảnh thẻ (5MB, chỉ ảnh)
const uploadAnhThe = multer({
  storage: createStorage("anhthe"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: photoFilter,
});

// Export default cho phiếu thu (backward compatibility)
module.exports = uploadPhieuThu;

// Export các loại upload khác
module.exports.uploadPhieuThu = uploadPhieuThu;
module.exports.uploadAnhThe = uploadAnhThe;
