const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/UserController');
const { ensureAuthenticated } = require('../app/middleware/auth');

router.get('/change-info', ensureAuthenticated, userController.showChangeInfoForm);
router.post('/change-info', ensureAuthenticated, userController.changeInfo);

module.exports = router;
