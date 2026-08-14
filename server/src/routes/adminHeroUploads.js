const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { uploadHeroImage } = require('../middleware/upload');
const { uploadImage } = require('../controllers/uploadsController');

router.post('/', requireAdmin, uploadHeroImage.single('image'), uploadImage);

module.exports = router;
