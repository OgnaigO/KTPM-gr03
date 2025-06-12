const express = require('express');
const router = express.Router();
const householdController = require('../app/controllers/HouseholdController');
const { ensureAuthenticated, permit } = require('../app/middleware/auth');

// Cho phép truy cập các chức năng tùy vào role
const canViewHouseholds = permit('admin', 'totruong', 'topho', 'ketoan');
const canManageHouseholds = permit('admin', 'totruong', 'topho');


router.get('/create', ensureAuthenticated, canManageHouseholds, householdController.create);     // chỉ tổ trưởng/tổ phó/admin
router.post('/create', ensureAuthenticated, canManageHouseholds, householdController.store);
router.get('/:id/edit', ensureAuthenticated, canManageHouseholds, householdController.edit);
router.put('/:id', ensureAuthenticated, canManageHouseholds, householdController.update);
router.delete('/:id', ensureAuthenticated, canManageHouseholds, householdController.delete);
router.get('/', ensureAuthenticated, canViewHouseholds, householdController.index);             // kế toán có thể xem

router.get('/:slug', ensureAuthenticated, canViewHouseholds, householdController.showHouseholdBySlug);

module.exports = router;
