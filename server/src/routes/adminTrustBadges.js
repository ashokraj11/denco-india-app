const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { createTrustBadge, updateTrustBadge, removeTrustBadge } = require('../controllers/trustBadgesController');

router.post('/', requireAdmin, createTrustBadge);
router.put('/:id', requireAdmin, updateTrustBadge);
router.delete('/:id', requireAdmin, removeTrustBadge);

module.exports = router;
