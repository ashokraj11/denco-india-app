const router = require('express').Router();
const { listPublishedPosts, getPublishedPostBySlug } = require('../controllers/blogPostsController');

router.get('/', listPublishedPosts);
router.get('/:slug', getPublishedPostBySlug);

module.exports = router;
