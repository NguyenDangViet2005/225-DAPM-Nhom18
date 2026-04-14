const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token không được cung cấp hoặc định dạng không đúng",
      });
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Token không hợp lệ hoặc đã hết hạn",
        });
      }

      // Attach user info to request
      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi xác thực token",
    });
  }
};

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Chưa xác thực",
      });
    }

    if (!allowedRoles.includes(req.user.type)) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập tài nguyên này",
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  checkRole,
};
