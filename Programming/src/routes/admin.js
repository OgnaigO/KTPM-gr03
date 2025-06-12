const express = require('express');
const router = express.Router();
const adminController = require('../app/controllers/AdminController');
const { isAdmin } = require('../app/middleware/auth');

router.get('/dashboard', isAdmin, adminController.dashboard);  // Trang dashboard
router.get('/users/create', isAdmin, adminController.showCreateUserForm);
router.post('/users/create', isAdmin, adminController.createUser);
router.delete('/users/:id', isAdmin, adminController.deleteUser);  // Xóa user

module.exports = router;
