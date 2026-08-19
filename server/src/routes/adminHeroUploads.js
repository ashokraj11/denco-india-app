const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { uploadHeroImage, optimizeImage } = require('../middleware/upload');
const { uploadImage } = require('../controllers/uploadsController');

router.post('/', requireAdmin, uploadHeroImage.single('image'), optimizeImage({ maxWidth: 1920, quality: 78 }), uploadImage);

module.exports = router;
