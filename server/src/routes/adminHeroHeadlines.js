const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { createHeroHeadline, updateHeroHeadline, removeHeroHeadline } = require('../controllers/heroHeadlinesController');

router.post('/', requireAdmin, createHeroHeadline);
router.put('/:id', requireAdmin, updateHeroHeadline);
router.delete('/:id', requireAdmin, removeHeroHeadline);

module.exports = router;
