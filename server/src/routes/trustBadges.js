const router = require('express').Router();
const { listTrustBadges } = require('../controllers/trustBadgesController');

router.get('/', listTrustBadges);

module.exports = router;
