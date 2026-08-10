const router = require('express').Router();
const { login } = require('../controllers/authController');
const { listEnquiries, deleteEnquiry } = require('../controllers/enquiriesController');
const { requireAdmin } = require('../middleware/auth');

router.post('/login', login);
router.get('/enquiries', requireAdmin, listEnquiries);
router.delete('/enquiries/:id', requireAdmin, deleteEnquiry);

module.exports = router;
