const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { listCategories, createCategory, updateCategory, removeCategory } = require('../controllers/categoriesController');

router.get('/', requireAdmin, listCategories);
router.post('/', requireAdmin, createCategory);
router.put('/:id', requireAdmin, updateCategory);
router.delete('/:id', requireAdmin, removeCategory);

module.exports = router;
