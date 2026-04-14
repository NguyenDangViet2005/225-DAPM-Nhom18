const express = require("express");
const router = express.Router();
const {
  login,
  refreshTokenHandler,
  logout,
} = require("../controllers/auth.controller");
const { loginValidator } = require("../validators/auth.validator");

router.post("/login", loginValidator, login);
router.post("/refresh-token", refreshTokenHandler);
router.post("/logout", logout);

module.exports = router;
