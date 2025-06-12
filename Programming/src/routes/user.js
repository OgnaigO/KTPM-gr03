const express = require('express');
const router = express.Router();
const { ensureAuthenticated, permit } = require('./middleware/auth');

// Ví dụ route quản lý nhân khẩu - chỉ tổ trưởng/tổ phó và admin được phép
router.get('/citizen', ensureAuthenticated, permit('admin', 'totruong', 'topho'), (req, res) => {
  // xử lý hiển thị nhân khẩu
});

// Ví dụ route quản lý khoản thu - chỉ kế toán và admin được phép
router.get('/fee', ensureAuthenticated, permit('admin', 'ketoan'), (req, res) => {
  // xử lý hiển thị khoản thu
});