const express = require('express');
const router = express.Router();
const feeController = require('../app/controllers/FeeController');
const { ensureAuthenticated, isKeToan } = require('../app/middleware/auth');

router.get('/create', ensureAuthenticated, isKeToan, feeController.create);
router.post('/create', ensureAuthenticated, isKeToan, feeController.store);
router.delete('/:id', ensureAuthenticated, isKeToan, feeController.delete);
router.get('/:id/edit', ensureAuthenticated, isKeToan, feeController.edit);
router.put('/:id', ensureAuthenticated, isKeToan, feeController.update);
router.get('/:id', ensureAuthenticated, isKeToan, feeController.showDetail);
router.get('/', ensureAuthenticated, isKeToan, feeController.index);

module.exports = router;
