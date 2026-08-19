const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const sharp = require('sharp');

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

// Used for the Gallery, which accepts photos or video clips up to 3GB — a
// separate, much larger limit so the ordinary image fields above stay
// capped at 5MB. See server.js for the matching HTTP server timeout a
// file this size needs to survive uploading on a slow connection.
const uploadMedia = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 * 1024 },
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

// GIF (animated frames would be flattened) and SVG (vector -- resizing/
// re-encoding it as a raster would defeat the point) are deliberately left
// untouched; only the raster formats sharp can safely re-compress.
const OPTIMIZABLE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

// Runs after a multer .single(...) middleware, in place -- resizes (if wider
// than maxWidth) and re-compresses the file multer just wrote to disk, then
// overwrites it at the same path/filename so nothing downstream changes.
// Uploaded photos routinely arrive multi-megabyte straight from a phone
// camera; this is what actually makes pages served from /uploads fast,
// rather than relying on the browser to somehow render a 6MB JPEG quickly.
function optimizeImage({ maxWidth, quality = 80 } = {}) {
  return async (req, res, next) => {
    const file = req.file;
    if (!file || !OPTIMIZABLE_MIME.has(file.mimetype)) return next();
    try {
      // Read the whole file into memory first rather than pointing sharp at
      // file.path directly -- sharp/libvips can still hold that path open
      // while we then try to write the result back to the same path, which
      // fails outright on Windows (file locking) and is safer to avoid
      // relying on elsewhere too.
      const original = await fs.promises.readFile(file.path);
      let pipeline = sharp(original, { failOn: 'none' }).rotate();
      const { width } = await pipeline.metadata();
      if (maxWidth && width && width > maxWidth) {
        pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
      }
      if (file.mimetype === 'image/jpeg') {
        pipeline = pipeline.jpeg({ quality, mozjpeg: true });
      } else if (file.mimetype === 'image/png') {
        pipeline = pipeline.png({ quality, compressionLevel: 9 });
      } else if (file.mimetype === 'image/webp') {
        pipeline = pipeline.webp({ quality });
      }
      const buffer = await pipeline.toBuffer();
      await fs.promises.writeFile(file.path, buffer);
      file.size = buffer.length;
    } catch (err) {
      // Optimization is a nice-to-have -- never let it block the upload.
      console.error('Image optimization failed, keeping original file as-is:', err.message);
    }
    next();
  };
}

module.exports = { upload, uploadMedia, uploadDocument, uploadHeroImage, uploadResume, uploadDir, resumeDir, IMAGE_MIME, optimizeImage };
