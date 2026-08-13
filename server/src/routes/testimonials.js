const router = require('express').Router();
const { listTestimonials } = require('../controllers/testimonialsController');

router.get('/', listTestimonials);

module.exports = router;
