const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { updatePage } = require('../controllers/legalPagesController');

router.put('/:slug', requireAdmin, updatePage);

module.exports = router;
