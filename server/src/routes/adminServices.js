const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { createService, updateService, removeService } = require('../controllers/servicesController');

router.post('/', requireAdmin, createService);
router.put('/:id', requireAdmin, updateService);
router.delete('/:id', requireAdmin, removeService);

module.exports = router;
