const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { createFaq, updateFaq, removeFaq } = require('../controllers/faqsController');

router.post('/', requireAdmin, createFaq);
router.put('/:id', requireAdmin, updateFaq);
router.delete('/:id', requireAdmin, removeFaq);

module.exports = router;
