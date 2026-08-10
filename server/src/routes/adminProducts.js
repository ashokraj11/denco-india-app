const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { createProduct, updateProduct, removeProduct } = require('../controllers/productsController');

router.post('/', requireAdmin, createProduct);
router.put('/:id', requireAdmin, updateProduct);
router.delete('/:id', requireAdmin, removeProduct);

module.exports = router;
