const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { createTestimonial, updateTestimonial, removeTestimonial } = require('../controllers/testimonialsController');

router.post('/', requireAdmin, createTestimonial);
router.put('/:id', requireAdmin, updateTestimonial);
router.delete('/:id', requireAdmin, removeTestimonial);

module.exports = router;
