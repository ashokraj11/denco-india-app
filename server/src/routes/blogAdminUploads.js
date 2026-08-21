const router = require('express').Router();
const { requireBlogAdmin } = require('../middleware/blogAuth');
const { uploadHeroImage, optimizeImage } = require('../middleware/upload');
const { uploadImage } = require('../controllers/uploadsController');

// Shared by the cover-image field and the RichTextEditor's inline image
// button -- both just need a URL back, so one endpoint covers both.
router.post('/', requireBlogAdmin, uploadHeroImage.single('image'), optimizeImage({ maxWidth: 1600, quality: 80 }), uploadImage);

module.exports = router;
