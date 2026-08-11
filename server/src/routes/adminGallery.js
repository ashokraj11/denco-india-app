const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { createGalleryItem, updateGalleryItem, removeGalleryItem } = require('../controllers/galleryController');

router.post('/', requireAdmin, createGalleryItem);
router.put('/:id', requireAdmin, updateGalleryItem);
router.delete('/:id', requireAdmin, removeGalleryItem);

module.exports = router;
