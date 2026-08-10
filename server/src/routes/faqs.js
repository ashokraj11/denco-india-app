const router = require('express').Router();
const { listFaqs } = require('../controllers/faqsController');

router.get('/', listFaqs);

module.exports = router;
