const router = require('express').Router();
const { listHeroHeadlines } = require('../controllers/heroHeadlinesController');

router.get('/', listHeroHeadlines);

module.exports = router;
