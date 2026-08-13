const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { createHeroSlide, updateHeroSlide, removeHeroSlide } = require('../controllers/heroSlidesController');

router.post('/', requireAdmin, createHeroSlide);
router.put('/:id', requireAdmin, updateHeroSlide);
router.delete('/:id', requireAdmin, removeHeroSlide);

module.exports = router;
