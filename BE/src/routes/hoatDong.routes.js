const express = require('express');
const router = express.Router();
const hoatDongController= require('../controllers/hoatDong.controller');
// api lay danh sach hoat dong 
router.get('/', hoatDongController.getDanhSachHoatDong);
// api lay danh sach dang ky
router.get('/:idHD/dangky',hoatDongController.getDanhSachDangKy);
// api duyet / tu choi
router.put('/:idHD/duyet',hoatDongController.duyetDangKy);
module.exports= router;