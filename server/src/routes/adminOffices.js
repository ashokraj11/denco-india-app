const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { createOffice, updateOffice, removeOffice } = require('../controllers/officesController');

router.post('/', requireAdmin, createOffice);
router.put('/:id', requireAdmin, updateOffice);
router.delete('/:id', requireAdmin, removeOffice);

module.exports = router;
