const router = require('express').Router();
const { requireBlogAdmin } = require('../middleware/blogAuth');
const { listCategories, createCategory, updateCategory, removeCategory } = require('../controllers/blogCategoriesController');

router.get('/', requireBlogAdmin, listCategories);
router.post('/', requireBlogAdmin, createCategory);
router.put('/:id', requireBlogAdmin, updateCategory);
router.delete('/:id', requireBlogAdmin, removeCategory);

module.exports = router;
