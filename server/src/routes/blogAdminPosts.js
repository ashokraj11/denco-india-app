const router = require('express').Router();
const { requireBlogAdmin } = require('../middleware/blogAuth');
const { listAllPosts, createPost, updatePost, removePost } = require('../controllers/blogPostsController');

router.get('/', requireBlogAdmin, listAllPosts);
router.post('/', requireBlogAdmin, createPost);
router.put('/:id', requireBlogAdmin, updatePost);
router.delete('/:id', requireBlogAdmin, removePost);

module.exports = router;
