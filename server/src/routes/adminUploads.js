const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { upload, optimizeImage } = require('../middleware/upload');
const { uploadImage } = require('../controllers/uploadsController');

router.post('/', requireAdmin, upload.single('image'), optimizeImage({ maxWidth: 1200, quality: 82 }), uploadImage);

module.exports = router;
