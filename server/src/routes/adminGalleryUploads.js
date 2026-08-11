const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { uploadMedia } = require('../middleware/upload');
const { uploadMediaFile } = require('../controllers/uploadsController');

router.post('/', requireAdmin, uploadMedia.single('media'), uploadMediaFile);

module.exports = router;
