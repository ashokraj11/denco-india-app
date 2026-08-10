const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

// Writes to UPLOAD_DIR, which MUST point outside the deployed code folder in
// production — Hostinger's Git-deploy recreates the app's working directory
// on every redeploy, so anything saved inside it is wiped on the next push.
// Defaults to server/uploads/ for local dev (gitignored).
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new Error('Only image files (jpeg, png, webp, gif, svg) are allowed'));
    }
    cb(null, true);
  }
});

module.exports = { upload, uploadDir };
