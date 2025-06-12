const express = require('express');
const router = express.Router();
const citizenController = require('../app/controllers/CitizenController');
const householdController = require('../app/controllers/HouseholdController');
const { ensureAuthenticated, permit } = require('../app/middleware/auth');
const canViewHouseholds = permit('admin', 'totruong', 'topho', 'ketoan');

const canManageHouseholds = permit('admin', 'totruong', 'topho');

router.get('/create', ensureAuthenticated, canManageHouseholds, citizenController.create);
router.post('/create', ensureAuthenticated, canManageHouseholds, citizenController.store);
router.get('/', ensureAuthenticated, canManageHouseholds, citizenController.index);
router.get('/:id/edit', ensureAuthenticated, canManageHouseholds, citizenController.edit);
router.put('/:id', ensureAuthenticated, canManageHouseholds, citizenController.update);
router.delete('/:id', ensureAuthenticated, canManageHouseholds, citizenController.delete);
router.get('/:slug', ensureAuthenticated, canViewHouseholds, householdController.showHouseholdBySlug);

module.exports = router;
