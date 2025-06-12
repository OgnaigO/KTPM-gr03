const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/AuthController');

router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
