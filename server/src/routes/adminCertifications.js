const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { createCertification, updateCertification, removeCertification } = require('../controllers/certificationsController');

router.post('/', requireAdmin, createCertification);
router.put('/:id', requireAdmin, updateCertification);
router.delete('/:id', requireAdmin, removeCertification);

module.exports = router;
