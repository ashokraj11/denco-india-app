const router = require('express').Router();
const { listHeroSlides } = require('../controllers/heroSlidesController');

router.get('/', listHeroSlides);

module.exports = router;
