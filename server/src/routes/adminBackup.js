const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { uploadBackupJson, uploadBackupZip } = require('../middleware/backupUpload');
const { exportDatabase, importDatabase, exportFiles, importFiles } = require('../controllers/backupController');

router.get('/database', requireAdmin, exportDatabase);
router.post('/database/restore', requireAdmin, uploadBackupJson.single('backup'), importDatabase);
router.get('/files', requireAdmin, exportFiles);
router.post('/files/restore', requireAdmin, uploadBackupZip.single('backup'), importFiles);

module.exports = router;
