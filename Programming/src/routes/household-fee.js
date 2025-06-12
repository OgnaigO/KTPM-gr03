const express = require('express');
const router = express.Router();
const HouseholdFeeController = require('../app/controllers/HouseholdFeeController');
const { ensureAuthenticated, isKeToan } = require('../app/middleware/auth');

router.get('/add-contribution/:fee_id', ensureAuthenticated, isKeToan, HouseholdFeeController.showAddContribution);
router.post('/:id/pay', ensureAuthenticated, isKeToan, HouseholdFeeController.pay);
router.post('/add-contribution', ensureAuthenticated, isKeToan, HouseholdFeeController.addContribution);

module.exports = router;
