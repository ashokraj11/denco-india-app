const router = require('express').Router();
const { listCategories } = require('../controllers/blogCategoriesController');

router.get('/', listCategories);

module.exports = router;
