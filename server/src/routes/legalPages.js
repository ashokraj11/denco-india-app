const router = require('express').Router();
const { getAllPages, getPage } = require('../controllers/legalPagesController');

router.get('/', getAllPages);
router.get('/:slug', getPage);

module.exports = router;
