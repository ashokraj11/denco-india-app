const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { uploadImage } = require('../controllers/uploadsController');

router.post('/', requireAdmin, upload.single('image'), uploadImage);

module.exports = router;
