const router = require('express').Router();
const { login } = require('../controllers/authController');
const { listEnquiries, exportEnquiriesCsv, updateEnquiryStatus, deleteEnquiry } = require('../controllers/enquiriesController');
const { requireAdmin } = require('../middleware/auth');

router.post('/login', login);
router.get('/enquiries', requireAdmin, listEnquiries);
router.get('/enquiries/export', requireAdmin, exportEnquiriesCsv);
router.put('/enquiries/:id', requireAdmin, updateEnquiryStatus);
router.delete('/enquiries/:id', requireAdmin, deleteEnquiry);

module.exports = router;
