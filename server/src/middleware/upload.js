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

// Resumes are candidate PII, unlike everything else in uploadDir (which is
// served publicly at /uploads). Kept as a private SIBLING directory --
// never mounted with express.static -- and only ever read back through the
// authenticated admin download endpoint in jobApplicationsController.js.
const resumeDir = path.join(path.dirname(uploadDir), 'resumes');
fs.mkdirSync(resumeDir, { recursive: true });

const IMAGE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);
const VIDEO_MIME = new Set(['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']);
const DOCUMENT_MIME = new Set(['application/pdf']);
const RESUME_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  }
});

const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, resumeDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  }
});

// Used for logos, product photos, certification images — images only, kept
// small since these are rendered inline all over the public site.
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!IMAGE_MIME.has(file.mimetype)) {
      return cb(new Error('Only image files (jpeg, png, webp, gif, svg) are allowed'));
    }
    cb(null, true);
  }
});

// Used for the Technology & Infrastructure gallery, which accepts photos or
// short video clips — a separate, larger limit so the ordinary image fields
// above stay capped at 5MB.
const uploadMedia = multer({
  storage,
  limits: { fileSize: 60 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!IMAGE_MIME.has(file.mimetype) && !VIDEO_MIME.has(file.mimetype)) {
      return cb(new Error('Only image (jpeg, png, webp, gif, svg) or video (mp4, webm, ogg, mov) files are allowed'));
    }
    cb(null, true);
  }
});

// Used for the downloadable company brochure — a single PDF, kept separate
// from uploadMedia's image/video limit since a brochure can run larger.
const uploadDocument = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!DOCUMENT_MIME.has(file.mimetype)) {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  }
});

// Used for hero slider backgrounds — full-width photography, which routinely
// exceeds upload's 5MB cap meant for small inline images. Images only (no
// video), just a bigger ceiling.
const uploadHeroImage = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!IMAGE_MIME.has(file.mimetype)) {
      return cb(new Error('Only image files (jpeg, png, webp, gif, svg) are allowed'));
    }
    cb(null, true);
  }
});

// Used for job application resumes — PDF or Word doc, written to the
// private resumeDir above rather than the publicly-served uploadDir.
const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!RESUME_MIME.has(file.mimetype)) {
      return cb(new Error('Only PDF or Word (.pdf, .doc, .docx) files are allowed'));
    }
    cb(null, true);
  }
});

module.exports = { upload, uploadMedia, uploadDocument, uploadHeroImage, uploadResume, uploadDir, resumeDir, IMAGE_MIME };
