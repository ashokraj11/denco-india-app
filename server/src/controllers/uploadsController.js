const { IMAGE_MIME } = require('../middleware/upload');

function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided (field name must be "image")' });
  }
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
}

function uploadMediaFile(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided (field name must be "media")' });
  }
  const type = IMAGE_MIME.has(req.file.mimetype) ? 'image' : 'video';
  res.status(201).json({ url: `/uploads/${req.file.filename}`, type });
}

module.exports = { uploadImage, uploadMediaFile };
