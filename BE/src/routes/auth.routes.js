const express = require('express');
const router = express.Router();
const { login, refreshTokenHandler } = require('../controllers/taikhoan.controller');
const { loginValidator } = require('../validators/taikhoan.validator');

// Public routes (no authentication required)
router.post('/login', loginValidator, login);
router.post('/refresh-token', refreshTokenHandler);

module.exports = router;
