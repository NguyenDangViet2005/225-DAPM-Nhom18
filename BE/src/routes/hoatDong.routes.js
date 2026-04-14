const express = require('express');
const router = express.Router();
const hoatDongController= require('../controllers/hoatDong.controller');
router.get('/:idHD/dangky',hoatDongController.getDanhSachDangKy);
module.exports= router;