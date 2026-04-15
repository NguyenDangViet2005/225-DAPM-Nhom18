const express = require("express");
const router = express.Router();
const {
  login,
  refreshTokenHandler,
  logout,
  getMe,
} = require("../controllers/auth.controller");
const { loginValidator } = require("../validators/auth.validator");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/login", loginValidator, login);
router.post("/refresh-token", refreshTokenHandler);
router.post("/logout", logout);
router.get("/me", verifyToken, getMe);

module.exports = router;
