const router = require('express').Router();
const { createEnquiry } = require('../controllers/enquiriesController');

router.post('/', createEnquiry);

module.exports = router;
