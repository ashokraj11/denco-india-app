const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { updateSettings } = require('../controllers/settingsController');

router.put('/', requireAdmin, updateSettings);

module.exports = router;
