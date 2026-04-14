const express = require('express');
const router = express.Router();
const hoatDongController= require('../controllers/hoatDong.controller');
// api lay danh sach
router.get('/:idHD/dangky',hoatDongController.getDanhSachDangKy);
// api duyet / tu choi
router.put('/:idHD/duyet',hoatDongController.duyetDangKy);
module.exports= router;