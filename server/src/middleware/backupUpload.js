const os = require('os');
const multer = require('multer');

// Database backup files are just JSON text — small, kept in memory.
const uploadBackupJson = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/json' && !file.originalname.toLowerCase().endsWith('.json')) {
      return cb(new Error('Please upload the .json file produced by "Download Database Backup"'));
    }
    cb(null, true);
  }
});

// Files backups (a zip of the whole uploads folder) can be large, so these
// go to a temp file on disk rather than memory.
const uploadBackupZip = multer({
  storage: multer.diskStorage({ destination: (req, file, cb) => cb(null, os.tmpdir()) }),
  limits: { fileSize: 300 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const okMime = ['application/zip', 'application/x-zip-compressed', 'application/octet-stream'].includes(file.mimetype);
    if (!okMime && !file.originalname.toLowerCase().endsWith('.zip')) {
      return cb(new Error('Please upload the .zip file produced by "Download Files Backup"'));
    }
    cb(null, true);
  }
});

module.exports = { uploadBackupJson, uploadBackupZip };
