const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { uploadDocument } = require('../middleware/upload');
const { uploadDocumentFile } = require('../controllers/uploadsController');

router.post('/', requireAdmin, uploadDocument.single('document'), uploadDocumentFile);

module.exports = router;
