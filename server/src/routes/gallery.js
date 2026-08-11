const router = require('express').Router();
const { listGallery } = require('../controllers/galleryController');

router.get('/', listGallery);

module.exports = router;
