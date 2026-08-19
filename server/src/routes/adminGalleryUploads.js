const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { uploadMedia, optimizeImage } = require('../middleware/upload');
const { uploadMediaFile } = require('../controllers/uploadsController');

router.post('/', requireAdmin, uploadMedia.single('media'), optimizeImage({ maxWidth: 1600, quality: 80 }), uploadMediaFile);

module.exports = router;
